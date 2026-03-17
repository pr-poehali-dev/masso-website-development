import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { salonFetch, salonPut, getSalonInfo, setSalonSession, getSalonUser } from '@/lib/salon-api';
import { toast } from 'sonner';

interface TariffInfo {
  id: number;
  name: string;
  price: number;
  price_on_request: boolean;
  description: string | null;
  features: string | null;
}

const TARIFF_LABELS: Record<string, string> = {
  basic: 'Базовый',
  advanced: 'Расширенный',
  full: 'Полный',
};

const Field = ({
  label, field, type = 'text', editing, form, setForm,
}: {
  label: string; field: string; type?: string;
  editing: boolean;
  form: Record<string, string | number>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string | number>>>;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs" style={{ color: '#6b7280' }}>{label}</Label>
    {editing ? (
      <Input
        type={type}
        value={form[field] ?? ''}
        onChange={e => setForm(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
        className="text-sm"
        style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
      />
    ) : (
      <p className="text-sm font-medium py-2" style={{ color: '#111827' }}>{form[field] || '-'}</p>
    )}
  </div>
);

const SalonProfile = () => {
  const [salon, setSalon] = useState<Record<string, string | number | null>>({});
  const [settings, setSettings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [tariffs, setTariffs] = useState<TariffInfo[]>([]);
  const [currentTariff, setCurrentTariff] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      salonFetch('profile'),
      salonFetch('tariffs'),
    ]).then(([profileRes, tariffsRes]) => {
      setSalon(profileRes.salon || {});
      setSettings(profileRes.settings || {});
      setCurrentTariff(profileRes.salon?.tariff || null);
      setForm({
        name: profileRes.salon?.name || '',
        city: profileRes.salon?.city || '',
        owner_name: profileRes.salon?.owner_name || '',
        phone: profileRes.salon?.phone || '',
        email: profileRes.salon?.email || '',
        techniques: profileRes.salon?.techniques || '',
        specialists_count: profileRes.settings?.specialists_count || 1,
        clients_per_day: profileRes.settings?.clients_per_day || 4,
        avg_price: profileRes.settings?.avg_price || 3000,
        working_days: profileRes.settings?.working_days || 22,
        procedure_course: profileRes.settings?.procedure_course || 1,
        procedure_duration: profileRes.settings?.procedure_duration || 1.5,
        working_hours: profileRes.settings?.working_hours || 8,
      });
      setTariffs(tariffsRes.tariffs || []);
    })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await salonPut('profile', form);
    if (res.salon) {
      setSalon(res.salon);
      setSettings(res.settings || {});
      setEditing(false);
      toast.success('Профиль обновлён');
      const user = getSalonUser();
      const info = getSalonInfo();
      if (user && info) {
        setSalonSession(user, { ...info, name: String(res.salon.name) });
      }
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;

  const currentTariffInfo = tariffs.find(t => t.name.toLowerCase() === currentTariff || t.name === currentTariff);
  const tariffLabel = currentTariff ? (TARIFF_LABELS[currentTariff] || currentTariff) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-xl p-4 sm:p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="CreditCard" size={16} style={{ color: '#6b7280' }} />
          <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Ваш тариф</h3>
        </div>

        {currentTariff ? (
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: '#eff6ff' }}>
            <div className="flex-1">
              <p className="text-base font-semibold" style={{ color: '#1d4ed8' }}>
                {currentTariffInfo?.name || tariffLabel}
              </p>
              {currentTariffInfo?.description && (
                <p className="text-xs mt-0.5" style={{ color: '#3b82f6' }}>{currentTariffInfo.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: '#0da2e7' }}>
                {currentTariffInfo?.price_on_request
                  ? 'По запросу'
                  : currentTariffInfo
                  ? `${Number(currentTariffInfo.price).toLocaleString('ru-RU')} ₽`
                  : '—'}
              </p>
              <p className="text-xs" style={{ color: '#6b7280' }}>в год</p>
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#9ca3af' }}>Тариф не назначен. Обратитесь к менеджеру МассоПРО.</p>
        )}

        {tariffs.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium mb-3" style={{ color: '#6b7280' }}>Доступные тарифы</p>
            <div className="space-y-2">
              {tariffs.map(t => {
                const isActive = t.name === currentTariffInfo?.name;
                return (
                  <div
                    key={t.id}
                    className="rounded-lg border p-3 flex items-center justify-between"
                    style={{
                      borderColor: isActive ? '#0da2e7' : '#e5e7eb',
                      background: isActive ? '#f0f9ff' : '#fafafa',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {isActive && <Icon name="CheckCircle2" size={14} style={{ color: '#0da2e7' }} />}
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#111827' }}>{t.name}</p>
                        {t.description && <p className="text-xs" style={{ color: '#9ca3af' }}>{t.description}</p>}
                      </div>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: isActive ? '#0da2e7' : '#374151' }}>
                      {t.price_on_request ? 'По запросу' : `${Number(t.price).toLocaleString('ru-RU')} ₽`}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
              Для смены тарифа обратитесь к вашему менеджеру МассоПРО.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div />
        {editing ? (
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleSave} disabled={saving} className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
              Сохранить
            </button>
            <button onClick={() => setEditing(false)} className="h-9 px-4 rounded-lg text-sm border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
              Отмена
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white" style={{ background: '#0da2e7' }}>
            <Icon name="Pencil" size={14} /> Редактировать
          </button>
        )}
      </div>

      <div className="rounded-xl p-4 sm:p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Основная информация</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Название салона" field="name" editing={editing} form={form} setForm={setForm} />
          <Field label="Город" field="city" editing={editing} form={form} setForm={setForm} />
          <Field label="Владелец" field="owner_name" editing={editing} form={form} setForm={setForm} />
          <Field label="Телефон" field="phone" editing={editing} form={form} setForm={setForm} />
          <Field label="Email" field="email" editing={editing} form={form} setForm={setForm} />
          <Field label="Техники (через запятую)" field="techniques" editing={editing} form={form} setForm={setForm} />
        </div>
      </div>

      <div className="rounded-xl p-4 sm:p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Параметры для расчётов</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Кол-во специалистов" field="specialists_count" type="number" editing={editing} form={form} setForm={setForm} />
          <Field label="Клиентов в день" field="clients_per_day" type="number" editing={editing} form={form} setForm={setForm} />
          <Field label="Средняя цена (руб.)" field="avg_price" type="number" editing={editing} form={form} setForm={setForm} />
          <Field label="Рабочих дней" field="working_days" type="number" editing={editing} form={form} setForm={setForm} />
          <Field label="Курс процедур" field="procedure_course" type="number" editing={editing} form={form} setForm={setForm} />
          <Field label="Длительность (часы)" field="procedure_duration" type="number" editing={editing} form={form} setForm={setForm} />
          <Field label="Рабочие часы" field="working_hours" type="number" editing={editing} form={form} setForm={setForm} />
        </div>
      </div>
    </div>
  );
};

export default SalonProfile;