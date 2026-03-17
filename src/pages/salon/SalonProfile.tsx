import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { salonFetch, salonPut, getSalonInfo, setSalonSession, getSalonUser } from '@/lib/salon-api';
import { toast } from 'sonner';

const SalonProfile = () => {
  const [salon, setSalon] = useState<Record<string, string | number | null>>({});
  const [settings, setSettings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string | number>>({});

  useEffect(() => {
    salonFetch('profile')
      .then(res => {
        setSalon(res.salon || {});
        setSettings(res.settings || {});
        setForm({
          name: res.salon?.name || '',
          city: res.salon?.city || '',
          owner_name: res.salon?.owner_name || '',
          phone: res.salon?.phone || '',
          email: res.salon?.email || '',
          techniques: res.salon?.techniques || '',
          specialists_count: res.settings?.specialists_count || 1,
          clients_per_day: res.settings?.clients_per_day || 4,
          avg_price: res.settings?.avg_price || 3000,
          working_days: res.settings?.working_days || 22,
          procedure_course: res.settings?.procedure_course || 1,
          procedure_duration: res.settings?.procedure_duration || 1.5,
          working_hours: res.settings?.working_hours || 8,
        });
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

  const Field = ({ label, field, type = 'text' }: { label: string; field: string; type?: string }) => (
    <div className="space-y-1.5">
      <Label className="text-xs" style={{ color: '#6b7280' }}>{label}</Label>
      {editing ? (
        <Input
          type={type}
          value={form[field] || ''}
          onChange={e => setForm({ ...form, [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
          className="text-sm"
          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
        />
      ) : (
        <p className="text-sm font-medium py-2" style={{ color: '#111827' }}>{form[field] || '-'}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div />
        {editing ? (
          <div className="flex gap-2">
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

      <div className="rounded-xl p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Основная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Название салона" field="name" />
          <Field label="Город" field="city" />
          <Field label="Владелец" field="owner_name" />
          <Field label="Телефон" field="phone" />
          <Field label="Email" field="email" />
          <Field label="Техники (через запятую)" field="techniques" />
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Параметры для расчётов</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Кол-во специалистов" field="specialists_count" type="number" />
          <Field label="Клиентов в день" field="clients_per_day" type="number" />
          <Field label="Средняя цена (руб.)" field="avg_price" type="number" />
          <Field label="Рабочих дней" field="working_days" type="number" />
          <Field label="Курс процедур" field="procedure_course" type="number" />
          <Field label="Длительность (часы)" field="procedure_duration" type="number" />
          <Field label="Рабочие часы" field="working_hours" type="number" />
        </div>
      </div>
    </div>
  );
};

export default SalonProfile;
