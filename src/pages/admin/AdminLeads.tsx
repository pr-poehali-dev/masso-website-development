import { Fragment, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  adminFetch,
  getLeadStatusLabel,
  getLeadStatusColor,
  formatDateTime,
} from '@/lib/admin-api';
import { toast } from 'sonner';

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
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новая' },
  { value: 'in_work', label: 'В работе' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
];

const SOURCES = ['Сайт', 'Рекомендация', 'Реклама', 'Партнёр', 'Другое'];

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', salon_name: '', phone: '', email: '', source: '', comment: '' });
  const [saving, setSaving] = useState(false);

  const fetchLeads = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    adminFetch('leads', { method: 'GET' })
      .then(() => {
        const url = `https://functions.poehali.dev/a579537c-e3a4-4397-8155-dd88bc1a2fd9?${params.toString()}`;
        return fetch(url).then(r => r.json());
      })
      .catch(() => null)
      .then((data) => {
        if (data && data.leads) {
          setLeads(data.leads);
          setTotal(data.total);
          setPages(data.pages);
        }
      })
      .finally(() => setLoading(false));
  };

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    const url = `https://functions.poehali.dev/a579537c-e3a4-4397-8155-dd88bc1a2fd9?${params.toString()}`;
    fetch(url, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then((data) => {
        if (data && data.leads) {
          setLeads(data.leads);
          setTotal(data.total);
          setPages(data.pages);
        }
      })
      .catch(() => toast.error('Ошибка загрузки заявок'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    fetch('https://functions.poehali.dev/a579537c-e3a4-4397-8155-dd88bc1a2fd9', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, status: newStatus }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.lead) {
          setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
          toast.success('Статус обновлён');
        }
      })
      .catch(() => toast.error('Ошибка обновления'));
  };

  const handleSaveComment = (leadId: number, comment: string) => {
    fetch('https://functions.poehali.dev/a579537c-e3a4-4397-8155-dd88bc1a2fd9', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, comment }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.lead) {
          setLeads(prev => prev.map(l => l.id === leadId ? { ...l, comment } : l));
          toast.success('Комментарий сохранён');
        }
      })
      .catch(() => toast.error('Ошибка сохранения'));
  };

  const handleAddLead = () => {
    if (!newLead.name.trim()) { toast.error('Введите имя'); return; }
    setSaving(true);
    fetch('https://functions.poehali.dev/a579537c-e3a4-4397-8155-dd88bc1a2fd9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLead, status: 'new' }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.lead) {
          toast.success('Заявка создана');
          setAddOpen(false);
          setNewLead({ name: '', salon_name: '', phone: '', email: '', source: '', comment: '' });
          loadData();
        } else {
          toast.error(data.error || 'Ошибка создания');
        }
      })
      .catch(() => toast.error('Ошибка соединения'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
            <Input
              placeholder="Поиск по имени, телефону, салону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 h-10 text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[170px] h-10 text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <button className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2 flex-shrink-0" style={{ background: '#0da2e7' }}>
              <Icon name="Plus" size={16} />
              Добавить заявку
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#111827' }}>Новая заявка</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {[
                { key: 'name', label: 'Имя *', placeholder: 'Иван Петров' },
                { key: 'salon_name', label: 'Салон', placeholder: 'Название салона' },
                { key: 'phone', label: 'Телефон', placeholder: '+7 (999) 123-45-67' },
                { key: 'email', label: 'Email', placeholder: 'email@example.com' },
              ].map((f) => (
                <div key={f.key}>
                  <Label className="text-sm" style={{ color: '#374151' }}>{f.label}</Label>
                  <Input
                    value={(newLead as Record<string, string>)[f.key]}
                    onChange={(e) => setNewLead(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="h-9 text-sm mt-1"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                </div>
              ))}
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Источник</Label>
                <Select value={newLead.source} onValueChange={(v) => setNewLead(prev => ({ ...prev, source: v }))}>
                  <SelectTrigger className="h-9 text-sm mt-1" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
                    <SelectValue placeholder="Выберите источник" />
                  </SelectTrigger>
                  <SelectContent style={{ background: '#ffffff' }}>
                    {SOURCES.map(s => <SelectItem key={s} value={s} style={{ color: '#111827' }}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Комментарий</Label>
                <textarea
                  value={newLead.comment}
                  onChange={(e) => setNewLead(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Комментарий..."
                  rows={2}
                  className="mt-1 flex w-full rounded-md border px-3 py-2 text-sm"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <button
                onClick={handleAddLead}
                disabled={saving}
                className="w-full h-10 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#0da2e7' }}
              >
                {saving ? 'Сохранение...' : 'Создать заявку'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm" style={{ color: '#6b7280' }}>Всего заявок: {total}</p>

      <div className="rounded-xl border overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Icon name="Loader2" size={24} className="animate-spin" style={{ color: '#0da2e7' }} />
          </div>
        ) : leads.length === 0 ? (
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
                        <Icon name={expandedId === lead.id ? 'ChevronDown' : 'ChevronRight'} size={14} style={{ color: '#9ca3af' }} />
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: '#6b7280' }}>{lead.salon_name || '-'}</TableCell>
                    <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{lead.phone || '-'}</TableCell>
                    <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>{lead.source || '-'}</TableCell>
                    <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>{formatDateTime(lead.created_at)}</TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                        <SelectTrigger className="h-7 text-xs w-[130px] border-0 p-0" style={{ background: 'transparent' }} onClick={(e) => e.stopPropagation()}>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getLeadStatusColor(lead.status)}`}>
                            {getLeadStatusLabel(lead.status)}
                          </span>
                        </SelectTrigger>
                        <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
                          {STATUSES.filter(s => s.value !== 'all').map((s) => (
                            <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>{s.label}</SelectItem>
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
                            <Label className="text-sm font-medium" style={{ color: '#374151' }}>Комментарий:</Label>
                            <div className="flex gap-2 mt-1">
                              <textarea
                                id={`comment-${lead.id}`}
                                defaultValue={lead.comment || ''}
                                placeholder="Добавить комментарий..."
                                rows={2}
                                className="flex-1 rounded-md border px-3 py-2 text-sm"
                                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                              />
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`comment-${lead.id}`) as HTMLTextAreaElement;
                                  if (el) handleSaveComment(lead.id, el.value);
                                }}
                                className="self-end h-9 px-3 rounded-lg text-xs font-semibold text-white"
                                style={{ background: '#0da2e7' }}
                              >
                                Сохранить
                              </button>
                            </div>
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

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-9 px-3 rounded-lg border text-sm disabled:opacity-40"
            style={{ borderColor: '#d1d5db', color: '#374151', background: '#ffffff' }}
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <span className="text-sm" style={{ color: '#6b7280' }}>{page} / {pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="h-9 px-3 rounded-lg border text-sm disabled:opacity-40"
            style={{ borderColor: '#d1d5db', color: '#374151', background: '#ffffff' }}
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
