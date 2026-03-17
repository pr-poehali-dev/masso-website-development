import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAccessStatusLabel,
  getAccessStatusColor,
  formatDateTime,
} from '@/lib/admin-api';

interface AccessItem {
  id: number;
  specialist_name: string;
  email: string;
  salon_name: string;
  status: string;
  issued_at: string;
  activated_at: string | null;
}

const demoAccess: AccessItem[] = [
  {
    id: 1,
    specialist_name: 'Анна Смирнова',
    email: 'anna@example.com',
    salon_name: 'Салон "Аура"',
    status: 'activated',
    issued_at: '2026-03-10T09:00:00',
    activated_at: '2026-03-11T14:30:00',
  },
  {
    id: 2,
    specialist_name: 'Олег Козлов',
    email: 'oleg@example.com',
    salon_name: 'СПА "Релакс"',
    status: 'issued',
    issued_at: '2026-03-14T10:00:00',
    activated_at: null,
  },
];

const AdminAccess = () => {
  const [access] = useState<AccessItem[]>(demoAccess);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Всего доступов: {access.length}
        </p>
        <button
          className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
          style={{ background: '#0da2e7' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#0b8dcc')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0da2e7')}
        >
          <Icon name="Plus" size={16} />
          Выдать доступ
        </button>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        {access.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="KeyRound" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
            <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>Нет доступов</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#e5e7eb' }}>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Специалист</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Email</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Салон</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Дата выдачи</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {access.map((item) => (
                <TableRow
                  key={item.id}
                  style={{ borderColor: '#f3f4f6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>
                    {item.specialist_name}
                  </TableCell>
                  <TableCell className="text-sm" style={{ color: '#6b7280' }}>{item.email}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{item.salon_name}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>{formatDateTime(item.issued_at)}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getAccessStatusColor(item.status)}`}>
                      {getAccessStatusLabel(item.status)}
                    </span>
                  </TableCell>
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

export default AdminAccess;
