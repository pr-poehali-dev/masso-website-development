import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  adminFetch,
  getSalonStatusLabel,
  getSalonStatusColor,
  getTrainingStatusLabel,
  getTrainingStatusColor,
  getAccessStatusLabel,
  getAccessStatusColor,
  formatDate,
  formatDateTime,
} from '@/lib/admin-api';
import { toast } from 'sonner';

interface Specialist {
  id: number;
  name: string;
  email: string | null;
  experience_years: number;
  training_status: string;
  attestation_status: string;
  created_at: string;
}

interface Comment {
  id: number;
  text: string;
  author_name: string | null;
  created_at: string;
}

interface Access {
  id: number;
  specialist_id: number | null;
  email: string;
  status: string;
  issued_at: string;
  activated_at: string | null;
}

interface SalonDetail {
  id: number;
  name: string;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  techniques: string | null;
  tariff: string;
  status: string;
  rating: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  specialists: Specialist[];
  comments: Comment[];
  access_list: Access[];
}

const STATUSES = [
  { value: 'new', label: 'Новый' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'connected', label: 'Подключен' },
  { value: 'training', label: 'Обучение' },
  { value: 'certified', label: 'Сертифицирован' },
  { value: 'archive', label: 'Архив' },
];

const AdminSalonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salon, setSalon] = useState<SalonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<SalonDetail>>({});
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const fetchSalon = async () => {
    try {
      const url = `https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300?id=${id}`;
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (data.salon) {
        setSalon(data.salon);
        setEditData({
          name: data.salon.name,
          city: data.salon.city || '',
          owner_name: data.salon.owner_name || '',
          phone: data.salon.phone || '',
          email: data.salon.email || '',
          description: data.salon.description || '',
          techniques: data.salon.techniques || '',
          tariff: data.salon.tariff,
          status: data.salon.status,
        });
      }
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalon();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await adminFetch('salons', {
        method: 'PUT',
        body: JSON.stringify({ id: Number(id), ...editData }),
      });
      if (data.salon) {
        toast.success('Салон обновлен');
        setSalon({ ...salon!, ...data.salon });
        setEditing(false);
      } else {
        toast.error(data.error || 'Ошибка обновления');
      }
    } catch {
      toast.error('Ошибка соединения');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const data = await adminFetch('salons', {
        method: 'PUT',
        body: JSON.stringify({ id: Number(id), status: newStatus }),
      });
      if (data.salon) {
        toast.success('Статус обновлен');
        setSalon({ ...salon!, ...data.salon });
        setEditData({ ...editData, status: newStatus });
      }
    } catch {
      toast.error('Ошибка смены статуса');
    }
  };

  // Comment adding is a stub - would need a backend endpoint
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setAddingComment(true);
    // For now just show a message since there's no comment endpoint
    toast.info('Функция добавления комментариев будет доступна после создания backend endpoint');
    setAddingComment(false);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center py-20">
        <Icon name="AlertCircle" size={40} className="mx-auto" style={{ color: '#ef4444' }} />
        <p className="text-sm mt-3" style={{ color: '#6b7280' }}>Салон не найден</p>
        <button
          onClick={() => navigate('/admin/salons')}
          className="mt-4 text-sm underline"
          style={{ color: '#0da2e7' }}
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/salons')}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold font-sans" style={{ color: '#111827' }}>
              {salon.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm" style={{ color: '#6b7280' }}>
                ID: {salon.id}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${getSalonStatusColor(salon.status)}`}
              >
                {getSalonStatusLabel(salon.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={salon.status} onValueChange={handleStatusChange}>
            <SelectTrigger
              className="w-[160px] h-9 text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
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
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="h-9 px-4 rounded-lg text-sm font-medium text-white flex items-center gap-2"
              style={{ background: '#0da2e7' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0b8dcc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0da2e7')}
            >
              <Icon name="Pencil" size={14} />
              Редактировать
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="h-9 px-4 rounded-lg text-sm font-medium border"
                style={{ borderColor: '#d1d5db', color: '#374151', background: '#ffffff' }}
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-9 px-4 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#22c55e' }}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList
          className="rounded-lg p-1"
          style={{ background: '#f3f4f6' }}
        >
          <TabsTrigger
            value="info"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Информация
          </TabsTrigger>
          <TabsTrigger
            value="specialists"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Специалисты ({salon.specialists.length})
          </TabsTrigger>
          <TabsTrigger
            value="access"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Доступы ({salon.access_list.length})
          </TabsTrigger>
          <TabsTrigger
            value="rating"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Рейтинг
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Комментарии ({salon.comments.length})
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <div
            className="rounded-xl border p-6 mt-4"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Название</Label>
                {editing ? (
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>{salon.name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Город</Label>
                {editing ? (
                  <Input
                    value={editData.city || ''}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.city || '-'}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Владелец</Label>
                {editing ? (
                  <Input
                    value={editData.owner_name || ''}
                    onChange={(e) => setEditData({ ...editData, owner_name: e.target.value })}
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.owner_name || '-'}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Телефон</Label>
                {editing ? (
                  <Input
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.phone || '-'}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Email</Label>
                {editing ? (
                  <Input
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.email || '-'}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Тариф</Label>
                {editing ? (
                  <Select
                    value={editData.tariff || 'basic'}
                    onValueChange={(v) => setEditData({ ...editData, tariff: v })}
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
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.tariff}</p>
                )}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Описание</Label>
                {editing ? (
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    className="flex w-full rounded-md border px-3 py-2 text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.description || '-'}</p>
                )}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm" style={{ color: '#6b7280' }}>Техники</Label>
                {editing ? (
                  <Input
                    value={editData.techniques || ''}
                    onChange={(e) => setEditData({ ...editData, techniques: e.target.value })}
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#111827' }}>{salon.techniques || '-'}</p>
                )}
              </div>
            </div>
            <div
              className="mt-5 pt-4 border-t flex items-center gap-4 text-xs"
              style={{ borderColor: '#f3f4f6', color: '#9ca3af' }}
            >
              <span>Создан: {formatDateTime(salon.created_at)}</span>
              <span>Обновлен: {formatDateTime(salon.updated_at)}</span>
              <span>Опубликован: {salon.is_published ? 'Да' : 'Нет'}</span>
            </div>
          </div>
        </TabsContent>

        {/* Specialists Tab */}
        <TabsContent value="specialists">
          <div
            className="rounded-xl border mt-4 overflow-hidden"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            {salon.specialists.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Users" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
                <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                  Нет специалистов
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: '#e5e7eb' }}>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Имя</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Email</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Стаж</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Обучение</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Аттестация</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.specialists.map((spec) => (
                    <TableRow key={spec.id} style={{ borderColor: '#f3f4f6' }}>
                      <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>{spec.id}</TableCell>
                      <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>{spec.name}</TableCell>
                      <TableCell className="text-sm" style={{ color: '#6b7280' }}>{spec.email || '-'}</TableCell>
                      <TableCell className="text-sm" style={{ color: '#6b7280' }}>{spec.experience_years} лет</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getTrainingStatusColor(spec.training_status)}`}>
                          {getTrainingStatusLabel(spec.training_status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm" style={{ color: '#6b7280' }}>{spec.attestation_status}</TableCell>
                      <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{formatDate(spec.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* Access Tab */}
        <TabsContent value="access">
          <div
            className="rounded-xl border mt-4 overflow-hidden"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            {salon.access_list.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="KeyRound" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
                <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                  Нет выданных доступов
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: '#e5e7eb' }}>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Email</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Статус</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Выдан</TableHead>
                    <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Активирован</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.access_list.map((acc) => (
                    <TableRow key={acc.id} style={{ borderColor: '#f3f4f6' }}>
                      <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>{acc.id}</TableCell>
                      <TableCell className="text-sm" style={{ color: '#111827' }}>{acc.email}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getAccessStatusColor(acc.status)}`}>
                          {getAccessStatusLabel(acc.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{formatDateTime(acc.issued_at)}</TableCell>
                      <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{acc.activated_at ? formatDateTime(acc.activated_at) : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* Rating Tab */}
        <TabsContent value="rating">
          <div
            className="rounded-xl border p-6 mt-4"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <div className="text-center py-8">
              <div
                className="text-5xl font-bold font-sans mb-2"
                style={{ color: '#0da2e7' }}
              >
                {salon.rating}
              </div>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Текущий рейтинг салона
              </p>
              <div className="flex items-center justify-center gap-1 mt-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={24}
                    style={{ color: i < Math.round(Number(salon.rating)) ? '#f59e0b' : '#e5e7eb' }}
                  />
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: '#9ca3af' }}>
                Рейтинг рассчитывается по формуле: (обучение + аттестация + техники) / 3
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <div
            className="rounded-xl border p-6 mt-4"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            {/* Add comment form */}
            <div className="mb-5 pb-5 border-b" style={{ borderColor: '#f3f4f6' }}>
              <Label className="text-sm mb-2 block" style={{ color: '#6b7280' }}>
                Добавить комментарий
              </Label>
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Текст комментария..."
                  rows={2}
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={addingComment || !newComment.trim()}
                  className="self-end h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: '#0da2e7' }}
                >
                  Отправить
                </button>
              </div>
            </div>

            {salon.comments.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>
                Нет комментариев
              </p>
            ) : (
              <div className="space-y-4">
                {salon.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="pb-4 border-b last:border-0 last:pb-0"
                    style={{ borderColor: '#f3f4f6' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: '#111827' }}>
                        {comment.author_name || 'Система'}
                      </span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>
                        {formatDateTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#374151' }}>
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSalonDetail;
