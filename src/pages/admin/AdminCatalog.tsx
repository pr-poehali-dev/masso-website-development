import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDateTime } from '@/lib/admin-api';
import { toast } from 'sonner';

const SETTINGS_URL = 'https://functions.poehali.dev/49c21920-2064-4a7b-bd3a-98a7e14428b2';

interface Tariff {
  id: number;
  name: string;
  price: number;
  price_on_request: boolean;
  description: string | null;
  features: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminCatalog = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Tariff>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newTariff, setNewTariff] = useState({ name: '', price: '', description: '', features: '', price_on_request: false });
  const [saving, setSaving] = useState(false);

  const fetchTariffs = () => {
    fetch(`${SETTINGS_URL}?section=tariffs`, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(res => setTariffs(res.tariffs || []))
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTariffs(); }, []);

  const handleAdd = async () => {
    if (!newTariff.name.trim()) { toast.error('Название обязательно'); return; }
    setSaving(true);
    const res = await fetch(SETTINGS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_tariff', name: newTariff.name, price: Number(newTariff.price) || 0, description: newTariff.description, features: newTariff.features, price_on_request: newTariff.price_on_request }),
    }).then(r => r.json());
    if (res.tariff) {
      setTariffs([...tariffs, res.tariff]);
      setShowAdd(false);
      setNewTariff({ name: '', price: '', description: '', features: '', price_on_request: false });
      toast.success('Тариф создан');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleSave = async () => {
    if (!editId) return;
    setSaving(true);
    const res = await fetch(SETTINGS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_tariff', id: editId, ...editData, price: Number(editData.price) || 0 }),
    }).then(r => r.json());
    if (res.tariff) {
      setTariffs(tariffs.map(t => t.id === editId ? res.tariff : t));
      setEditId(null);
      toast.success('Сохранено');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleToggle = async (tariff: Tariff) => {
    const res = await fetch(SETTINGS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_tariff', id: tariff.id, is_active: !tariff.is_active }),
    }).then(r => r.json());
    if (res.tariff) {
      setTariffs(tariffs.map(t => t.id === tariff.id ? res.tariff : t));
      toast.success(res.tariff.is_active ? 'Активирован' : 'Деактивирован');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6b7280' }}>Управление тарифами и продуктами</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white"
          style={{ background: '#0da2e7' }}
        >
          <Icon name="Plus" size={16} />
          Добавить тариф
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Новый тариф</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Название</Label>
              <Input value={newTariff.name} onChange={e => setNewTariff({ ...newTariff, name: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Цена (руб.)</Label>
              <Input type="number" value={newTariff.price} onChange={e => setNewTariff({ ...newTariff, price: e.target.value })} disabled={newTariff.price_on_request} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input type="checkbox" checked={newTariff.price_on_request} onChange={e => setNewTariff({ ...newTariff, price_on_request: e.target.checked })} className="rounded" />
                <span className="text-xs" style={{ color: '#6b7280' }}>По запросу</span>
              </label>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Описание</Label>
              <Input value={newTariff.description} onChange={e => setNewTariff({ ...newTariff, description: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Функции (через запятую)</Label>
              <textarea value={newTariff.features} onChange={e => setNewTariff({ ...newTariff, features: e.target.value })} rows={2} className="flex w-full rounded-md border px-3 py-2 text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} disabled={saving} className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
              Создать
            </button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-lg text-sm font-medium border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {tariffs.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="BookOpen" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Нет тарифов</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tariffs.map(tariff => (
            <div key={tariff.id} className="rounded-xl border p-5 flex flex-col" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
              {editId === tariff.id ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Название</Label>
                    <Input value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Цена</Label>
                    <Input type="number" value={editData.price || ''} onChange={e => setEditData({ ...editData, price: Number(e.target.value) })} disabled={!!editData.price_on_request} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                    <label className="flex items-center gap-2 mt-1 cursor-pointer">
                      <input type="checkbox" checked={!!editData.price_on_request} onChange={e => setEditData({ ...editData, price_on_request: e.target.checked })} className="rounded" />
                      <span className="text-xs" style={{ color: '#6b7280' }}>По запросу</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Описание</Label>
                    <Input value={editData.description || ''} onChange={e => setEditData({ ...editData, description: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Функции</Label>
                    <textarea value={editData.features || ''} onChange={e => setEditData({ ...editData, features: e.target.value })} rows={2} className="flex w-full rounded-md border px-3 py-2 text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="h-8 px-3 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
                      Сохранить
                    </button>
                    <button onClick={() => setEditId(null)} className="h-8 px-3 rounded-lg text-sm font-medium border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: '#111827' }}>{tariff.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${tariff.is_active ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'}`}>
                        {tariff.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                    <p className="text-xl font-bold" style={{ color: '#0da2e7' }}>
                      {tariff.price_on_request ? 'По запросу' : <>{Number(tariff.price).toLocaleString('ru-RU')} <span className="text-sm font-normal">руб.</span></>}
                    </p>
                  </div>
                  {tariff.description && <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{tariff.description}</p>}
                  {tariff.features && (
                    <div className="mb-3">
                      {tariff.features.split(',').map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm py-0.5">
                          <Icon name="Check" size={14} style={{ color: '#22c55e' }} />
                          <span style={{ color: '#374151' }}>{f.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{formatDateTime(tariff.updated_at)}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggle(tariff)} className="p-2 rounded-lg hover:bg-gray-50" title={tariff.is_active ? 'Деактивировать' : 'Активировать'}>
                        <Icon name={tariff.is_active ? 'EyeOff' : 'Eye'} size={16} style={{ color: '#6b7280' }} />
                      </button>
                      <button onClick={() => { setEditId(tariff.id); setEditData({ name: tariff.name, price: tariff.price, description: tariff.description || '', features: tariff.features || '', price_on_request: tariff.price_on_request }); }} className="p-2 rounded-lg hover:bg-gray-50">
                        <Icon name="Pencil" size={16} style={{ color: '#6b7280' }} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;