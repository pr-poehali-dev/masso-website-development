import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getTrainingStatusLabel,
  getTrainingStatusColor,
  formatDate,
} from '@/lib/admin-api';

interface Specialist {
  id: number;
  name: string;
  email: string | null;
  salon_name: string;
  experience_years: number;
  training_status: string;
  attestation_status: string;
  created_at: string;
}

const TRAINING_STATUSES = [
  { value: 'all', label: 'Все статусы' },
  { value: 'added', label: 'Добавлен' },
  { value: 'in_progress', label: 'Обучается' },
  { value: 'completed', label: 'Завершил' },
  { value: 'certified', label: 'Сертифицирован' },
];

const demoSpecialists: Specialist[] = [
  {
    id: 1,
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    salon_name: 'Салон "Аура"',
    experience_years: 5,
    training_status: 'completed',
    attestation_status: 'passed',
    created_at: '2026-03-10T09:00:00',
  },
  {
    id: 2,
    name: 'Олег Козлов',
    email: 'oleg@example.com',
    salon_name: 'СПА "Релакс"',
    experience_years: 3,
    training_status: 'in_progress',
    attestation_status: 'none',
    created_at: '2026-03-12T14:00:00',
  },
  {
    id: 3,
    name: 'Елена Волкова',
    email: null,
    salon_name: 'Студия массажа',
    experience_years: 8,
    training_status: 'certified',
    attestation_status: 'passed',
    created_at: '2026-03-08T11:30:00',
  },
];

const AdminSpecialists = () => {
  const [specialists] = useState<Specialist[]>(demoSpecialists);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = specialists.filter((s) => {
    if (statusFilter !== 'all' && s.training_status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        s.salon_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
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
              placeholder="Поиск по имени, email, салону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-full sm:w-[180px] h-10 text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
              {TRAINING_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2 flex-shrink-0"
          style={{ background: '#0da2e7' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#0b8dcc')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0da2e7')}
        >
          <Icon name="Plus" size={16} />
          Добавить специалиста
        </button>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Users" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
            <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>Специалисты не найдены</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#e5e7eb' }}>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Имя</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Email</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Салон</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Стаж</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Обучение</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Аттестация</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((spec) => (
                <TableRow
                  key={spec.id}
                  style={{ borderColor: '#f3f4f6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>{spec.id}</TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>{spec.name}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{spec.email || '-'}</TableCell>
                  <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>{spec.salon_name}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{spec.experience_years} лет</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getTrainingStatusColor(spec.training_status)}`}>
                      {getTrainingStatusLabel(spec.training_status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>{spec.attestation_status}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>{formatDate(spec.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
        Данные для демонстрации. Полная интеграция с backend будет добавлена позже.
      </p>
    </div>
  );
};

export default AdminSpecialists;
