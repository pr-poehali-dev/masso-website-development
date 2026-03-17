import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch } from '@/lib/salon-api';

interface TrainingSpec {
  id: number;
  name: string;
  email: string | null;
  training_status: string;
  attestation_status: string;
  access_status: string | null;
  issued_at: string | null;
  activated_at: string | null;
}

const trainingLabels: Record<string, string> = {
  added: 'Не начато', in_progress: 'Обучается', completed: 'Завершил', certified: 'Сертифицирован',
};

const accessLabels: Record<string, string> = {
  issued: 'Доступ выдан', activated: 'Активирован', expired: 'Истёк',
};

const getStatusIcon = (status: string) => {
  const map: Record<string, { icon: string; color: string }> = {
    added: { icon: 'Circle', color: '#d1d5db' },
    in_progress: { icon: 'Clock', color: '#0da2e7' },
    completed: { icon: 'CheckCircle2', color: '#22c55e' },
    certified: { icon: 'Award', color: '#8b5cf6' },
  };
  return map[status] || map.added;
};

const SalonTraining = () => {
  const [specs, setSpecs] = useState<TrainingSpec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salonFetch('training')
      .then(res => setSpecs(res.specialists || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 mb-2">
          <Icon name="GraduationCap" size={24} style={{ color: '#0da2e7' }} />
          <div>
            <h3 className="text-base font-semibold" style={{ color: '#111827' }}>Обучение на Док Диалог</h3>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Специалисты проходят обучение на платформе Док Диалог</p>
          </div>
        </div>
        <a
          href="https://dokdialog.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white mt-3"
          style={{ background: '#0da2e7' }}
        >
          <Icon name="ExternalLink" size={16} />
          Перейти на платформу
        </a>
      </div>

      {specs.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
          <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>Нет специалистов. Добавьте их в разделе «Специалисты»</p>
        </div>
      ) : (
        <div className="space-y-3">
          {specs.map(s => {
            const si = getStatusIcon(s.training_status);
            return (
              <div key={s.id} className="rounded-xl p-5" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: si.color }}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#111827' }}>{s.name}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{s.email || '-'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Icon name={si.icon} size={14} style={{ color: si.color }} />
                      <span className="text-sm font-medium" style={{ color: si.color }}>
                        {trainingLabels[s.training_status] || s.training_status}
                      </span>
                    </div>
                    {s.access_status && (
                      <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                        {accessLabels[s.access_status] || s.access_status}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-3">
                  {['added', 'in_progress', 'completed', 'certified'].map((step, i) => {
                    const steps = ['added', 'in_progress', 'completed', 'certified'];
                    const current = steps.indexOf(s.training_status);
                    const done = i <= current;
                    return (
                      <div key={step} className="flex-1">
                        <div className="h-1.5 rounded-full" style={{ background: done ? '#0da2e7' : '#f3f4f6' }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SalonTraining;
