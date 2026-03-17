import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { salonPost } from '@/lib/salon-api';
import { toast } from 'sonner';

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU');

const IncomeCalculator = () => {
  const [v, setV] = useState({ specialists: 2, clients: 4, price: 3000, days: 22, course: 3 });
  const revenue = v.clients * v.price * v.days * v.specialists;
  const clients = v.clients * v.days * v.specialists;
  const potential = clients * v.course * v.price;
  const lost = v.course > 1 ? (v.course - 1) * v.price * clients : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Специалистов', key: 'specialists', min: 1, max: 50 },
          { label: 'Клиентов в день', key: 'clients', min: 1, max: 30 },
          { label: 'Цена услуги (руб.)', key: 'price', min: 100, max: 50000 },
          { label: 'Рабочих дней', key: 'days', min: 1, max: 31 },
          { label: 'Курс процедур', key: 'course', min: 1, max: 20 },
        ].map(f => (
          <div key={f.key} className="space-y-1.5">
            <Label className="text-xs" style={{ color: '#6b7280' }}>{f.label}</Label>
            <Input
              type="number"
              min={f.min}
              max={f.max}
              value={v[f.key as keyof typeof v]}
              onChange={e => setV({ ...v, [f.key]: Number(e.target.value) || 0 })}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: '#f0fdf4' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Оборот</p>
          <p className="text-xl font-bold" style={{ color: '#22c55e' }}>{fmt(revenue)} руб.</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: '#eff6ff' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Потенциал</p>
          <p className="text-xl font-bold" style={{ color: '#0da2e7' }}>{fmt(potential)} руб.</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: '#fef2f2' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Потерянный доход</p>
          <p className="text-xl font-bold" style={{ color: '#ef4444' }}>{fmt(lost)} руб.</p>
        </div>
      </div>
    </div>
  );
};

const LoadCalculator = () => {
  const [v, setV] = useState({ clients: 4, duration: 1.5, hours: 8 });
  const load = v.hours > 0 ? (v.clients * v.duration / v.hours * 100) : 0;
  const color = load >= 80 ? '#ef4444' : load >= 50 ? '#f59e0b' : '#22c55e';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Клиентов в день', key: 'clients' },
          { label: 'Длительность (часы)', key: 'duration' },
          { label: 'Рабочие часы', key: 'hours' },
        ].map(f => (
          <div key={f.key} className="space-y-1.5">
            <Label className="text-xs" style={{ color: '#6b7280' }}>{f.label}</Label>
            <Input
              type="number"
              step="0.5"
              value={v[f.key as keyof typeof v]}
              onChange={e => setV({ ...v, [f.key]: Number(e.target.value) || 0 })}
              className="text-sm"
              style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
            />
          </div>
        ))}
      </div>
      <div className="text-center py-4">
        <p className="text-4xl font-bold mb-1" style={{ color }}>{load.toFixed(1)}%</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>Загрузка специалиста</p>
        <div className="w-full h-3 rounded-full mt-3 overflow-hidden" style={{ background: '#f3f4f6' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(load, 100)}%`, background: color }} />
        </div>
      </div>
    </div>
  );
};

const ForecastCalculator = () => {
  const [revenue, setRevenue] = useState(500000);
  const forecasts = [
    { label: '3 месяца', coef: 1.5, months: 3 },
    { label: '6 месяцев', coef: 2, months: 6 },
    { label: '12 месяцев', coef: 3, months: 12 },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-1.5 max-w-xs">
        <Label className="text-xs" style={{ color: '#6b7280' }}>Текущий оборот (руб./мес.)</Label>
        <Input
          type="number"
          value={revenue}
          onChange={e => setRevenue(Number(e.target.value) || 0)}
          className="text-sm"
          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {forecasts.map(f => (
          <div key={f.months} className="rounded-xl p-5 text-center" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <p className="text-xs mb-2" style={{ color: '#6b7280' }}>{f.label}</p>
            <p className="text-2xl font-bold" style={{ color: '#0da2e7' }}>{fmt(revenue * f.coef)}</p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>коэф. ×{f.coef}</p>
          </div>
        ))}
      </div>
      <p className="text-xs" style={{ color: '#9ca3af' }}>
        Прогноз основан на росте курса процедур и загрузки специалистов
      </p>
    </div>
  );
};

const DiagnosticTest = () => {
  const [answers, setAnswers] = useState({ q_client_return: 30, q_has_diagnostics: false, q_has_programs: false, q_procedures_per_client: 2 });
  const [result, setResult] = useState<{ result_index: number; recommendations: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await salonPost('diagnostics', answers);
    if (res.diagnostics) {
      setResult(res.diagnostics);
    } else {
      toast.error(res.error || 'Ошибка');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs" style={{ color: '#6b7280' }}>Сколько % клиентов возвращаются?</Label>
          <Input type="number" min={0} max={100} value={answers.q_client_return} onChange={e => setAnswers({ ...answers, q_client_return: Number(e.target.value) })} className="text-sm max-w-xs" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={answers.q_has_diagnostics} onChange={e => setAnswers({ ...answers, q_has_diagnostics: e.target.checked })} className="rounded" />
          <Label className="text-sm" style={{ color: '#374151' }}>Есть ли диагностика клиентов?</Label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={answers.q_has_programs} onChange={e => setAnswers({ ...answers, q_has_programs: e.target.checked })} className="rounded" />
          <Label className="text-sm" style={{ color: '#374151' }}>Есть ли курсовые программы?</Label>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs" style={{ color: '#6b7280' }}>Сколько процедур проходит клиент?</Label>
          <Input type="number" min={1} max={30} value={answers.q_procedures_per_client} onChange={e => setAnswers({ ...answers, q_procedures_per_client: Number(e.target.value) })} className="text-sm max-w-xs" style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="h-10 px-6 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#0da2e7' }}>
        {loading ? 'Расчёт...' : 'Пройти диагностику'}
      </button>

      {result && (
        <div className="rounded-xl p-5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>{Number(result.result_index)}</p>
            <p className="text-sm" style={{ color: '#6b7280' }}>из 100</p>
          </div>
          <div className="space-y-1">
            {result.recommendations.split('\n').map((r, i) => (
              <p key={i} className="text-sm" style={{ color: '#374151' }}>{r}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SalonTools = () => (
  <Tabs defaultValue="calculator">
    <TabsList className="rounded-lg p-1 flex-wrap" style={{ background: '#f3f4f6' }}>
      <TabsTrigger value="calculator" className="rounded-md text-sm data-[state=active]:shadow-sm" style={{ color: '#6b7280' }}>
        <Icon name="Calculator" size={14} className="mr-1.5" /> Калькулятор
      </TabsTrigger>
      <TabsTrigger value="load" className="rounded-md text-sm data-[state=active]:shadow-sm" style={{ color: '#6b7280' }}>
        <Icon name="Activity" size={14} className="mr-1.5" /> Загрузка
      </TabsTrigger>
      <TabsTrigger value="forecast" className="rounded-md text-sm data-[state=active]:shadow-sm" style={{ color: '#6b7280' }}>
        <Icon name="TrendingUp" size={14} className="mr-1.5" /> Прогноз
      </TabsTrigger>
      <TabsTrigger value="diagnostics" className="rounded-md text-sm data-[state=active]:shadow-sm" style={{ color: '#6b7280' }}>
        <Icon name="Stethoscope" size={14} className="mr-1.5" /> Диагностика
      </TabsTrigger>
    </TabsList>

    {[
      { val: 'calculator', title: 'Калькулятор дохода', desc: 'Рассчитайте оборот, потенциал и потерянный доход', comp: <IncomeCalculator /> },
      { val: 'load', title: 'Загрузка специалистов', desc: 'Оцените загруженность ваших специалистов', comp: <LoadCalculator /> },
      { val: 'forecast', title: 'Прогноз дохода', desc: 'Прогнозирование роста при увеличении курса и загрузки', comp: <ForecastCalculator /> },
      { val: 'diagnostics', title: 'Диагностика салона', desc: 'Пройдите тест и получите рекомендации', comp: <DiagnosticTest /> },
    ].map(tab => (
      <TabsContent key={tab.val} value={tab.val}>
        <div className="rounded-xl p-6 mt-4" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h3 className="text-base font-semibold mb-1" style={{ color: '#111827' }}>{tab.title}</h3>
          <p className="text-xs mb-5" style={{ color: '#9ca3af' }}>{tab.desc}</p>
          {tab.comp}
        </div>
      </TabsContent>
    ))}
  </Tabs>
);

export default SalonTools;
