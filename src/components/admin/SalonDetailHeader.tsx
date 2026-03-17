import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getSalonStatusLabel,
  getSalonStatusColor,
} from '@/lib/admin-api';

const STATUSES = [
  { value: 'new', label: 'Новый' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
  { value: 'training', label: 'Обучение' },
  { value: 'certified', label: 'Сертифицирован' },
  { value: 'archive', label: 'Архив' },
];

interface SalonDetailHeaderProps {
  salonId: number;
  salonName: string;
  salonStatus: string;
  fullAccess: boolean;
  editing: boolean;
  saving: boolean;
  onBack: () => void;
  onStatusChange: (status: string) => void;
  onFullAccessChange: (value: boolean) => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onSave: () => void;
}

const SalonDetailHeader = ({
  salonId,
  salonName,
  salonStatus,
  fullAccess,
  editing,
  saving,
  onBack,
  onStatusChange,
  onFullAccessChange,
  onEditStart,
  onEditCancel,
  onSave,
}: SalonDetailHeaderProps) => (
  <div className="flex flex-col gap-3">
    {/* Row 1: back + name */}
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="p-2 rounded-lg border transition-colors shrink-0"
        style={{ borderColor: '#e5e7eb', color: '#374151' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '')}
      >
        <Icon name="ArrowLeft" size={18} />
      </button>
      <div className="min-w-0">
        <h2 className="text-base sm:text-xl font-bold font-sans truncate" style={{ color: '#111827' }}>
          {salonName}
        </h2>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-sm" style={{ color: '#6b7280' }}>ID: {salonId}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getSalonStatusColor(salonStatus)}`}>
            {getSalonStatusLabel(salonStatus)}
          </span>
        </div>
      </div>
    </div>

    {/* Row 2: controls */}
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFullAccessChange(!fullAccess)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border transition-colors"
        style={{
          background: fullAccess ? '#f0fdf4' : '#f9fafb',
          borderColor: fullAccess ? '#86efac' : '#d1d5db',
          color: fullAccess ? '#16a34a' : '#6b7280',
        }}
      >
        <Icon name={fullAccess ? 'Unlock' : 'Lock'} size={13} />
        {fullAccess ? 'Полный доступ' : 'Базовый доступ'}
      </button>

      <Select value={salonStatus} onValueChange={onStatusChange}>
        <SelectTrigger
          className="h-9 text-xs min-w-[120px] flex-1 sm:flex-none sm:w-[150px]"
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

      {!editing ? (
        <button
          onClick={onEditStart}
          className="h-9 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 ml-auto"
          style={{ background: '#0da2e7' }}
        >
          <Icon name="Pencil" size={13} />
          Редактировать
        </button>
      ) : (
        <div className="flex gap-2 ml-auto">
          <button
            onClick={onEditCancel}
            className="h-9 px-3 rounded-lg text-xs font-medium border"
            style={{ borderColor: '#d1d5db', color: '#374151', background: '#ffffff' }}
          >
            Отмена
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="h-9 px-3 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: '#22c55e' }}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}
    </div>
  </div>
);

export default SalonDetailHeader;