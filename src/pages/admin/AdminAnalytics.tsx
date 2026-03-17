import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { adminFetch, getSalonStatusLabel, getSalonStatusColor } from '@/lib/admin-api';

interface AnalyticsData {
  summary: {
    total_salons: number;
    connected: number;
    training: number;
    certified: number;
    total_specialists: number;
    certified_specialists: number;
    active_access: number;
    new_leads: number;
  };
  salon_by_status: Array<{ status: string; cnt: number }>;
  specs_by_status: Array<{ training_status: string; cnt: number }>;
  top_salons: Array<{
    salon_name: string;
    city: string | null;
    status: string;
    specialist_count: number;
    rating: number;
  }>;
  analytics: Array<{
    total_revenue: number;
    avg_check: number;
    avg_load: number;
    avg_return: number;
    total_calcs: number;
    total_tests: number;
  }>;
  leads_by_day: Array<{ day: string; cnt: number }>;
  salons_by_day: Array<{ day: string; cnt: number }>;
}

const trainingLabels: Record<string, string> = {
  added: 'Добавлен',
  in_progress: 'Обучается',
  completed: 'Завершил',
  certified: 'Сертифицирован',
};

const MetricCard = ({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) => (
  <div className="rounded-xl border p-4" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon name={icon} size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold font-sans" style={{ color: '#111827' }}>{value}</p>
        <p className="text-xs" style={{ color: '#6b7280' }}>{label}</p>
      </div>
    </div>
  </div>
);

const BarItem = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs w-28 flex-shrink-0 text-right" style={{ color: '#6b7280' }}>{label}</span>
    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: max > 0 ? `${Math.max((value / max) * 100, 4)}%` : '4%', background: color }}
      />
    </div>
    <span className="text-sm font-semibold w-8 text-right" style={{ color: '#111827' }}>{value}</span>
  </div>
);

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('analytics')
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <Icon name="AlertCircle" size={40} className="mx-auto" style={{ color: '#ef4444' }} />
        <p className="text-sm mt-3" style={{ color: '#6b7280' }}>Ошибка загрузки аналитики</p>
      </div>
    );
  }

  const s = data.summary;
  const agg = data.analytics[0] || { total_revenue: 0, avg_check: 0, avg_load: 0, avg_return: 0, total_calcs: 0, total_tests: 0 };
  const maxSalonStatus = Math.max(...data.salon_by_status.map(i => i.cnt), 1);
  const maxSpecStatus = Math.max(...data.specs_by_status.map(i => i.cnt), 1);
  const statusColors = ['#0da2e7', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard icon="Building2" label="Всего салонов" value={s.total_salons} color="#0da2e7" />
        <MetricCard icon="CheckCircle2" label="Подключено" value={s.connected} color="#22c55e" />
        <MetricCard icon="GraduationCap" label="Обучаются" value={s.training} color="#f59e0b" />
        <MetricCard icon="Award" label="Сертифицированы" value={s.certified} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard icon="Users" label="Специалистов" value={s.total_specialists} color="#06b6d4" />
        <MetricCard icon="UserCheck" label="Серт. специалистов" value={s.certified_specialists} color="#10b981" />
        <MetricCard icon="KeyRound" label="Акт. доступов" value={s.active_access} color="#f59e0b" />
        <MetricCard icon="Inbox" label="Новых заявок" value={s.new_leads} color="#ef4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold mb-4 font-sans" style={{ color: '#111827' }}>Салоны по статусам</h3>
          <div className="space-y-2.5">
            {data.salon_by_status.map((item, i) => (
              <BarItem
                key={item.status}
                label={getSalonStatusLabel(item.status)}
                value={item.cnt}
                max={maxSalonStatus}
                color={statusColors[i % statusColors.length]}
              />
            ))}
            {data.salon_by_status.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: '#9ca3af' }}>Нет данных</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold mb-4 font-sans" style={{ color: '#111827' }}>Специалисты по статусу обучения</h3>
          <div className="space-y-2.5">
            {data.specs_by_status.map((item, i) => (
              <BarItem
                key={item.training_status}
                label={trainingLabels[item.training_status] || item.training_status}
                value={item.cnt}
                max={maxSpecStatus}
                color={statusColors[i % statusColors.length]}
              />
            ))}
            {data.specs_by_status.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: '#9ca3af' }}>Нет данных</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard icon="DollarSign" label="Общая выручка" value={`${Number(agg.total_revenue).toLocaleString('ru-RU')} руб.`} color="#22c55e" />
        <MetricCard icon="Receipt" label="Средний чек" value={`${Number(agg.avg_check).toLocaleString('ru-RU')} руб.`} color="#0da2e7" />
        <MetricCard icon="TrendingUp" label="Загрузка спец." value={`${Number(agg.avg_load).toFixed(1)}%`} color="#8b5cf6" />
        <MetricCard icon="RotateCcw" label="Возвращаемость" value={`${Number(agg.avg_return).toFixed(1)}%`} color="#f59e0b" />
        <MetricCard icon="Calculator" label="Расчётов" value={agg.total_calcs} color="#06b6d4" />
        <MetricCard icon="ClipboardCheck" label="Тестов" value={agg.total_tests} color="#ec4899" />
      </div>

      <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <h3 className="text-sm font-semibold mb-4 font-sans" style={{ color: '#111827' }}>Топ-10 салонов по рейтингу</h3>
        {data.top_salons.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>Нет данных</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th className="text-left py-2 px-3 font-semibold text-xs" style={{ color: '#6b7280' }}>#</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs" style={{ color: '#6b7280' }}>Салон</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs" style={{ color: '#6b7280' }}>Город</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs" style={{ color: '#6b7280' }}>Статус</th>
                  <th className="text-center py-2 px-3 font-semibold text-xs" style={{ color: '#6b7280' }}>Спец-ты</th>
                  <th className="text-center py-2 px-3 font-semibold text-xs" style={{ color: '#6b7280' }}>Рейтинг</th>
                </tr>
              </thead>
              <tbody>
                {data.top_salons.map((salon, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td className="py-2 px-3 font-mono" style={{ color: '#9ca3af' }}>{i + 1}</td>
                    <td className="py-2 px-3 font-medium" style={{ color: '#111827' }}>{salon.salon_name}</td>
                    <td className="py-2 px-3" style={{ color: '#6b7280' }}>{salon.city || '-'}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getSalonStatusColor(salon.status)}`}>
                        {getSalonStatusLabel(salon.status)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center" style={{ color: '#6b7280' }}>{salon.specialist_count}</td>
                    <td className="py-2 px-3 text-center font-semibold" style={{ color: '#0da2e7' }}>{Number(salon.rating).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold mb-3 font-sans" style={{ color: '#111827' }}>Заявки за 30 дней</h3>
          {data.leads_by_day.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>Нет данных</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {data.leads_by_day.map((d, i) => {
                const max = Math.max(...data.leads_by_day.map(x => x.cnt), 1);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.day}: ${d.cnt}`}>
                    <div
                      className="w-full rounded-t"
                      style={{ height: `${Math.max((d.cnt / max) * 100, 4)}%`, background: '#0da2e7', minHeight: 2 }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold mb-3 font-sans" style={{ color: '#111827' }}>Салоны за 30 дней</h3>
          {data.salons_by_day.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>Нет данных</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {data.salons_by_day.map((d, i) => {
                const max = Math.max(...data.salons_by_day.map(x => x.cnt), 1);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.day}: ${d.cnt}`}>
                    <div
                      className="w-full rounded-t"
                      style={{ height: `${Math.max((d.cnt / max) * 100, 4)}%`, background: '#22c55e', minHeight: 2 }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
