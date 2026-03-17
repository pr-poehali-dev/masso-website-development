import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDateTime } from '@/lib/admin-api';
import { toast } from 'sonner';

const SETTINGS_URL = 'https://functions.poehali.dev/49c21920-2064-4a7b-bd3a-98a7e14428b2';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface RatingSettings {
  id: number;
  formula: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [rating, setRating] = useState<RatingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formula, setFormula] = useState('');
  const [saving, setSaving] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<AdminUser>>({});

  useEffect(() => {
    fetch(SETTINGS_URL, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(res => {
        setUsers(res.users || []);
        setRating(res.rating_settings || null);
        if (res.rating_settings) setFormula(res.rating_settings.formula);
      })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveFormula = async () => {
    setSaving(true);
    const res = await fetch(SETTINGS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_rating', formula }),
    }).then(r => r.json());
    if (res.rating_settings) {
      setRating(res.rating_settings);
      toast.success('Формула обновлена');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleSaveUser = async () => {
    if (!editUserId) return;
    setSaving(true);
    const res = await fetch(SETTINGS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_user', id: editUserId, ...editUserData }),
    }).then(r => r.json());
    if (res.user) {
      setUsers(users.map(u => u.id === editUserId ? { ...u, ...res.user } : u));
      setEditUserId(null);
      toast.success('Пользователь обновлен');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setSaving(false);
  };

  const handleToggleUser = async (user: AdminUser) => {
    const res = await fetch(SETTINGS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_user', id: user.id, is_active: !user.is_active }),
    }).then(r => r.json());
    if (res.user) {
      setUsers(users.map(u => u.id === user.id ? { ...u, ...res.user } : u));
      toast.success(res.user.is_active ? 'Активирован' : 'Деактивирован');
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
      <Tabs defaultValue="rating">
        <TabsList className="rounded-lg p-1" style={{ background: '#f3f4f6' }}>
          <TabsTrigger value="rating" className="rounded-md text-sm data-[state=active]:shadow-sm" style={{ color: '#6b7280' }}>
            Формула рейтинга
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-md text-sm data-[state=active]:shadow-sm" style={{ color: '#6b7280' }}>
            Пользователи ({users.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rating">
          <div className="rounded-xl border p-6 mt-4" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>Формула расчёта рейтинга</h3>
            <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>
              Используется для автоматического расчёта рейтинга салонов. Доступные переменные: training, attestation, techniques
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: '#6b7280' }}>Формула</Label>
                <Input
                  value={formula}
                  onChange={e => setFormula(e.target.value)}
                  className="text-sm font-mono"
                  style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveFormula}
                  disabled={saving || formula === rating?.formula}
                  className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: '#0da2e7' }}
                >
                  Сохранить
                </button>
                {rating && (
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    Обновлено: {formatDateTime(rating.updated_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="rounded-xl border mt-4 overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Users" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
                <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Нет пользователей</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#f3f4f6' }}>
                {users.map(user => (
                  <div key={user.id} className="p-4">
                    {editUserId === user.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs" style={{ color: '#6b7280' }}>Имя</Label>
                          <Input
                            value={editUserData.name || ''}
                            onChange={e => setEditUserData({ ...editUserData, name: e.target.value })}
                            className="text-sm"
                            style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs" style={{ color: '#6b7280' }}>Email</Label>
                          <Input
                            value={editUserData.email || ''}
                            onChange={e => setEditUserData({ ...editUserData, email: e.target.value })}
                            className="text-sm"
                            style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs" style={{ color: '#6b7280' }}>Роль</Label>
                          <Select value={editUserData.role || 'manager'} onValueChange={v => setEditUserData({ ...editUserData, role: v })}>
                            <SelectTrigger className="text-sm" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent style={{ background: '#ffffff' }}>
                              <SelectItem value="admin" style={{ color: '#111827' }}>Администратор</SelectItem>
                              <SelectItem value="manager" style={{ color: '#111827' }}>Менеджер</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-3 flex gap-2 mt-1">
                          <button onClick={handleSaveUser} disabled={saving} className="h-8 px-3 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
                            Сохранить
                          </button>
                          <button onClick={() => setEditUserId(null)} className="h-8 px-3 rounded-lg text-sm font-medium border" style={{ color: '#6b7280', borderColor: '#d1d5db' }}>
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                            style={{ background: user.is_active ? '#0da2e7' : '#9ca3af' }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: '#111827' }}>{user.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-blue-50 text-blue-700 border-blue-300'}`}>
                                {user.role === 'admin' ? 'Админ' : 'Менеджер'}
                              </span>
                              {!user.is_active && (
                                <span className="text-xs px-2 py-0.5 rounded-full border bg-red-50 text-red-700 border-red-300">Неактивен</span>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: '#9ca3af' }}>{user.email} &middot; {formatDateTime(user.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleUser(user)}
                            className="p-2 rounded-lg hover:bg-gray-50"
                            title={user.is_active ? 'Деактивировать' : 'Активировать'}
                          >
                            <Icon name={user.is_active ? 'UserX' : 'UserCheck'} size={16} style={{ color: user.is_active ? '#ef4444' : '#22c55e' }} />
                          </button>
                          <button
                            onClick={() => { setEditUserId(user.id); setEditUserData({ name: user.name, email: user.email, role: user.role }); }}
                            className="p-2 rounded-lg hover:bg-gray-50"
                          >
                            <Icon name="Pencil" size={16} style={{ color: '#6b7280' }} />
                          </button>
                        </div>
                      </div>
                    )}
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

export default AdminSettings;
