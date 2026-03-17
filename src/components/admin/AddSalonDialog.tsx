import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const STATUSES = [
  { value: 'new', label: 'Новый' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
  { value: 'training', label: 'Обучение' },
  { value: 'certified', label: 'Сертифицирован' },
  { value: 'archive', label: 'Архив' },
];

interface NewSalonData {
  name: string;
  city: string;
  owner_name: string;
  phone: string;
  email: string;
  description: string;
  techniques: string;
  tariff: string;
  status: string;
}

interface AddSalonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newSalon: NewSalonData;
  onFieldChange: (data: NewSalonData) => void;
  onSave: () => void;
  saving: boolean;
}

const AddSalonDialog = ({
  open,
  onOpenChange,
  newSalon,
  onFieldChange,
  onSave,
  saving,
}: AddSalonDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="sm:max-w-lg"
      style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }}
    >
      <DialogHeader>
        <DialogTitle className="font-sans" style={{ color: '#111827' }}>
          Добавить салон
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto">
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#374151' }}>Название *</Label>
          <Input
            value={newSalon.name}
            onChange={(e) => onFieldChange({ ...newSalon, name: e.target.value })}
            placeholder="Название салона"
            className="text-sm"
            style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm" style={{ color: '#374151' }}>Город</Label>
            <Input
              value={newSalon.city}
              onChange={(e) => onFieldChange({ ...newSalon, city: e.target.value })}
              placeholder="Город"
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm" style={{ color: '#374151' }}>Владелец</Label>
            <Input
              value={newSalon.owner_name}
              onChange={(e) => onFieldChange({ ...newSalon, owner_name: e.target.value })}
              placeholder="Имя владельца"
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm" style={{ color: '#374151' }}>Телефон</Label>
            <Input
              value={newSalon.phone}
              onChange={(e) => onFieldChange({ ...newSalon, phone: e.target.value })}
              placeholder="+7 (999) 999-99-99"
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm" style={{ color: '#374151' }}>Email</Label>
            <Input
              value={newSalon.email}
              onChange={(e) => onFieldChange({ ...newSalon, email: e.target.value })}
              placeholder="email@example.com"
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm" style={{ color: '#374151' }}>Тариф</Label>
            <Select
              value={newSalon.tariff}
              onValueChange={(v) => onFieldChange({ ...newSalon, tariff: v })}
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
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm" style={{ color: '#374151' }}>Статус</Label>
            <Select
              value={newSalon.status}
              onValueChange={(v) => onFieldChange({ ...newSalon, status: v })}
            >
              <SelectTrigger
                className="text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#374151' }}>Описание</Label>
          <textarea
            value={newSalon.description}
            onChange={(e) => onFieldChange({ ...newSalon, description: e.target.value })}
            placeholder="Описание салона"
            rows={3}
            className="flex w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm" style={{ color: '#374151' }}>Техники</Label>
          <Input
            value={newSalon.techniques}
            onChange={(e) => onFieldChange({ ...newSalon, techniques: e.target.value })}
            placeholder="Массажные техники через запятую"
            className="text-sm"
            style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
          />
        </div>
      </div>
      <DialogFooter>
        <button
          onClick={() => onOpenChange(false)}
          className="h-9 px-4 rounded-lg text-sm font-medium border transition-colors"
          style={{ borderColor: '#d1d5db', color: '#374151', background: '#ffffff' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
        >
          Отмена
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="h-9 px-4 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: '#0da2e7' }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#0b8dcc'; }}
          onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = '#0da2e7'; }}
        >
          {saving ? 'Сохранение...' : 'Создать'}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AddSalonDialog;