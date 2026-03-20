import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '@/lib/admin-api';
import { toast } from 'sonner';
import SalonsFilters from '@/components/admin/SalonsFilters';
import SalonsTable from '@/components/admin/SalonsTable';
import AddSalonDialog from '@/components/admin/AddSalonDialog';

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

const EMPTY_SALON = {
  name: '',
  city: '',
  owner_name: '',
  phone: '',
  email: '',
  description: '',
  techniques: '',
  tariff: 'basic',
  status: 'new',
};

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

  const [newSalon, setNewSalon] = useState({ ...EMPTY_SALON });
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

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleDeleteSalon = async (id: number) => {
    try {
      const url = `https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300?id=${id}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.deleted_id) {
        toast.success('Салон удалён');
        fetchSalons();
      } else {
        toast.error(data.error || 'Ошибка удаления');
      }
    } catch {
      toast.error('Ошибка соединения');
    }
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
        setNewSalon({ ...EMPTY_SALON });
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
      <SalonsFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onAddClick={() => setAddDialogOpen(true)}
      />

      <SalonsTable
        salons={salons}
        loading={loading}
        total={total}
        page={page}
        pages={pages}
        onRowClick={(id) => navigate(`/admin/salons/${id}`)}
        onPageChange={setPage}
        onDelete={handleDeleteSalon}
      />

      <AddSalonDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        newSalon={newSalon}
        onFieldChange={setNewSalon}
        onSave={handleAddSalon}
        saving={saving}
      />
    </div>
  );
};

export default AdminSalons;