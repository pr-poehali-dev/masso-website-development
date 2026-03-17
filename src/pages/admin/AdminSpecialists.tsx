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
  getTrainingStatusLabel,
  getTrainingStatusColor,
  getAttestationColor,
  formatDate,
} from '@/lib/admin-api';
import { toast } from 'sonner';

interface Specialist {
  id: number;
  name: string;
  email: string | null;
  salon_id: number | null;
  salon_name: string | null;
  experience_years: number;
  training_status: string;
  attestation_status: string;
  created_at: string;
}

interface Salon {
  id: number;
  name: string;
}

const TRAINING_STATUSES = [
  { value: 'all', label: 'Все статусы' },
  { value: 'added', label: 'Добавлен' },
  { value: 'in_progress', label: 'Обучается' },
  { value: 'completed', label: 'Завершил' },
  { value: 'certified', label: 'Сертифицирован' },
];

const ATTESTATION_MAP: Record<string, string> = {
  none: 'Нет',
  passed: 'Пройдена',
  failed: 'Не пройдена',
};

const AdminSpecialists = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [newSpec, setNewSpec] = useState({ name: '', email: '', salon_id: '', experience_years: '0', training_status: 'added', attestation_status: 'none' });
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const updateSpecialistStatus = (specId: number, field: string, value: string) => {
    setUpdatingId(specId);
    fetch('https://functions.poehali.dev/6c30e659-c8be-4c63-942a-03dac1c456f5', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: specId, [field]: value }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.specialist) {
          setSpecialists(prev => prev.map(s => s.id === specId ? { ...s, [field]: value } : s));
          toast.success('Статус обновлён');
        } else {
          toast.error(data.error || 'Ошибка обновления');
        }
      })
      .catch(() => toast.error('Ошибка соединения'))
      .finally(() => setUpdatingId(null));
  };

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (statusFilter !== 'all') params.set('training_status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    fetch(`https://functions.poehali.dev/6c30e659-c8be-4c63-942a-03dac1c456f5?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then((data) => {
        if (data && data.specialists) {
          setSpecialists(data.specialists);
          setTotal(data.total);
          setPages(data.pages);
        }
      })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  };

  const loadSalons = () => {
    adminFetch('salons')
      .then((data) => {
        if (data && data.salons) setSalons(data.salons.map((s: { id: number; name: string }) => ({ id: s.id, name: s.name })));
      })
      .catch(() => {});
  };

  useEffect(() => { loadData(); }, [page, statusFilter]);
  useEffect(() => { loadSalons(); }, []);

  const handleSearch = () => { setPage(1); loadData(); };

  const handleAddSpecialist = () => {
    if (!newSpec.name.trim()) { toast.error('Введите имя'); return; }
    setSaving(true);
    fetch('https://functions.poehali.dev/6c30e659-c8be-4c63-942a-03dac1c456f5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newSpec.name,
        email: newSpec.email || null,
        salon_id: newSpec.salon_id ? Number(newSpec.salon_id) : null,
        experience_years: Number(newSpec.experience_years) || 0,
        training_status: newSpec.training_status,
        attestation_status: newSpec.attestation_status,
      }),
    })
      .then(r => r.json())
      .then((data) => {
        if (data.specialist) {
          toast.success('Специалист добавлен');
          setAddOpen(false);
          setNewSpec({ name: '', email: '', salon_id: '', experience_years: '0', training_status: 'added', attestation_status: 'none' });
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
              placeholder="Поиск по имени, email, салону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 h-10 text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
              {TRAINING_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <button className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2 flex-shrink-0" style={{ background: '#0da2e7' }}>
              <Icon name="Plus" size={16} />
              Добавить специалиста
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#111827' }}>Новый специалист</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>ФИО *</Label>
                <Input
                  value={newSpec.name}
                  onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Иванова Анна Сергеевна"
                  className="h-9 text-sm mt-1"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Email</Label>
                <Input
                  value={newSpec.email}
                  onChange={(e) => setNewSpec(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="h-9 text-sm mt-1"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Салон</Label>
                <Select value={newSpec.salon_id} onValueChange={(v) => setNewSpec(prev => ({ ...prev, salon_id: v }))}>
                  <SelectTrigger className="h-9 text-sm mt-1" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
                    <SelectValue placeholder="Выберите салон" />
                  </SelectTrigger>
                  <SelectContent style={{ background: '#ffffff' }}>
                    {salons.map(s => <SelectItem key={s.id} value={String(s.id)} style={{ color: '#111827' }}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm" style={{ color: '#374151' }}>Стаж (лет)</Label>
                <Input
                  type="number"
                  value={newSpec.experience_years}
                  onChange={(e) => setNewSpec(prev => ({ ...prev, experience_years: e.target.value }))}
                  className="h-9 text-sm mt-1"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm" style={{ color: '#374151' }}>Обучение</Label>
                  <Select value={newSpec.training_status} onValueChange={(v) => setNewSpec(prev => ({ ...prev, training_status: v }))}>
                    <SelectTrigger className="h-9 text-sm mt-1" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: '#ffffff' }}>
                      {TRAINING_STATUSES.filter(s => s.value !== 'all').map(s => <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm" style={{ color: '#374151' }}>Аттестация</Label>
                  <Select value={newSpec.attestation_status} onValueChange={(v) => setNewSpec(prev => ({ ...prev, attestation_status: v }))}>
                    <SelectTrigger className="h-9 text-sm mt-1" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: '#ffffff' }}>
                      <SelectItem value="none" style={{ color: '#111827' }}>Нет</SelectItem>
                      <SelectItem value="passed" style={{ color: '#111827' }}>Пройдена</SelectItem>
                      <SelectItem value="failed" style={{ color: '#111827' }}>Не пройдена</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={handleAddSpecialist}
                disabled={saving}
                className="w-full h-10 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#0da2e7' }}
              >
                {saving ? 'Сохранение...' : 'Добавить'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm" style={{ color: '#6b7280' }}>Всего специалистов: {total}</p>

      <div className="rounded-xl border overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Icon name="Loader2" size={24} className="animate-spin" style={{ color: '#0da2e7' }} />
          </div>
        ) : specialists.length === 0 ? (
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
              {specialists.map((spec) => (
                <TableRow
                  key={spec.id}
                  style={{ borderColor: '#f3f4f6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>{spec.id}</TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>{spec.name}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{spec.email || '-'}</TableCell>
                  <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>{spec.salon_name || '-'}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>{spec.experience_years} лет</TableCell>
                  <TableCell>
                    <Select
                      value={spec.training_status}
                      onValueChange={(v) => updateSpecialistStatus(spec.id, 'training_status', v)}
                      disabled={updatingId === spec.id}
                    >
                      <SelectTrigger className="h-7 w-auto min-w-[120px] border-0 p-0 shadow-none focus:ring-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getTrainingStatusColor(spec.training_status)}`}>
                          {getTrainingStatusLabel(spec.training_status)}
                        </span>
                      </SelectTrigger>
                      <SelectContent style={{ background: '#ffffff' }}>
                        {TRAINING_STATUSES.filter(s => s.value !== 'all').map(s => (
                          <SelectItem key={s.value} value={s.value} style={{ color: '#111827' }}>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getTrainingStatusColor(s.value)}`}>
                              {s.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Select
                      value={spec.attestation_status}
                      onValueChange={(v) => updateSpecialistStatus(spec.id, 'attestation_status', v)}
                      disabled={updatingId === spec.id}
                    >
                      <SelectTrigger className="h-7 w-auto min-w-[110px] border-0 p-0 shadow-none focus:ring-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getAttestationColor(spec.attestation_status)}`}>
                          {ATTESTATION_MAP[spec.attestation_status] || spec.attestation_status}
                        </span>
                      </SelectTrigger>
                      <SelectContent style={{ background: '#ffffff' }}>
                        <SelectItem value="none" style={{ color: '#111827' }}>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getAttestationColor('none')}`}>Нет</span>
                        </SelectItem>
                        <SelectItem value="passed" style={{ color: '#111827' }}>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getAttestationColor('passed')}`}>Пройдена</span>
                        </SelectItem>
                        <SelectItem value="failed" style={{ color: '#111827' }}>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getAttestationColor('failed')}`}>Не пройдена</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>{formatDate(spec.created_at)}</TableCell>
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

export default AdminSpecialists;