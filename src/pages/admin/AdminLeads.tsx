import { Fragment, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
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
  getLeadStatusLabel,
  getLeadStatusColor,
  formatDateTime,
} from '@/lib/admin-api';

interface Lead {
  id: number;
  name: string;
  salon_name: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: string;
  comment: string | null;
  created_at: string;
}

const STATUSES = [
  { value: 'new', label: 'Новая' },
  { value: 'in_work', label: 'В работе' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
];

// Demo data for display until backend endpoint is ready
const demoLeads: Lead[] = [
  {
    id: 1,
    name: 'Иван Петров',
    salon_name: 'Салон красоты "Аура"',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    source: 'Сайт',
    status: 'new',
    comment: null,
    created_at: '2026-03-15T10:30:00',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    salon_name: 'СПА-центр "Релакс"',
    phone: '+7 (999) 765-43-21',
    email: null,
    source: 'Рекомендация',
    status: 'in_work',
    comment: 'Перезвонить в четверг',
    created_at: '2026-03-14T15:20:00',
  },
];

const AdminLeads = () => {
  const [leads] = useState<Lead[]>(demoLeads);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleStatusChange = (leadId: number, newStatus: string) => {
    // Stub - would call backend
    console.log('Change lead', leadId, 'to status', newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Всего заявок: {leads.length}
        </p>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        {leads.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Inbox" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
            <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>Нет заявок</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#e5e7eb' }}>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Имя</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Салон</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Телефон</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Источник</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Дата</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <Fragment key={lead.id}>
                  <TableRow
                    className="cursor-pointer transition-colors"
                    style={{ borderColor: '#f3f4f6' }}
                    onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>
                      <div className="flex items-center gap-2">
                        <Icon
                          name={expandedId === lead.id ? 'ChevronDown' : 'ChevronRight'}
                          size={14}
                          style={{ color: '#9ca3af' }}
                        />
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: '#6b7280' }}>{lead.salon_name || '-'}</TableCell>
                    <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{lead.phone || '-'}</TableCell>
                    <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>{lead.source || '-'}</TableCell>
                    <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>{formatDateTime(lead.created_at)}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(v) => handleStatusChange(lead.id, v)}
                      >
                        <SelectTrigger
                          className="h-7 text-xs w-[130px] border-0 p-0"
                          style={{ background: 'transparent' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getLeadStatusColor(lead.status)}`}>
                            {getLeadStatusLabel(lead.status)}
                          </span>
                        </SelectTrigger>
                        <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
                          {STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  {expandedId === lead.id && (
                    <TableRow key={`${lead.id}-expanded`} style={{ borderColor: '#f3f4f6' }}>
                      <TableCell colSpan={6} className="py-3" style={{ background: '#f9fafb' }}>
                        <div className="space-y-2 px-6">
                          {lead.email && (
                            <p className="text-sm" style={{ color: '#6b7280' }}>
                              <span className="font-medium" style={{ color: '#374151' }}>Email:</span> {lead.email}
                            </p>
                          )}
                          <div>
                            <Label className="text-sm font-medium" style={{ color: '#374151' }}>
                              Комментарий:
                            </Label>
                            <textarea
                              defaultValue={lead.comment || ''}
                              placeholder="Добавить комментарий..."
                              rows={2}
                              className="mt-1 flex w-full rounded-md border px-3 py-2 text-sm"
                              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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

export default AdminLeads;