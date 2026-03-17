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

const SalonInfoTab = ({ editing, editData, onFieldChange, salon }: SalonInfoTabProps) => (
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
            value={editData.tariff || 'basic'}
            onValueChange={(v) => onFieldChange('tariff', v)}
          >
            <SelectTrigger
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
              <SelectItem value="basic" style={{ color: '#111827' }}>Basic</SelectItem>
              <SelectItem value="standard" style={{ color: '#111827' }}>Standard</SelectItem>
              <SelectItem value="premium" style={{ color: '#111827' }}>Premium</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm" style={{ color: '#111827' }}>{salon.tariff}</p>
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

export default SalonInfoTab;
