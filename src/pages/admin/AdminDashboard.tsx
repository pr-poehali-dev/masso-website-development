import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { adminFetch, formatDateTime, getSalonStatusLabel, getSalonStatusColor, getLeadStatusLabel, getLeadStatusColor, getTrainingStatusLabel, getTrainingStatusColor } from '@/lib/admin-api';

interface DashboardData {
  total_salons: number;
  connected_salons: number;
  total_specialists: number;
  total_access: number;
  total_calculations: number;
  total_tests: number;
  recent_leads: Array<{
    id: number;
    name: string;
    salon_name: string | null;
    phone: string | null;
    status: string;
    created_at: string;
  }>;
  recent_salons: Array<{
    id: number;
    name: string;
    city: string | null;
    status: string;
    created_at: string;
  }>;
  recent_specialists: Array<{
    id: number;
    name: string;
    training_status: string;
    created_at: string;
  }>;
}

const StatCard = ({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
}) => (
  <div
    className="rounded-xl border p-5 flex items-start gap-4"
    style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
  >
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15` }}
    >
      <Icon name={icon} size={20} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-bold font-sans" style={{ color: '#111827' }}>
        {value}
      </p>
      <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
        {label}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('dashboard')
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Icon
            name="Loader2"
            size={32}
            className="animate-spin mx-auto"
            style={{ color: '#0da2e7' }}
          />
          <p className="text-sm mt-3" style={{ color: '#6b7280' }}>
            Загрузка данных...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <Icon name="AlertCircle" size={40} className="mx-auto" style={{ color: '#ef4444' }} />
        <p className="text-sm mt-3" style={{ color: '#6b7280' }}>
          Ошибка загрузки данных
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards - top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="Building2"
          value={data.total_salons}
          label="Всего салонов"
          color="#0da2e7"
        />
        <StatCard
          icon="CheckCircle2"
          value={data.connected_salons}
          label="Подключено"
          color="#22c55e"
        />
        <StatCard
          icon="Users"
          value={data.total_specialists}
          label="Специалистов"
          color="#8b5cf6"
        />
        <StatCard
          icon="KeyRound"
          value={data.total_access}
          label="Доступов выдано"
          color="#f59e0b"
        />
      </div>

      {/* Stat cards - second row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon="Calculator"
          value={data.total_calculations}
          label="Расчетов выполнено"
          color="#06b6d4"
        />
        <StatCard
          icon="ClipboardCheck"
          value={data.total_tests}
          label="Тестов пройдено"
          color="#ec4899"
        />
      </div>

      {/* Recent activity */}
      <div>
        <h3
          className="text-lg font-semibold font-sans mb-4"
          style={{ color: '#111827' }}
        >
          Последние события
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Recent Leads */}
          <div
            className="rounded-xl border p-5"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Inbox" size={18} style={{ color: '#0da2e7' }} />
              <h4 className="font-semibold text-sm font-sans" style={{ color: '#111827' }}>
                Новые заявки
              </h4>
            </div>
            {data.recent_leads.length === 0 ? (
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                Нет заявок
              </p>
            ) : (
              <div className="space-y-3">
                {data.recent_leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-start justify-between gap-2 pb-3 border-b last:border-0 last:pb-0"
                    style={{ borderColor: '#f3f4f6' }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#111827' }}
                      >
                        {lead.name}
                      </p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>
                        {lead.salon_name || lead.phone || '-'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getLeadStatusColor(lead.status)}`}
                    >
                      {getLeadStatusLabel(lead.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Salons */}
          <div
            className="rounded-xl border p-5"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Building2" size={18} style={{ color: '#0da2e7' }} />
              <h4 className="font-semibold text-sm font-sans" style={{ color: '#111827' }}>
                Новые салоны
              </h4>
            </div>
            {data.recent_salons.length === 0 ? (
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                Нет салонов
              </p>
            ) : (
              <div className="space-y-3">
                {data.recent_salons.map((salon) => (
                  <div
                    key={salon.id}
                    className="flex items-start justify-between gap-2 pb-3 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
                    style={{ borderColor: '#f3f4f6' }}
                    onClick={() => navigate(`/admin/salons/${salon.id}`)}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#111827' }}
                      >
                        {salon.name}
                      </p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>
                        {salon.city || '-'} &middot; {formatDateTime(salon.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getSalonStatusColor(salon.status)}`}
                    >
                      {getSalonStatusLabel(salon.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Specialists */}
          <div
            className="rounded-xl border p-5"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Users" size={18} style={{ color: '#0da2e7' }} />
              <h4 className="font-semibold text-sm font-sans" style={{ color: '#111827' }}>
                Новые специалисты
              </h4>
            </div>
            {data.recent_specialists.length === 0 ? (
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                Нет специалистов
              </p>
            ) : (
              <div className="space-y-3">
                {data.recent_specialists.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex items-start justify-between gap-2 pb-3 border-b last:border-0 last:pb-0"
                    style={{ borderColor: '#f3f4f6' }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#111827' }}
                      >
                        {spec.name}
                      </p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>
                        {formatDateTime(spec.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getTrainingStatusColor(spec.training_status)}`}
                    >
                      {getTrainingStatusLabel(spec.training_status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;