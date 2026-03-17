import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminFetch, setAdminUser } from '@/lib/admin-api';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminFetch('auth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        setAdminUser(data.user);
        toast.success('Вход выполнен успешно');
        navigate('/admin');
      } else {
        setError(data.error || 'Ошибка авторизации');
        toast.error(data.error || 'Ошибка авторизации');
      }
    } catch {
      setError('Ошибка соединения с сервером');
      toast.error('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans"
      style={{ background: '#f8f9fa' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-sm border"
        style={{
          background: '#ffffff',
          borderColor: '#e5e7eb',
        }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold font-sans"
            style={{ color: '#000000' }}
          >
            МассоПро
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Панель администратора
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: '#374151' }}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@massopro.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 text-sm"
              style={{
                background: '#ffffff',
                borderColor: '#d1d5db',
                color: '#111827',
              }}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: '#374151' }}
            >
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 text-sm"
              style={{
                background: '#ffffff',
                borderColor: '#d1d5db',
                color: '#111827',
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading ? '#7dd3e8' : '#0da2e7',
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.background = '#0b8dcc';
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.background = '#0da2e7';
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
