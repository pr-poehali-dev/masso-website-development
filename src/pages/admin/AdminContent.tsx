import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { adminFetch, formatDateTime, getAdminUser } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Post {
  id: number;
  title: string;
  body: string | null;
  category: string | null;
  status: string;
  is_pinned: boolean;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

interface FormState {
  title: string;
  body: string;
  category: string;
  status: string;
  is_pinned: boolean;
}

const statusLabels: Record<string, string> = { draft: 'Черновик', published: 'Опубликован' };
const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  published: 'bg-green-50 text-green-700 border-green-300',
};

interface PostFormProps {
  form: FormState;
  saving: boolean;
  submitLabel: string;
  onChange: (form: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const PostForm = ({ form, saving, submitLabel, onChange, onSubmit, onCancel }: PostFormProps) => (
  <div className="rounded-xl border p-5 mb-4" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-1 md:col-span-2">
        <Label className="text-xs" style={{ color: '#6b7280' }}>Заголовок</Label>
        <Input
          value={form.title}
          onChange={e => onChange({ ...form, title: e.target.value })}
          className="text-sm"
          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs" style={{ color: '#6b7280' }}>Текст</Label>
          <span className="text-xs" style={{ color: form.body.length > 500 ? '#ef4444' : '#9ca3af' }}>
            {form.body.length}/500
          </span>
        </div>
        <textarea
          value={form.body}
          onChange={e => onChange({ ...form, body: e.target.value.slice(0, 500) })}
          rows={5}
          className="flex w-full rounded-md border px-3 py-2 text-sm"
          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs" style={{ color: '#6b7280' }}>Категория</Label>
        <Input
          value={form.category}
          onChange={e => onChange({ ...form, category: e.target.value })}
          className="text-sm"
          placeholder="Например: Обучение"
          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs" style={{ color: '#6b7280' }}>Статус</Label>
        <Select value={form.status} onValueChange={v => onChange({ ...form, status: v })}>
          <SelectTrigger className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ background: '#ffffff' }}>
            <SelectItem value="draft" style={{ color: '#111827' }}>Черновик</SelectItem>
            <SelectItem value="published" style={{ color: '#111827' }}>Опубликован</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_pinned}
          onChange={e => onChange({ ...form, is_pinned: e.target.checked })}
          className="rounded"
        />
        <Label className="text-xs" style={{ color: '#6b7280' }}>Закрепить</Label>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button
        onClick={onSubmit}
        disabled={saving}
        className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50"
        style={{ background: '#0da2e7' }}
      >
        {submitLabel}
      </button>
      <button
        onClick={onCancel}
        className="h-9 px-4 rounded-lg text-sm font-medium border"
        style={{ color: '#6b7280', borderColor: '#d1d5db' }}
      >
        Отмена
      </button>
    </div>
  </div>
);

const EMPTY_FORM: FormState = { title: '', body: '', category: '', status: 'draft', is_pinned: false };

const AdminContent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });

  const fetchPosts = (p = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), per_page: '15' });
    if (search) params.set('search', search);
    if (filterStatus) params.set('status', filterStatus);
    const url = `https://functions.poehali.dev/d1f87f5a-f858-49a7-ae65-c2f11fdcdd21?${params}`;
    fetch(url, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(res => { setPosts(res.posts || []); setTotal(res.total || 0); })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(page); }, [page, filterStatus]);

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error('Заголовок обязателен'); return; }
    setSaving(true);
    const user = getAdminUser();
    const res = await fetch('https://functions.poehali.dev/d1f87f5a-f858-49a7-ae65-c2f11fdcdd21', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, author_id: user?.id }),
    }).then(r => r.json());
    if (res.post) {
      toast.success('Создан');
      setShowAdd(false);
      setForm({ ...EMPTY_FORM });
      fetchPosts(1);
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editPost) return;
    setSaving(true);
    const res = await fetch('https://functions.poehali.dev/d1f87f5a-f858-49a7-ae65-c2f11fdcdd21', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editPost.id, ...form }),
    }).then(r => r.json());
    if (res.post) {
      toast.success('Сохранено');
      setEditPost(null);
      fetchPosts();
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить пост?')) return;
    const url = `https://functions.poehali.dev/d1f87f5a-f858-49a7-ae65-c2f11fdcdd21?id=${id}`;
    await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
    toast.success('Удален');
    fetchPosts();
  };

  const startEdit = (post: Post) => {
    setEditPost(post);
    setForm({ title: post.title, body: post.body || '', category: post.category || '', status: post.status, is_pinned: post.is_pinned });
    setShowAdd(false);
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPosts(1)}
            className="w-48 text-sm"
            style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
          />
          <Select value={filterStatus} onValueChange={v => setFilterStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-36 text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent style={{ background: '#ffffff' }}>
              <SelectItem value="all" style={{ color: '#111827' }}>Все статусы</SelectItem>
              <SelectItem value="draft" style={{ color: '#111827' }}>Черновик</SelectItem>
              <SelectItem value="published" style={{ color: '#111827' }}>Опубликован</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditPost(null); setForm({ ...EMPTY_FORM }); }}
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white"
          style={{ background: '#0da2e7' }}
        >
          <Icon name="Plus" size={16} />
          Новый пост
        </button>
      </div>

      {showAdd && (
        <PostForm
          form={form}
          saving={saving}
          submitLabel="Создать"
          onChange={setForm}
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}
      {editPost && (
        <PostForm
          form={form}
          saving={saving}
          submitLabel="Сохранить"
          onChange={setForm}
          onSubmit={handleUpdate}
          onCancel={() => setEditPost(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={28} className="animate-spin" style={{ color: '#0da2e7' }} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="FileText" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Нет публикаций</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="rounded-xl border p-4 flex items-start justify-between gap-3" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {post.is_pinned && <Icon name="Pin" size={14} style={{ color: '#f59e0b' }} />}
                  <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>{post.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[post.status] || statusColors.draft}`}>
                    {statusLabels[post.status] || post.status}
                  </span>
                  {post.category && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#eff6ff', color: '#0da2e7' }}>{post.category}</span>
                  )}
                </div>
                {post.body && <p className="text-sm line-clamp-2" style={{ color: '#6b7280' }}>{post.body}</p>}
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#9ca3af' }}>
                  <span>{post.author_name || 'Система'}</span>
                  <span>{formatDateTime(post.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => startEdit(post)} className="p-2 rounded-lg hover:bg-gray-50">
                  <Icon name="Pencil" size={16} style={{ color: '#6b7280' }} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-red-50">
                  <Icon name="Trash2" size={16} style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="h-8 px-3 rounded-lg text-sm border disabled:opacity-30" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
                <Icon name="ChevronLeft" size={16} />
              </button>
              <span className="text-sm" style={{ color: '#6b7280' }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="h-8 px-3 rounded-lg text-sm border disabled:opacity-30" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContent;
