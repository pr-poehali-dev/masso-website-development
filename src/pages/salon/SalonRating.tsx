import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch } from '@/lib/salon-api';

interface RatingData {
  rating: number;
  rating_100: number;
  trained_pct: number;
  attested_pct: number;
  techniques_count: number;
  tech_score: number;
  status: string;
  total_specialists: number;
  trained: number;
  attested: number;
}

const statusStyles: Record<string, { color: string; bg: string }> = {
  'участник': { color: '#6b7280', bg: '#f3f4f6' },
  'сертифицирован': { color: '#0da2e7', bg: '#eff6ff' },
  'профессиональный': { color: '#8b5cf6', bg: '#f5f3ff' },
};

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

  const ss = statusStyles[data.status] || statusStyles['участник'];

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
          {Array.from({ length: 5 }, (_, i) => (
            <Icon key={i} name="Star" size={24} style={{ color: i < Math.round(data.rating) ? '#f59e0b' : '#e5e7eb' }} />
          ))}
        </div>

        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: ss.bg, color: ss.color }}
        >
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '% обученных', value: `${data.trained_pct}%`, sub: `${data.trained} из ${data.total_specialists}`, color: '#22c55e' },
          { label: '% аттестованных', value: `${data.attested_pct}%`, sub: `${data.attested} из ${data.total_specialists}`, color: '#8b5cf6' },
          { label: 'Кол-во техник', value: String(data.techniques_count), sub: `Балл: ${data.tech_score}/100`, color: '#0da2e7' },
        ].map((c, i) => (
          <div key={i} className="rounded-xl p-5 text-center" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{c.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#d1d5db' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Как повысить рейтинг</h3>
        <div className="space-y-2">
          {[
            { icon: 'GraduationCap', text: 'Пройдите обучение всех специалистов', done: data.trained_pct >= 100 },
            { icon: 'Award', text: 'Пройдите аттестацию всех специалистов', done: data.attested_pct >= 100 },
            { icon: 'Layers', text: 'Добавьте больше техник в профиль', done: data.techniques_count >= 5 },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <Icon name={tip.done ? 'CheckCircle2' : tip.icon} size={18} style={{ color: tip.done ? '#22c55e' : '#9ca3af' }} />
              <p className="text-sm" style={{ color: tip.done ? '#22c55e' : '#374151' }}>{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalonRating;
