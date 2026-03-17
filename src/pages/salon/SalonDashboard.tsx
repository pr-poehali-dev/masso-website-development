import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch } from '@/lib/salon-api';

interface DashData {
  metrics: {
    dev_index: number;
    revenue: number;
    potential: number;
    lost_income: number;
    clients: number;
    specialist_load: number;
  };
  training: { total: number; trained: number; attested: number };
  posts: Array<{ id: number; title: string; body: string | null; category: string | null; created_at: string }>;
  salon: { name: string; status: string };
}

const fmt = (n: number) => n.toLocaleString('ru-RU');

const SalonDashboard = () => {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salonFetch('dashboard')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;
  if (!data) return <div className="text-center py-20"><p className="text-sm" style={{ color: '#9ca3af' }}>Ошибка загрузки</p></div>;

  const m = data.metrics;
  const t = data.training;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 text-center" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'Banknote', label: 'Текущий оборот', value: `${fmt(m.revenue)} руб.`, color: '#22c55e' },
          { icon: 'TrendingUp', label: 'Потенциальный оборот', value: `${fmt(m.potential)} руб.`, color: '#0da2e7' },
          { icon: 'TrendingDown', label: 'Потерянный доход', value: `${fmt(m.lost_income)} руб.`, color: '#ef4444' },
          { icon: 'Activity', label: 'Загрузка специалистов', value: `${m.specialist_load}%`, color: '#8b5cf6' },
        ].map((card, i) => (
          <div key={i} className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${card.color}12` }}>
              <Icon name={card.icon} size={20} style={{ color: card.color }} />
            </div>
            <p className="text-lg font-bold" style={{ color: '#111827' }}>{card.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Статус обучения</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold" style={{ color: '#111827' }}>{t.total}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Специалистов</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{t.trained}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Прошли обучение</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{t.attested}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Аттестованы</p>
          </div>
        </div>
      </div>

      {data.posts.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Последние публикации</h3>
          <div className="space-y-3">
            {data.posts.map(post => (
              <div key={post.id} className="pb-3 border-b last:border-0 last:pb-0" style={{ borderColor: '#f3f4f6' }}>
                <p className="text-sm font-medium" style={{ color: '#111827' }}>{post.title}</p>
                {post.body && <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#6b7280' }}>{post.body}</p>}
                <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>{new Date(post.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDashboard;
