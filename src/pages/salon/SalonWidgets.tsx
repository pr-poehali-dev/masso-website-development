import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { getSalonInfo, getSalonUser, salonFetch } from '@/lib/salon-api';

const BASE_URL = window.location.origin;

function CodeBlock({ code, onCopy, copied }: { code: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="relative">
      <pre
        className="rounded-xl p-4 text-xs leading-relaxed overflow-x-auto font-mono"
        style={{ background: '#0f1117', color: '#a3e635', border: '1px solid #1e293b' }}
      >
        {code}
      </pre>
      <button
        onClick={onCopy}
        className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
        style={{
          background: copied ? '#22c55e' : '#1e293b',
          color: copied ? '#ffffff' : '#94a3b8',
        }}
      >
        <Icon name={copied ? 'Check' : 'Copy'} size={12} />
        {copied ? 'Скопировано' : 'Копировать'}
      </button>
    </div>
  );
}

function WidgetPreviewLight({ salonName, rating, city }: { salonName: string; rating: number; city: string }) {
  const filled = Math.floor(rating);
  const half = rating - filled >= 0.25;
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 w-full max-w-[280px]"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
          <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/5e29a734-782f-42a5-9119-c5310a1e6b78.jpg" alt="МассоПРО" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: '#111827' }}>{salonName}</p>
          {city && <p className="text-[11px]" style={{ color: '#9ca3af' }}>{city}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ fontSize: 14, color: (i < filled || (i === filled && half)) ? '#f59e0b' : '#e5e7eb' }}>★</span>
          ))}
        </div>
        <span className="text-sm font-bold" style={{ color: '#111827' }}>{rating.toFixed(1)}</span>
        <span className="text-xs" style={{ color: '#9ca3af' }}>/ 5.0</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontSize: 12 }}>✅</span>
        <span className="text-[11px] font-medium" style={{ color: '#0da2e7' }}>Сертифицировано МассоПРО</span>
      </div>
    </div>
  );
}

function WidgetPreviewDark({ salonName, rating, city }: { salonName: string; rating: number; city: string }) {
  const filled = Math.floor(rating);
  const half = rating - filled >= 0.25;
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 w-full max-w-[280px]"
      style={{
        background: 'linear-gradient(135deg, hsl(220,25%,10%) 0%, hsl(220,25%,7%) 100%)',
        border: '1px solid hsla(185,85%,45%,0.25)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
          <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/e2e8ddb9-fb75-459a-84ab-7b0e7867fad9.jpg" alt="МассоПРО" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: '#f9fafb' }}>{salonName}</p>
          {city && <p className="text-[11px]" style={{ color: 'hsl(185,85%,55%)' }}>{city}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ fontSize: 14, color: (i < filled || (i === filled && half)) ? '#f59e0b' : 'hsla(185,85%,45%,0.25)' }}>★</span>
          ))}
        </div>
        <span className="text-sm font-bold" style={{ color: '#f9fafb' }}>{rating.toFixed(1)}</span>
        <span className="text-xs" style={{ color: 'hsl(185,85%,55%)' }}>/ 5.0</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontSize: 12 }}>✅</span>
        <span className="text-[11px] font-medium" style={{ color: 'hsl(185,85%,55%)' }}>Сертифицировано МассоПРО</span>
      </div>
    </div>
  );
}

function generateLightCode(salonId: number, salonName: string, rating: number, city: string, url: string) {
  return `<!-- Виджет МассоПРО (светлая тема) -->
<a href="${url}/catalog/${salonId}" target="_blank" rel="noopener"
   style="display:inline-flex;flex-direction:column;gap:12px;padding:16px;
          background:#fff;border:1px solid #e5e7eb;border-radius:16px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);text-decoration:none;
          font-family:system-ui,sans-serif;max-width:280px;">
  <div style="display:flex;align-items:center;gap:12px;">
    <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/5e29a734-782f-42a5-9119-c5310a1e6b78.jpg"
         alt="МассоПРО" style="width:40px;height:40px;border-radius:12px;object-fit:cover;flex-shrink:0;">
    <div>
      <p style="margin:0;font-size:12px;font-weight:600;color:#111827;">${salonName}</p>
      ${city ? `<p style="margin:0;font-size:11px;color:#9ca3af;">${city}</p>` : ''}
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size:14px;letter-spacing:1px;color:#f59e0b;">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</span>
    <span style="font-size:14px;font-weight:700;color:#111827;">${rating.toFixed(1)}</span>
    <span style="font-size:12px;color:#9ca3af;">/ 5.0</span>
  </div>
  <div style="display:flex;align-items:center;gap:6px;">
    <span style="font-size:12px;">✅</span>
    <span style="font-size:11px;font-weight:500;color:#0da2e7;">Сертифицировано МассоПРО</span>
  </div>
</a>`;
}

function generateDarkCode(salonId: number, salonName: string, rating: number, city: string, url: string) {
  return `<!-- Виджет МассоПРО (тёмная тема) -->
<a href="${url}/catalog/${salonId}" target="_blank" rel="noopener"
   style="display:inline-flex;flex-direction:column;gap:12px;padding:16px;
          background:linear-gradient(135deg,#141928 0%,#0e1320 100%);
          border:1px solid rgba(13,210,231,0.25);border-radius:16px;
          box-shadow:0 4px 20px rgba(0,0,0,0.3);text-decoration:none;
          font-family:system-ui,sans-serif;max-width:280px;">
  <div style="display:flex;align-items:center;gap:12px;">
    <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/e2e8ddb9-fb75-459a-84ab-7b0e7867fad9.jpg"
         alt="МассоПРО" style="width:40px;height:40px;border-radius:12px;object-fit:cover;flex-shrink:0;">
    <div>
      <p style="margin:0;font-size:12px;font-weight:600;color:#f9fafb;">${salonName}</p>
      ${city ? `<p style="margin:0;font-size:11px;color:#0dd2e7;">${city}</p>` : ''}
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size:14px;letter-spacing:1px;color:#f59e0b;">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</span>
    <span style="font-size:14px;font-weight:700;color:#f9fafb;">${rating.toFixed(1)}</span>
    <span style="font-size:12px;color:#0dd2e7;">/ 5.0</span>
  </div>
  <div style="display:flex;align-items:center;gap:6px;">
    <span style="font-size:12px;">✅</span>
    <span style="font-size:11px;font-weight:500;color:#0dd2e7;">Сертифицировано МассоПРО</span>
  </div>
</a>`;
}

const SalonWidgets = () => {
  const [rating, setRating] = useState(0);
  const [salonName, setSalonName] = useState('');
  const [city, setCity] = useState('');
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLight, setCopiedLight] = useState(false);
  const [copiedDark, setCopiedDark] = useState(false);

  useEffect(() => {
    const info = getSalonInfo();
    const user = getSalonUser();
    if (info) {
      setSalonName(info.name);
      setSalonId(info.id);
    }
    Promise.all([
      salonFetch('rating').catch(() => null),
      salonFetch('profile').catch(() => null),
    ]).then(([ratingData, profileData]) => {
      if (ratingData?.rating !== undefined) setRating(Number(ratingData.rating));
      if (profileData?.city) setCity(profileData.city);
    }).finally(() => setLoading(false));
  }, []);

  const copy = (text: string, setter: (v: boolean) => void) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      navigator.clipboard?.writeText(text).then(() => {
        setter(true);
        setTimeout(() => setter(false), 2000);
      });
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} />
    </div>
  );

  if (!salonId) return (
    <div className="text-center py-20">
      <p className="text-sm" style={{ color: '#9ca3af' }}>Ошибка загрузки данных</p>
    </div>
  );

  const catalogUrl = `${BASE_URL}/catalog/${salonId}`;
  const lightCode = generateLightCode(salonId, salonName, rating, city, BASE_URL);
  const darkCode = generateDarkCode(salonId, salonName, rating, city, BASE_URL);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eff6ff' }}>
            <Icon name="Code2" size={20} style={{ color: '#0da2e7' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: '#111827' }}>Виджеты для вашего сайта</h3>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
              Разместите код на своём сайте — посетители увидят ваш рейтинг МассоПРО и смогут перейти в каталог
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <Icon name="Link" size={15} style={{ color: '#16a34a' }} />
          <span className="text-xs font-mono text-wrap break-all" style={{ color: '#15803d' }}>{catalogUrl}</span>
        </div>
      </div>

      {/* Светлый виджет */}
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg border flex items-center justify-center" style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}>
            <Icon name="Sun" size={14} style={{ color: '#374151' }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>Светлая тема</h4>
        </div>

        <div className="mb-5 flex justify-center p-4 sm:p-6 rounded-xl" style={{ background: '#f3f4f6' }}>
          <WidgetPreviewLight salonName={salonName} rating={rating} city={city} />
        </div>

        <CodeBlock code={lightCode} onCopy={() => copy(lightCode, setCopiedLight)} copied={copiedLight} />
        <button
          onClick={() => copy(lightCode, setCopiedLight)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: copiedLight ? '#22c55e' : '#0da2e7',
            color: '#ffffff',
          }}
        >
          <Icon name={copiedLight ? 'Check' : 'Copy'} size={15} />
          {copiedLight ? 'Код скопирован!' : 'Скопировать код'}
        </button>
      </div>

      {/* Тёмный виджет */}
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#111827' }}>
            <Icon name="Moon" size={14} style={{ color: '#e5e7eb' }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>Тёмная тема</h4>
        </div>

        <div className="mb-5 flex justify-center p-4 sm:p-6 rounded-xl" style={{ background: '#111827' }}>
          <WidgetPreviewDark salonName={salonName} rating={rating} city={city} />
        </div>

        <CodeBlock code={darkCode} onCopy={() => copy(darkCode, setCopiedDark)} copied={copiedDark} />
        <button
          onClick={() => copy(darkCode, setCopiedDark)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: copiedDark ? '#22c55e' : '#0da2e7',
            color: '#ffffff',
          }}
        >
          <Icon name={copiedDark ? 'Check' : 'Copy'} size={15} />
          {copiedDark ? 'Код скопирован!' : 'Скопировать код'}
        </button>
      </div>

      <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div className="flex items-start gap-2">
          <Icon name="Info" size={15} style={{ color: '#d97706' }} className="mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
            Вставьте один из кодов в HTML вашего сайта — туда, где хотите разместить виджет. При клике пользователь попадёт на вашу карточку в каталоге МассоПРО. Рейтинг в коде обновляется при перегенерации — нажмите «Копировать» снова после обновления рейтинга.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalonWidgets;