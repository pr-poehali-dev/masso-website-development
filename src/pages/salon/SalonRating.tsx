import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch } from '@/lib/salon-api';

interface RatingData {
  rating: number;
  rating_100: number;
  offline_pct: number;
  trained_pct: number;
  attested_pct: number;
  status: string;
  total_specialists: number;
  offline_trained: number;
  trained: number;
  attested: number;
}

const statusStyles: Record<string, { color: string; bg: string }> = {
  'Участник':       { color: '#6b7280', bg: '#f3f4f6' },
  'Обучен':         { color: '#f59e0b', bg: '#fffbeb' },
  'Сертифицирован': { color: '#0da2e7', bg: '#eff6ff' },
  'Профессиональный': { color: '#8b5cf6', bg: '#f5f3ff' },
};

const STEPS = [
  { key: 'offline', label: 'Офлайн обучение', max: 4.0, description: '100% специалистов прошли офлайн обучение → 4.0 ★' },
  { key: 'online',  label: 'Онлайн обучение', max: 4.5, description: '100% завершили онлайн курс → +0.5 ★ (итого 4.5)' },
  { key: 'attest',  label: 'Аттестация',       max: 5.0, description: '100% аттестованы → +0.5 ★ (итого 5.0)' },
];

const SalonRating = () => {
  const [data, setData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salonFetch('rating')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;
  if (!data) return <div className="text-center py-20"><p className="text-sm" style={{ color: '#9ca3af' }}>Ошибка загрузки</p></div>;

  const ss = statusStyles[data.status] || statusStyles['Участник'];
  const filledStars = Math.floor(data.rating);
  const halfStar = data.rating - filledStars >= 0.25;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-2xl p-8 text-center" style={{ background: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div className="relative w-36 h-36 mx-auto mb-4">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0da2e7" strokeWidth="2.5" strokeDasharray={`${data.rating / 5 * 100}, 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: '#111827' }}>{data.rating}</span>
            <span className="text-sm" style={{ color: '#9ca3af' }}>из 5</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: 5 }, (_, i) => {
            const filled = i < filledStars;
            const half = !filled && i === filledStars && halfStar;
            return (
              <Icon
                key={i}
                name={filled ? 'Star' : half ? 'StarHalf' : 'Star'}
                size={24}
                style={{ color: filled || half ? '#f59e0b' : '#e5e7eb' }}
              />
            );
          })}
        </div>

        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: ss.bg, color: ss.color }}
        >
          {data.status}
        </span>
      </div>

      <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Путь к максимальному рейтингу</h3>
        <div className="space-y-4">
          {[
            {
              label: 'Офлайн обучение',
              pct: data.offline_pct,
              count: data.offline_trained,
              total: data.total_specialists,
              reward: '→ 4.0 ★',
              color: '#f59e0b',
              done: data.offline_pct >= 100,
            },
            {
              label: 'Онлайн обучение завершено',
              pct: data.trained_pct,
              count: data.trained,
              total: data.total_specialists,
              reward: '→ +0.5 ★ (итого 4.5)',
              color: '#0da2e7',
              done: data.trained_pct >= 100,
            },
            {
              label: 'Аттестация пройдена',
              pct: data.attested_pct,
              count: data.attested,
              total: data.total_specialists,
              reward: '→ +0.5 ★ (итого 5.0)',
              color: '#8b5cf6',
              done: data.attested_pct >= 100,
            },
          ].map((step, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon
                    name={step.done ? 'CheckCircle2' : 'Circle'}
                    size={16}
                    style={{ color: step.done ? '#22c55e' : '#d1d5db' }}
                  />
                  <span className="text-sm font-medium" style={{ color: step.done ? '#22c55e' : '#374151' }}>
                    {step.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    {step.count} из {step.total}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: step.color }}>
                    {step.reward}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${step.pct}%`, background: step.done ? '#22c55e' : step.color }}
                />
              </div>
              <div className="text-right mt-0.5">
                <span className="text-xs" style={{ color: '#9ca3af' }}>{step.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Офлайн обучены', value: `${data.offline_trained}/${data.total_specialists}`, sub: `${data.offline_pct}%`, color: '#f59e0b' },
          { label: 'Онлайн завершили', value: `${data.trained}/${data.total_specialists}`, sub: `${data.trained_pct}%`, color: '#0da2e7' },
          { label: 'Аттестованы', value: `${data.attested}/${data.total_specialists}`, sub: `${data.attested_pct}%`, color: '#8b5cf6' },
        ].map((c, i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{c.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#d1d5db' }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonRating;
