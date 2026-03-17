import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { adminFetch, formatDateTime } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_enabled: boolean;
  hints: string | null;
  formula: string | null;
  created_at: string;
  updated_at: string;
}

const AdminTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Tool>>({});
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', slug: '', description: '', hints: '', formula: '' });

  const fetchTools = () => {
    adminFetch('tools')
      .then((res) => setTools(res.tools || []))
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleToggle = async (tool: Tool) => {
    const res = await adminFetch('tools', {
      method: 'PUT',
      body: JSON.stringify({ id: tool.id, is_enabled: !tool.is_enabled }),
    });
    if (res.tool) {
      setTools(tools.map(t => t.id === tool.id ? res.tool : t));
      toast.success(res.tool.is_enabled ? 'Включен' : 'Выключен');
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditId(tool.id);
    setEditData({ name: tool.name, slug: tool.slug, description: tool.description || '', hints: tool.hints || '', formula: tool.formula || '' });
  };

  const handleSave = async () => {
    if (!editId) return;
    setSaving(true);
    const res = await adminFetch('tools', {
      method: 'PUT',
      body: JSON.stringify({ id: editId, ...editData }),
    });
    if (res.tool) {
      setTools(tools.map(t => t.id === editId ? res.tool : t));
      setEditId(null);
      toast.success('Сохранено');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newTool.name || !newTool.slug) {
      toast.error('Название и slug обязательны');
      return;
    }
    setSaving(true);
    const res = await adminFetch('tools', {
      method: 'POST',
      body: JSON.stringify(newTool),
    });
    if (res.tool) {
      setTools([...tools, res.tool]);
      setShowAdd(false);
      setNewTool({ name: '', slug: '', description: '', hints: '', formula: '' });
      toast.success('Инструмент добавлен');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить инструмент?')) return;
    const url = `https://functions.poehali.dev/71554603-778d-47d8-9cbd-6cea59fd8755?id=${id}`;
    const res = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
    if (res.success) {
      setTools(tools.filter(t => t.id !== id));
      toast.success('Удален');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Управление инструментами для салонов
        </p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white"
          style={{ background: '#0da2e7' }}
        >
          <Icon name="Plus" size={16} />
          Добавить
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Новый инструмент</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Название</Label>
              <Input value={newTool.name} onChange={e => setNewTool({ ...newTool, name: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Slug</Label>
              <Input value={newTool.slug} onChange={e => setNewTool({ ...newTool, slug: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Описание</Label>
              <Input value={newTool.description} onChange={e => setNewTool({ ...newTool, description: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Подсказки</Label>
              <Input value={newTool.hints} onChange={e => setNewTool({ ...newTool, hints: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" style={{ color: '#6b7280' }}>Формула</Label>
              <Input value={newTool.formula} onChange={e => setNewTool({ ...newTool, formula: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} disabled={saving} className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
              Создать
            </button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-lg text-sm font-medium border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tools.map((tool) => (
          <div key={tool.id} className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            {editId === tool.id ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Название</Label>
                    <Input value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Slug</Label>
                    <Input value={editData.slug || ''} onChange={e => setEditData({ ...editData, slug: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Описание</Label>
                    <Input value={editData.description || ''} onChange={e => setEditData({ ...editData, description: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Подсказки</Label>
                    <Input value={editData.hints || ''} onChange={e => setEditData({ ...editData, hints: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ color: '#6b7280' }}>Формула</Label>
                    <Input value={editData.formula || ''} onChange={e => setEditData({ ...editData, formula: e.target.value })} className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSave} disabled={saving} className="h-8 px-3 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
                    Сохранить
                  </button>
                  <button onClick={() => setEditId(null)} className="h-8 px-3 rounded-lg text-sm font-medium border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>{tool.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                      {tool.slug}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${tool.is_enabled ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'}`}>
                      {tool.is_enabled ? 'Активен' : 'Выключен'}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#6b7280' }}>{tool.description || 'Без описания'}</p>
                  {tool.hints && <p className="text-xs" style={{ color: '#9ca3af' }}>Подсказки: {tool.hints}</p>}
                  {tool.formula && <p className="text-xs font-mono mt-0.5" style={{ color: '#9ca3af' }}>Формула: {tool.formula}</p>}
                  <p className="text-xs mt-2" style={{ color: '#d1d5db' }}>Обновлен: {formatDateTime(tool.updated_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch checked={tool.is_enabled} onCheckedChange={() => handleToggle(tool)} />
                  <button onClick={() => handleEdit(tool)} className="p-2 rounded-lg hover:bg-gray-50">
                    <Icon name="Pencil" size={16} style={{ color: '#6b7280' }} />
                  </button>
                  <button onClick={() => handleDelete(tool.id)} className="p-2 rounded-lg hover:bg-red-50">
                    <Icon name="Trash2" size={16} style={{ color: '#ef4444' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {tools.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Wrench" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
            <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Нет инструментов</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTools;
