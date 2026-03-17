import { useEffect, useState } from 'react';
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
  getAccessStatusLabel,
  getAccessStatusColor,
  formatDateTime,
} from '@/lib/admin-api';
import { toast } from 'sonner';

interface AccessItem {
  id: number;
  specialist_id: number | null;
  specialist_name: string | null;
  email: string;
  password: string | null;
  salon_id: number | null;
  salon_name: string | null;
  status: string;
  issued_at: string;
  activated_at: string | null;
}

interface Specialist {
  id: number;
  name: string;
  email: string | null;
  salon_id: number | null;
  salon_name: string | null;
}

const ACCESS_STATUSES = [
  { value: 'all', label: 'Все статусы' },
  { value: 'issued', label: 'Выдан' },
  { value: 'activated', label: 'Активирован' },
  { value: 'expired', label: 'Истек' },
];

const AdminAccess = () => {
  const [access, setAccess] = useState<AccessItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [newAccess, setNewAccess] = useState({ specialist_id: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    fetch(`https://functions.poehali.dev/c0272ba8-c8f1-4d74-9845-0b8e1e6e8384?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then((data) => {
        if (data && data.access) {
          setAccess(data.access);
          setTotal(data.total);
          setPages(data.pages);
        }
      })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  };

  const loadSpecialists = () => {
    fetch('https://functions.poehali.dev/6c30e659-c8be-4c63-942a-03dac1c456f5?per_page=200', {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then((data) => {
        if (data && data.specialists) setSpecialists(data.specialists);
      })
      .catch(() => {});
  };

  useEffect(() => { loadData(); }, [page, statusFilter]);
  useEffect(() => { loadSpecialists(); }, []);

  const handleSearch = () => { setPage(1); loadData(); };

  const handleSpecialistSelect = (specId: string) => {
    setNewAccess(prev => ({ ...prev, specialist_id: specId }));
    const spec = specialists.find(s => s.id === Number(specId));
    if (spec && spec.email && !newAccess.email) {
      setNewAccess(prev => ({ ...prev, email: spec.email || '' }));
    }
  };

  const handleStatusChange = (accessId: number, newStatus: string) => {
    fetch('https://functions.poehali.dev/c0272ba8-c8f1-4d74-9845-0b8e1e6e8384', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: accessId, status: newStatus }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.access_record) {
          loadData();
          toast.success('Статус обновлён');
        }
      })
      .catch(() => toast.error('Ошибка обновления'));
  };

  const handleAddAccess = () => {
    if (!newAccess.email.trim()) { toast.error('Введите email'); return; }
    setSaving(true);
    fetch('https://functions.poehali.dev/c0272ba8-c8f1-4d74-9845-0b8e1e6e8384', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        specialist_id: newAccess.specialist_id ? Number(newAccess.specialist_id) : null,
        email: newAccess.email,
        password: newAccess.password || null,
        status: 'issued',
      }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.access_record) {
          toast.success('Доступ выдан');
          setAddOpen(false);
          setNewAccess({ specialist_id: '', email: '', password: '' });
          loadData();
        } else {
          toast.error(data.error || 'Ошибка');
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
              placeholder="Поиск по специалисту, email, салону..."
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
              {ACCESS_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <button className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2 flex-shrink-0" style={{ background: '#0da2e7' }}>
              <Icon name="Plus" size={16} />
              Выдать доступ
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#111827' }}>Выдать доступ к Док Диалог</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Специалист</Label>
                <Select value={newAccess.specialist_id} onValueChange={handleSpecialistSelect}>
                  <SelectTrigger className="h-9 text-sm mt-1" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
                    <SelectValue placeholder="Выберите специалиста" />
                  </SelectTrigger>
                  <SelectContent style={{ background: '#ffffff' }}>
                    {specialists.map(s => (
                      <SelectItem key={s.id} value={String(s.id)} style={{ color: '#111827' }}>
                        {s.name} {s.salon_name ? `(${s.salon_name})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Email *</Label>
                <Input
                  value={newAccess.email}
                  onChange={(e) => setNewAccess(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="h-9 text-sm mt-1"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Пароль</Label>
                <Input
                  value={newAccess.password}
                  onChange={(e) => setNewAccess(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Пароль для входа на платформу"
                  className="h-9 text-sm mt-1"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <button
                onClick={handleAddAccess}
                disabled={saving}
                className="w-full h-10 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#0da2e7' }}
              >
                {saving ? 'Сохранение...' : 'Выдать доступ'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm" style={{ color: '#6b7280' }}>Всего доступов: {total}</p>

      <div className="rounded-xl border overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Icon name="Loader2" size={24} className="animate-spin" style={{ color: '#0da2e7' }} />
          </div>
        ) : access.length === 0 ? (
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
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Пароль</TableHead>
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
                    {item.specialist_name || '-'}
                  </TableCell>
                  <TableCell className="text-sm" style={{ color: '#6b7280' }}>{item.email}</TableCell>
                  <TableCell className="text-sm font-mono" style={{ color: '#111827' }}>{item.password || '-'}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{item.salon_name || '-'}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>{formatDateTime(item.issued_at)}</TableCell>
                  <TableCell>
                    <Select value={item.status} onValueChange={(v) => handleStatusChange(item.id, v)}>
                      <SelectTrigger className="h-7 text-xs w-[130px] border-0 p-0" style={{ background: 'transparent' }} onClick={(e) => e.stopPropagation()}>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getAccessStatusColor(item.status)}`}>
                          {getAccessStatusLabel(item.status)}
                        </span>
                      </SelectTrigger>
                      <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
                        {ACCESS_STATUSES.filter(s => s.value !== 'all').map((s) => (
                          <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
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

export default AdminAccess;