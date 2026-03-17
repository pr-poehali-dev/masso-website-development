import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUSES = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новый' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
  { value: 'training', label: 'Обучение' },
  { value: 'certified', label: 'Сертифицирован' },
  { value: 'archive', label: 'Архив' },
];

interface SalonsFiltersProps {
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAddClick: () => void;
}

const SalonsFilters = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onAddClick,
}: SalonsFiltersProps) => (
  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
      <div className="relative flex-1 max-w-md">
        <Icon
          name="Search"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: '#9ca3af' }}
        />
        <Input
          placeholder="Поиск по имени, городу, владельцу..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 text-sm"
          style={{
            background: '#ffffff',
            borderColor: '#d1d5db',
            color: '#111827',
          }}
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger
          className="w-full sm:w-[180px] h-10 text-sm"
          style={{
            background: '#ffffff',
            borderColor: '#d1d5db',
            color: '#111827',
          }}
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
    <button
      onClick={onAddClick}
      className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center"
      style={{ background: '#0da2e7' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#0b8dcc')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#0da2e7')}
    >
      <Icon name="Plus" size={16} />
      Добавить салон
    </button>
  </div>
);

export default SalonsFilters;