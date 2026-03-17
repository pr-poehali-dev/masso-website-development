import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { salonAuth, setSalonSession } from '@/lib/salon-api';
import { toast } from 'sonner';

const SalonLogin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', salon_name: '', owner_name: '', city: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = tab === 'register'
      ? { action: 'register', ...form }
      : { action: 'login', email: form.email, password: form.password };

    const res = await salonAuth(body);

    if (res.success) {
      setSalonSession(res.user, res.salon);
      toast.success(tab === 'register' ? 'Салон зарегистрирован!' : 'Добро пожаловать!');
      navigate('/cabinet');
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#f8f9fa' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-sans" style={{ color: '#000000' }}>МассоПро</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Личный кабинет салона</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div className="flex rounded-lg p-1 mb-6" style={{ background: '#f3f4f6' }}>
            <button
              onClick={() => setTab('login')}
              className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
              style={{ background: tab === 'login' ? '#ffffff' : 'transparent', color: tab === 'login' ? '#111827' : '#6b7280', boxShadow: tab === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              Вход
            </button>
            <button
              onClick={() => setTab('register')}
              className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
              style={{ background: tab === 'register' ? '#ffffff' : 'transparent', color: tab === 'register' ? '#111827' : '#6b7280', boxShadow: tab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm" style={{ color: '#374151' }}>Название салона</Label>
                  <Input
                    required
                    value={form.salon_name}
                    onChange={e => setForm({ ...form, salon_name: e.target.value })}
                    placeholder="Мой салон"
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm" style={{ color: '#374151' }}>Ваше имя</Label>
                    <Input
                      value={form.owner_name}
                      onChange={e => setForm({ ...form, owner_name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="text-sm"
                      style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm" style={{ color: '#374151' }}>Город</Label>
                    <Input
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="Москва"
                      className="text-sm"
                      style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm" style={{ color: '#374151' }}>Телефон</Label>
                  <Input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 999 123 45 67"
                    className="text-sm"
                    style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm" style={{ color: '#374151' }}>Email</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="salon@example.com"
                className="text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm" style={{ color: '#374151' }}>Пароль</Label>
              <Input
                required
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Минимум 6 символов"
                className="text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
              style={{ background: '#0da2e7' }}
            >
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin mx-auto" />
              ) : tab === 'register' ? 'Зарегистрировать салон' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalonLogin;
