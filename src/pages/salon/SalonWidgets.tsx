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

const CERT_ICON = 'https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/ce846262-abc8-40a6-a7bd-4f3c029ee2df.jpg';
const LOGO_DARK = 'https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/59ee2a21-9d72-4798-89a9-280f70bcac0b.png';
const LOGO_LIGHT = 'https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/59ee2a21-9d72-4798-89a9-280f70bcac0b.png';

function WidgetPreviewLight({ salonName, rating, city }: { salonName: string; rating: number; city: string }) {
  const filled = Math.floor(rating);
  const half = rating - filled >= 0.25;
  return (
    <div
      className="flex flex-col w-full max-w-[300px]"
      style={{
        background: 'linear-gradient(160deg, #f8fafc 0%, #f0f7ff 100%)',
        border: '1px solid #e2eaf5',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(13,162,231,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(13,162,231,0.2)' }}>
            <img src={LOGO_DARK} alt="МассоПРО" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{salonName}</p>
            {city && <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>{city}</p>}
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, #e2eaf5, transparent)' }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ fontSize: 15, color: (i < filled || (i === filled && half)) ? '#f59e0b' : '#e2e8f0' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginLeft: 2 }}>{rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>/5</span>
          </div>
        </div>
        <div className="flex items-center gap-2" style={{ background: 'rgba(13,162,231,0.06)', borderRadius: 10, padding: '6px 10px' }}>
          <img src={CERT_ICON} alt="cert" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0da2e7', letterSpacing: '0.01em' }}>Сертифицировано МассоПРО</span>
        </div>
      </div>
    </div>
  );
}

function WidgetPreviewDark({ salonName, rating, city }: { salonName: string; rating: number; city: string }) {
  const filled = Math.floor(rating);
  const half = rating - filled >= 0.25;
  return (
    <div
      className="flex flex-col w-full max-w-[300px]"
      style={{
        background: 'linear-gradient(160deg, #0d1520 0%, #0a1018 100%)',
        border: '1px solid rgba(13,210,231,0.18)',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(13,210,231,0.06)',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 12px rgba(13,210,231,0.25)' }}>
            <img src={LOGO_LIGHT} alt="МассоПРО" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{salonName}</p>
            {city && <p style={{ margin: 0, fontSize: 11, color: '#0dd2e7', marginTop: 1, opacity: 0.8 }}>{city}</p>}
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(13,210,231,0.2), transparent)' }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ fontSize: 15, color: (i < filled || (i === filled && half)) ? '#f59e0b' : 'rgba(13,210,231,0.15)' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginLeft: 2 }}>{rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: 'rgba(13,210,231,0.5)' }}>/5</span>
          </div>
        </div>
        <div className="flex items-center gap-2" style={{ background: 'rgba(13,210,231,0.07)', border: '1px solid rgba(13,210,231,0.12)', borderRadius: 10, padding: '6px 10px' }}>
          <img src={CERT_ICON} alt="cert" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0dd2e7', letterSpacing: '0.01em' }}>Сертифицировано МассоПРО</span>
        </div>
      </div>
    </div>
  );
}

function generateLightCode(salonId: number, salonName: string, rating: number, city: string, url: string) {
  return `<!-- Виджет МассоПРО (светлая тема) -->
<a href="${url}/catalog/${salonId}" target="_blank" rel="noopener"
   style="display:inline-flex;flex-direction:column;text-decoration:none;
          font-family:system-ui,sans-serif;max-width:300px;width:100%;
          background:linear-gradient(160deg,#f8fafc 0%,#f0f7ff 100%);
          border:1px solid #e2eaf5;border-radius:20px;
          box-shadow:0 8px 32px rgba(13,162,231,0.10),0 1px 4px rgba(0,0,0,0.06);
          overflow:hidden;">
  <div style="display:flex;flex-direction:column;gap:12px;padding:16px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/59ee2a21-9d72-4798-89a9-280f70bcac0b.png"
           alt="МассоПРО" style="width:44px;height:44px;border-radius:14px;object-fit:cover;flex-shrink:0;box-shadow:0 2px 8px rgba(13,162,231,0.2);">
      <div style="min-width:0;flex:1;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#0f172a;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${salonName}</p>
        ${city ? `<p style="margin:2px 0 0;font-size:11px;color:#64748b;">${city}</p>` : ''}
      </div>
    </div>
    <div style="height:1px;background:linear-gradient(90deg,#e2eaf5,transparent);"></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="font-size:15px;letter-spacing:1px;color:#f59e0b;">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</span>
      <span style="font-size:15px;font-weight:800;color:#0f172a;">${rating.toFixed(1)}</span>
      <span style="font-size:11px;color:#94a3b8;">/5</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;background:rgba(13,162,231,0.06);border-radius:10px;padding:6px 10px;">
      <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/ce846262-abc8-40a6-a7bd-4f3c029ee2df.jpg"
           alt="cert" style="width:18px;height:18px;border-radius:4px;object-fit:cover;flex-shrink:0;">
      <span style="font-size:11px;font-weight:600;color:#0da2e7;letter-spacing:0.01em;">Сертифицировано МассоПРО</span>
    </div>
  </div>
</a>`;
}

function generateDarkCode(salonId: number, salonName: string, rating: number, city: string, url: string) {
  return `<!-- Виджет МассоПРО (тёмная тема) -->
<a href="${url}/catalog/${salonId}" target="_blank" rel="noopener"
   style="display:inline-flex;flex-direction:column;text-decoration:none;
          font-family:system-ui,sans-serif;max-width:300px;width:100%;
          background:linear-gradient(160deg,#0d1520 0%,#0a1018 100%);
          border:1px solid rgba(13,210,231,0.18);border-radius:20px;
          box-shadow:0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(13,210,231,0.06);
          overflow:hidden;">
  <div style="display:flex;flex-direction:column;gap:12px;padding:16px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/59ee2a21-9d72-4798-89a9-280f70bcac0b.png"
           alt="МассоПРО" style="width:44px;height:44px;border-radius:14px;object-fit:cover;flex-shrink:0;box-shadow:0 2px 12px rgba(13,210,231,0.25);">
      <div style="min-width:0;flex:1;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#f8fafc;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${salonName}</p>
        ${city ? `<p style="margin:2px 0 0;font-size:11px;color:#0dd2e7;opacity:0.8;">${city}</p>` : ''}
      </div>
    </div>
    <div style="height:1px;background:linear-gradient(90deg,rgba(13,210,231,0.2),transparent);"></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="font-size:15px;letter-spacing:1px;color:#f59e0b;">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</span>
      <span style="font-size:15px;font-weight:800;color:#f8fafc;">${rating.toFixed(1)}</span>
      <span style="font-size:11px;color:rgba(13,210,231,0.5);">/5</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;background:rgba(13,210,231,0.07);border:1px solid rgba(13,210,231,0.12);border-radius:10px;padding:6px 10px;">
      <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/ce846262-abc8-40a6-a7bd-4f3c029ee2df.jpg"
           alt="cert" style="width:18px;height:18px;border-radius:4px;object-fit:cover;flex-shrink:0;">
      <span style="font-size:11px;font-weight:600;color:#0dd2e7;letter-spacing:0.01em;">Сертифицировано МассоПРО</span>
    </div>
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