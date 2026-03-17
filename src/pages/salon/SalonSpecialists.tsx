import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { salonFetch, salonPost, salonDelete } from '@/lib/salon-api';
import { toast } from 'sonner';

interface Specialist {
  id: number;
  name: string;
  email: string | null;
  training_status: string;
  attestation_status: string;
  access_status: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  added: 'Добавлен', in_progress: 'Обучается', completed: 'Завершил', certified: 'Сертифицирован',
};
const statusColors: Record<string, string> = {
  added: 'bg-gray-100 text-gray-700 border-gray-300',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-300',
  completed: 'bg-green-50 text-green-700 border-green-300',
  certified: 'bg-purple-50 text-purple-700 border-purple-300',
};
const attLabels: Record<string, string> = { none: 'Нет', passed: 'Пройдена', failed: 'Не пройдена' };

const SalonSpecialists = () => {
  const [specs, setSpecs] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const load = () => {
    salonFetch('specialists')
      .then(res => setSpecs(res.specialists || []))
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) { toast.error('Введите имя'); return; }
    setAdding(true);
    const res = await salonPost('specialists', { name: newName, email: newEmail });
    if (res.specialist) {
      toast.success('Специалист добавлен');
      setShowAdd(false);
      setNewName('');
      setNewEmail('');
      load();
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить специалиста?')) return;
    await salonDelete('specialists', { id });
    toast.success('Удалён');
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6b7280' }}>{specs.length} специалистов</p>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white" style={{ background: '#0da2e7' }}>
          <Icon name="Plus" size={16} /> Добавить
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Имя</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Иван Иванов" className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Email</Label>
              <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="ivan@example.com" className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} disabled={adding} className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>Добавить</button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-lg text-sm border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>Отмена</button>
          </div>
        </div>
      )}

      {specs.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="Users" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
          <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>Добавьте первого специалиста</p>
        </div>
      ) : (
        <div className="space-y-2">
          {specs.map(s => (
            <div key={s.id} className="rounded-xl p-4 flex items-center justify-between gap-3" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: '#0da2e7' }}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>{s.name}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{s.email || 'email не указан'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[s.training_status] || statusColors.added}`}>
                  {statusLabels[s.training_status] || s.training_status}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                  {attLabels[s.attestation_status] || s.attestation_status}
                </span>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-50">
                  <Icon name="Trash2" size={16} style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalonSpecialists;
