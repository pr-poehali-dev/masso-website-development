import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch, getSalonInfo, setSalonSession, getSalonUser } from '@/lib/salon-api';

interface DashData {
  metrics: {
    dev_index: number;
    revenue: number;
    potential: number;
    lost_income: number;
    clients: number;
    specialist_load: number;
  };
  training: { total: number; trained: number };
  posts: Array<{ id: number; title: string; body: string | null; category: string | null; link_url: string | null; created_at: string }>;
  salon: { name: string; status: string; inspection_date?: string | null; full_access?: boolean };
}

const fmt = (n: number) => n.toLocaleString('ru-RU');

const SalonDashboard = () => {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salonFetch('dashboard')
      .then((res) => {
        setData(res);
        if (res?.salon && typeof res.salon.full_access === 'boolean') {
          const user = getSalonUser();
          const info = getSalonInfo();
          if (user && info && info.full_access !== res.salon.full_access) {
            setSalonSession(user, { ...info, full_access: res.salon.full_access });
            window.dispatchEvent(new Event('salon-access-updated'));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;
  if (!data) return <div className="text-center py-20"><p className="text-sm" style={{ color: '#9ca3af' }}>Ошибка загрузки</p></div>;

  const m = data.metrics;
  const t = data.training;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-4 sm:p-6 text-center" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Индекс развития</p>
        <div className="relative w-32 h-32 mx-auto mb-3">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0da2e7" strokeWidth="3" strokeDasharray={`${m.dev_index}, 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: '#111827' }}>{m.dev_index}</span>
          </div>
        </div>
        <p className="text-xs" style={{ color: '#9ca3af' }}>из 100</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[
          { icon: 'Banknote', label: 'Текущий оборот', value: `${fmt(m.revenue)} руб.`, color: '#22c55e' },
          { icon: 'TrendingUp', label: 'Потенциальный оборот', value: `${fmt(m.potential)} руб.`, color: '#0da2e7' },
          { icon: 'TrendingDown', label: 'Потерянный доход', value: `${fmt(m.lost_income)} руб.`, color: '#ef4444' },
          { icon: 'Activity', label: 'Загрузка специалистов', value: `${m.specialist_load}%`, color: '#8b5cf6' },
        ].map((card, i) => (
          <div key={i} className="rounded-xl p-3 sm:p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${card.color}12` }}>
              <Icon name={card.icon} size={20} style={{ color: card.color }} />
            </div>
            <p className="text-lg font-bold" style={{ color: '#111827' }}>{card.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 sm:p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Статус обучения</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold" style={{ color: '#111827' }}>{t.total}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Специалистов</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{t.trained}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Прошли обучение</p>
          </div>
        </div>
      </div>

      {(() => {
        const inspDate = data.salon?.inspection_date;
        const nextInsp = inspDate ? new Date(new Date(inspDate).setFullYear(new Date(inspDate).getFullYear() + 1)) : null;
        const daysLeft = nextInsp ? Math.ceil((nextInsp.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        const isOverdue = daysLeft !== null && daysLeft < 0;
        const isSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 60;
        return (
          <div className="rounded-xl p-4 sm:p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="ClipboardCheck" size={16} style={{ color: '#6b7280' }} />
              <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Проверка персонала</h3>
            </div>
            {nextInsp ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#6b7280' }}>Следующая проверка:</p>
                  <p className="text-sm font-semibold" style={{ color: '#111827' }}>{nextInsp.toLocaleDateString('ru-RU')}</p>
                </div>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium" style={{
                  background: isOverdue ? '#fef2f2' : isSoon ? '#fffbeb' : '#f0fdf4',
                  color: isOverdue ? '#dc2626' : isSoon ? '#d97706' : '#16a34a',
                }}>
                  {isOverdue ? 'Просрочена' : isSoon ? `Осталось ${daysLeft} дней` : `Через ${daysLeft} дней`}
                </span>
              </div>
            ) : (
              <p className="text-xs" style={{ color: '#9ca3af' }}>Дата проверки пока не назначена</p>
            )}
            <p className="text-xs mt-3 pt-3 border-t" style={{ color: '#9ca3af', borderColor: '#f3f4f6' }}>
              Ежегодная выездная проверка соответствия персонала стандартам МассоПРО. Стоимость: 30 000 ₽/год.
            </p>
          </div>
        );
      })()}

      {data.posts.length > 0 && (
        <div className="rounded-xl p-4 sm:p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Newspaper" size={16} style={{ color: '#0da2e7' }} />
            <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Новости и материалы</h3>
          </div>
          <div className="space-y-3">
            {data.posts.map(post => (
              <div key={post.id} className="rounded-lg p-4 border" style={{ background: '#f9fafb', borderColor: '#f3f4f6' }}>
                <div className="flex items-start justify-between flex-wrap gap-2 mb-1.5">
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#111827' }}>{post.title}</p>
                  {post.category && (
                    <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#eff6ff', color: '#0da2e7' }}>
                      {post.category}
                    </span>
                  )}
                </div>
                {post.body && (
                  <p className="text-xs whitespace-pre-line mb-2" style={{ color: '#6b7280' }}>{post.body}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#d1d5db' }}>
                    {new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </p>
                  {post.link_url && (
                    <a
                      href={post.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{ background: '#eff6ff', color: '#0da2e7' }}
                    >
                      <Icon name="ExternalLink" size={11} />
                      Открыть
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDashboard;