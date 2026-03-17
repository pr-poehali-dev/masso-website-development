import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  adminFetch,
  getSalonStatusLabel,
  getSalonStatusColor,
  formatDate,
} from '@/lib/admin-api';
import { toast } from 'sonner';

interface Salon {
  id: number;
  name: string;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  tariff: string;
  status: string;
  specialist_count: number;
  created_at: string;
}

interface SalonListResponse {
  salons: Salon[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const STATUSES = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новый' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
  { value: 'training', label: 'Обучение' },
  { value: 'certified', label: 'Сертифицирован' },
  { value: 'archive', label: 'Архив' },
];

const AdminSalons = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // New salon form state
  const [newSalon, setNewSalon] = useState({
    name: '',
    city: '',
    owner_name: '',
    phone: '',
    email: '',
    description: '',
    techniques: '',
    tariff: 'basic',
    status: 'new',
  });
  const [saving, setSaving] = useState(false);

  const fetchSalons = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('per_page', String(perPage));
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    try {
      const url = `https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300?${params.toString()}`;
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data: SalonListResponse = await res.json();
      setSalons(data.salons || []);
      setTotal(data.total || 0);
      setPages(data.pages || 0);
    } catch {
      toast.error('Ошибка загрузки салонов');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, statusFilter, search]);

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);
    setSearchTimer(timer);
  };

  const handleAddSalon = async () => {
    if (!newSalon.name.trim()) {
      toast.error('Название салона обязательно');
      return;
    }
    setSaving(true);
    try {
      const data = await adminFetch('salons', {
        method: 'POST',
        body: JSON.stringify(newSalon),
      });
      if (data.salon) {
        toast.success('Салон создан');
        setAddDialogOpen(false);
        setNewSalon({
          name: '',
          city: '',
          owner_name: '',
          phone: '',
          email: '',
          description: '',
          techniques: '',
          tariff: 'basic',
          status: 'new',
        });
        fetchSalons();
      } else {
        toast.error(data.error || 'Ошибка создания салона');
      }
    } catch {
      toast.error('Ошибка соединения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters bar */}
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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-10 text-sm"
              style={{
                background: '#ffffff',
                borderColor: '#d1d5db',
                color: '#111827',
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
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
          onClick={() => setAddDialogOpen(true)}
          className="h-10 px-4 rounded-lg text-sm font-semibold text-white flex items-center gap-2 flex-shrink-0"
          style={{ background: '#0da2e7' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#0b8dcc')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0da2e7')}
        >
          <Icon name="Plus" size={16} />
          Добавить салон
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Icon
              name="Loader2"
              size={24}
              className="animate-spin"
              style={{ color: '#0da2e7' }}
            />
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Building2" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
            <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>
              Салоны не найдены
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#e5e7eb' }}>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Название</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Город</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Владелец</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Телефон</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Спец-ты</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Тариф</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Статус</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salons.map((salon) => (
                <TableRow
                  key={salon.id}
                  className="cursor-pointer transition-colors"
                  style={{ borderColor: '#f3f4f6' }}
                  onClick={() => navigate(`/admin/salons/${salon.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>
                    {salon.id}
                  </TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>
                    {salon.name}
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>
                    {salon.city || '-'}
                  </TableCell>
                  <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>
                    {salon.owner_name || '-'}
                  </TableCell>
                  <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>
                    {salon.phone || '-'}
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>
                    {salon.specialist_count}
                  </TableCell>
                  <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>
                    {salon.tariff}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border inline-block ${getSalonStatusColor(salon.status)}`}
                    >
                      {getSalonStatusLabel(salon.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>
                    {formatDate(salon.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Всего: {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ color: '#374151' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
              let pageNum: number;
              if (pages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= pages - 3) {
                pageNum = pages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: page === pageNum ? '#0da2e7' : 'transparent',
                    color: page === pageNum ? '#ffffff' : '#374151',
                  }}
                  onMouseEnter={(e) => {
                    if (page !== pageNum) e.currentTarget.style.background = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    if (page !== pageNum) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page >= pages}
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ color: '#374151' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Salon Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent
          className="sm:max-w-lg"
          style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }}
        >
          <DialogHeader>
            <DialogTitle className="font-sans" style={{ color: '#111827' }}>
              Добавить салон
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1.5">
              <Label className="text-sm" style={{ color: '#374151' }}>Название *</Label>
              <Input
                value={newSalon.name}
                onChange={(e) => setNewSalon({ ...newSalon, name: e.target.value })}
                placeholder="Название салона"
                className="text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#374151' }}>Город</Label>
                <Input
                  value={newSalon.city}
                  onChange={(e) => setNewSalon({ ...newSalon, city: e.target.value })}
                  placeholder="Город"
                  className="text-sm"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#374151' }}>Владелец</Label>
                <Input
                  value={newSalon.owner_name}
                  onChange={(e) => setNewSalon({ ...newSalon, owner_name: e.target.value })}
                  placeholder="Имя владельца"
                  className="text-sm"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#374151' }}>Телефон</Label>
                <Input
                  value={newSalon.phone}
                  onChange={(e) => setNewSalon({ ...newSalon, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="text-sm"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#374151' }}>Email</Label>
                <Input
                  value={newSalon.email}
                  onChange={(e) => setNewSalon({ ...newSalon, email: e.target.value })}
                  placeholder="email@example.com"
                  className="text-sm"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#374151' }}>Тариф</Label>
                <Select
                  value={newSalon.tariff}
                  onValueChange={(v) => setNewSalon({ ...newSalon, tariff: v })}
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
                  onValueChange={(v) => setNewSalon({ ...newSalon, status: v })}
                >
                  <SelectTrigger
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ background: '#ffffff', borderColor: '#d1d5db' }}>
                    {STATUSES.filter((s) => s.value !== 'all').map((s) => (
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
                onChange={(e) => setNewSalon({ ...newSalon, description: e.target.value })}
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
                onChange={(e) => setNewSalon({ ...newSalon, techniques: e.target.value })}
                placeholder="Массажные техники через запятую"
                className="text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setAddDialogOpen(false)}
              className="h-9 px-4 rounded-lg text-sm font-medium border transition-colors"
              style={{ borderColor: '#d1d5db', color: '#374151', background: '#ffffff' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              Отмена
            </button>
            <button
              onClick={handleAddSalon}
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
    </div>
  );
};

export default AdminSalons;
