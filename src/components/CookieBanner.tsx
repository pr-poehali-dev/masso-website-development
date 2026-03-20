import { useState, useEffect } from 'react';

const COOKIE_KEY = 'cookie_accepted';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-4 rounded-xl px-5 py-4 shadow-lg flex-wrap"
      style={{ background: '#111827', color: '#f9fafb', maxWidth: 640, margin: '0 auto' }}
    >
      <p className="text-sm flex-1" style={{ color: '#d1d5db' }}>
        Мы используем файлы cookie для улучшения работы сайта. Продолжая использование, вы соглашаетесь с нашей{' '}
        <a href="/privacy" className="underline" style={{ color: '#0da2e7' }}>политикой конфиденциальности</a>.
      </p>
      <button
        onClick={accept}
        className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: '#0da2e7', color: '#ffffff' }}
      >
        Принять
      </button>
    </div>
  );
};

export default CookieBanner;
