import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDateTime } from '@/lib/admin-api';

const SETTINGS_URL = 'https://functions.poehali.dev/49c21920-2064-4a7b-bd3a-98a7e14428b2';

interface Tariff {
  id: number;
  name: string;
  price: number;
  price_on_request: boolean;
  is_active: boolean;
}

interface SalonInfoTabProps {
  editing: boolean;
  editData: Record<string, string | undefined>;
  onFieldChange: (field: string, value: string) => void;
  salon: {
    name: string;
    city: string | null;
    owner_name: string | null;
    phone: string | null;
    email: string | null;
    tariff: string;
    description: string | null;
    techniques: string | null;
    created_at: string;
    updated_at: string;
    is_published: boolean;
  };
}

const SalonInfoTab = ({ editing, editData, onFieldChange, salon }: SalonInfoTabProps) => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  useEffect(() => {
    fetch(`${SETTINGS_URL}?section=tariffs`, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(res => setTariffs((res.tariffs || []).filter((t: Tariff) => t.is_active)))
      .catch(() => {});
  }, []);

  const currentTariffName = tariffs.find(t => t.name === (editData.tariff || salon.tariff))?.name
    || editData.tariff
    || salon.tariff;

  return (
    <div
      className="rounded-xl border p-6 mt-4"
      style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Название</Label>
          {editing ? (
            <Input
              value={editData.name || ''}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm font-medium" style={{ color: '#111827' }}>{salon.name}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Город</Label>
          {editing ? (
            <Input
              value={editData.city || ''}
              onChange={(e) => onFieldChange('city', e.target.value)}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#111827' }}>{salon.city || '-'}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Владелец</Label>
          {editing ? (
            <Input
              value={editData.owner_name || ''}
              onChange={(e) => onFieldChange('owner_name', e.target.value)}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#111827' }}>{salon.owner_name || '-'}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Телефон</Label>
          {editing ? (
            <Input
              value={editData.phone || ''}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#111827' }}>{salon.phone || '-'}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Email</Label>
          {editing ? (
            <Input
              value={editData.email || ''}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#111827' }}>{salon.email || '-'}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Тариф</Label>
          {editing ? (
            <Select
              value={editData.tariff || salon.tariff}
              onValueChange={(v) => onFieldChange('tariff', v)}
            >
              <SelectTrigger
                className="text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
                {tariffs.length > 0 ? tariffs.map(t => (
                  <SelectItem key={t.id} value={t.name} style={{ color: '#111827' }}>
                    <span>{t.name}</span>
                    <span className="ml-2 text-xs" style={{ color: '#9ca3af' }}>
                      {t.price_on_request ? '— По запросу' : `— ${Number(t.price).toLocaleString('ru-RU')} ₽`}
                    </span>
                  </SelectItem>
                )) : (
                  <SelectItem value={salon.tariff} style={{ color: '#111827' }}>{salon.tariff}</SelectItem>
                )}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium" style={{ color: '#111827' }}>{currentTariffName || '-'}</p>
              {tariffs.find(t => t.name === salon.tariff) && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#eff6ff', color: '#0da2e7' }}>
                  {tariffs.find(t => t.name === salon.tariff)?.price_on_request
                    ? 'По запросу'
                    : `${Number(tariffs.find(t => t.name === salon.tariff)?.price).toLocaleString('ru-RU')} ₽`}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Описание</Label>
          {editing ? (
            <textarea
              value={editData.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              rows={3}
              className="flex w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#111827' }}>{salon.description || '-'}</p>
          )}
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-sm" style={{ color: '#6b7280' }}>Техники</Label>
          {editing ? (
            <Input
              value={editData.techniques || ''}
              onChange={(e) => onFieldChange('techniques', e.target.value)}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#111827' }}>{salon.techniques || '-'}</p>
          )}
        </div>
      </div>
      <div
        className="mt-5 pt-4 border-t flex items-center gap-4 text-xs"
        style={{ borderColor: '#f3f4f6', color: '#9ca3af' }}
      >
        <span>Создан: {formatDateTime(salon.created_at)}</span>
        <span>Обновлен: {formatDateTime(salon.updated_at)}</span>
        <span>Опубликован: {salon.is_published ? 'Да' : 'Нет'}</span>
      </div>
    </div>
  );
};

export default SalonInfoTab;
