import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch } from '@/lib/salon-api';

interface Metric {
  period: string;
  revenue: number;
  clients_count: number;
  avg_check: number;
  return_rate: number;
  procedure_course: number;
  specialist_load: number;
}

const fmt = (n: number) => n.toLocaleString('ru-RU');
const periods = [
  { label: 'Месяц', value: '1' },
  { label: '3 месяца', value: '3' },
  { label: '12 месяцев', value: '12' },
];

const SalonAnalytics = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [settings, setSettings] = useState<Record<string, number> | null>(null);
  const [period, setPeriod] = useState('1');
  const [loading, setLoading] = useState(true);

  const load = (m: string) => {
    setLoading(true);
    salonFetch('analytics', { months: m })
      .then(res => { setMetrics(res.metrics || []); setSettings(res.settings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(period); }, [period]);

  const totalRevenue = metrics.reduce((s, m) => s + Number(m.revenue || 0), 0);
  const totalClients = metrics.reduce((s, m) => s + Number(m.clients_count || 0), 0);
  const avgCheck = totalClients > 0 ? totalRevenue / totalClients : 0;
  const avgReturn = metrics.length > 0 ? metrics.reduce((s, m) => s + Number(m.return_rate || 0), 0) / metrics.length : 0;
  const avgCourse = metrics.length > 0 ? metrics.reduce((s, m) => s + Number(m.procedure_course || 0), 0) / metrics.length : 0;

  const maxRev = Math.max(...metrics.map(m => Number(m.revenue || 0)), 1);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {periods.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className="h-9 px-4 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: period === p.value ? '#0da2e7' : '#ffffff',
              color: period === p.value ? '#ffffff' : '#6b7280',
              border: `1px solid ${period === p.value ? '#0da2e7' : '#e5e7eb'}`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Icon name="Loader2" size={28} className="animate-spin" style={{ color: '#0da2e7' }} /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Оборот', value: `${fmt(Math.round(totalRevenue))} руб.`, color: '#22c55e' },
              { label: 'Средний чек', value: `${fmt(Math.round(avgCheck))} руб.`, color: '#0da2e7' },
              { label: 'Клиенты', value: fmt(totalClients), color: '#8b5cf6' },
              { label: 'Курс процедур', value: avgCourse.toFixed(1), color: '#f59e0b' },
              { label: 'Возврат клиентов', value: `${avgReturn.toFixed(1)}%`, color: '#06b6d4' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <p className="text-xs mb-1" style={{ color: '#6b7280' }}>{c.label}</p>
                <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Доход по периодам</h3>
            {metrics.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Нет данных за выбранный период. Данные появятся после начала работы.</p>
            ) : (
              <div className="flex items-end gap-2 h-40">
                {metrics.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${m.period}: ${fmt(Number(m.revenue))} руб.`}>
                    <div
                      className="w-full rounded-t transition-all"
                      style={{ height: `${Math.max((Number(m.revenue) / maxRev) * 100, 4)}%`, background: '#0da2e7', minHeight: 4 }}
                    />
                    <p className="text-[10px] mt-1 truncate w-full text-center" style={{ color: '#9ca3af' }}>
                      {new Date(m.period).toLocaleDateString('ru-RU', { month: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {settings && (
            <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Текущие параметры</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span style={{ color: '#6b7280' }}>Специалистов:</span> <span className="font-medium" style={{ color: '#111827' }}>{settings.specialists_count}</span></div>
                <div><span style={{ color: '#6b7280' }}>Клиентов/день:</span> <span className="font-medium" style={{ color: '#111827' }}>{settings.clients_per_day}</span></div>
                <div><span style={{ color: '#6b7280' }}>Цена:</span> <span className="font-medium" style={{ color: '#111827' }}>{fmt(Number(settings.avg_price))} руб.</span></div>
                <div><span style={{ color: '#6b7280' }}>Раб. дней:</span> <span className="font-medium" style={{ color: '#111827' }}>{settings.working_days}</span></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalonAnalytics;
