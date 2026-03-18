import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getSalonUser, getSalonInfo, logoutSalon } from '@/lib/salon-api';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { NAV_ITEMS } from '@/components/ui/shared';

const FREE_NAV_ITEMS = [
  { label: 'Главная', icon: 'LayoutDashboard', path: '/cabinet' },
  { label: 'Инструменты', icon: 'Calculator', path: '/cabinet/tools' },
];

const FULL_NAV_ITEMS = [
  { label: 'Главная', icon: 'LayoutDashboard', path: '/cabinet' },
  { label: 'Аналитика', icon: 'BarChart3', path: '/cabinet/analytics' },
  { label: 'Инструменты', icon: 'Calculator', path: '/cabinet/tools' },
  { label: 'Специалисты', icon: 'Users', path: '/cabinet/specialists' },
  { label: 'Обучение', icon: 'GraduationCap', path: '/cabinet/training' },
  { label: 'База знаний', icon: 'BookOpen', path: '/cabinet/knowledge' },
  { label: 'Рейтинг', icon: 'Star', path: '/cabinet/rating' },
  { label: 'Виджеты', icon: 'Code2', path: '/cabinet/widgets' },
  { label: 'Профиль', icon: 'Building2', path: '/cabinet/profile' },
];

const UPGRADE_BENEFITS = [
  'Аналитика продаж и оборота',
  'Управление специалистами',
  'Доступ к обучению Док Диалог',
  'База знаний и материалы',
  'Рейтинг и сертификация',
  'Профиль и тарифы',
];

function UpgradeBanner() {
  return (
    <div className="mx-4 mb-4 rounded-xl p-4 border" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', borderColor: '#bfdbfe' }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon name="Sparkles" size={16} style={{ color: '#0da2e7' }} />
        <p className="text-sm font-semibold" style={{ color: '#111827' }}>Полный доступ</p>
      </div>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: '#4b5563' }}>
        Заключите договор на услуги и откройте все возможности платформы:
      </p>
      <ul className="space-y-1 mb-3">
        {UPGRADE_BENEFITS.map((b) => (
          <li key={b} className="flex items-center gap-1.5 text-xs" style={{ color: '#374151' }}>
            <Icon name="Check" size={12} style={{ color: '#22c55e' }} />
            {b}
          </li>
        ))}
      </ul>
      <a
        href="/tarify"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: '#0da2e7' }}
      >
        <Icon name="FileText" size={13} />
        Узнать о тарифах
      </a>
    </div>
  );
}

const pageNames: Record<string, string> = {
  '/cabinet': 'Главная',
  '/cabinet/analytics': 'Аналитика',
  '/cabinet/tools': 'Инструменты',
  '/cabinet/specialists': 'Специалисты',
  '/cabinet/training': 'Обучение',
  '/cabinet/knowledge': 'База знаний',
  '/cabinet/rating': 'Рейтинг',
  '/cabinet/widgets': 'Виджеты для сайта',
  '/cabinet/profile': 'Профиль',
};

const PAGE_URLS: Record<string, string> = {
  home: '/',
  how: '/#how',
  salons: '/#salons',
  catalog: '/#catalog',
  about: '/#about',
  contacts: '/kontakty',
  privacy: '/privacy',
  offer: '/offer',
};

function CabinetNavbar({ salonName, userName, onLogout }: { salonName: string; userName: string; onLogout: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20' : 'bg-background/95 backdrop-blur-xl border-b border-border'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="Waves" size={16} style={{ color: 'hsl(220, 30%, 6%)' }} />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Массо<span className="gradient-text">ПРО</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={PAGE_URLS[item.id] || '/'}
                className="nav-link font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#0da2e7' }}>
                {salonName.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-medium leading-tight" style={{ color: '#111827' }}>{salonName}</p>
                <p className="text-xs leading-tight" style={{ color: '#9ca3af' }}>{userName}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50"
              style={{ color: '#ef4444' }}
            >
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </div>

          <button className="lg:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border py-4">
          <div className="container mx-auto px-4 sm:px-6 space-y-1">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={PAGE_URLS[item.id] || '/'}
                className="block w-full text-left px-4 py-3 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <div className="px-4 py-2">
                <p className="text-sm font-medium" style={{ color: '#111827' }}>{salonName}</p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>{userName}</p>
              </div>
              <button
                onClick={() => { setMobileOpen(false); onLogout(); }}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm transition-colors hover:bg-red-50"
                style={{ color: '#ef4444' }}
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function CabinetFooter() {
  return (
    <footer className="border-t border-border py-12 gradient-section mt-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Icon name="Waves" size={14} style={{ color: 'hsl(220, 30%, 6%)' }} />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Массо<span className="gradient-text">ПРО</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-body max-w-xs leading-relaxed">
              Профессиональный стандарт массажа для салонов и студий по всей России
            </p>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={PAGE_URLS[item.id] || '/'}
                className="text-muted-foreground hover:text-primary font-body text-xs transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-muted-foreground text-xs font-body">
          <span>© 2026 MassoPRO. Все права защищены.<br className="sm:hidden" /> ИП Водопьянов С.Г. ОГРНИП 321508100047334</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
            <a href="/offer" className="hover:text-primary transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SidebarContent = ({ salonName, userName, onLogout, fullAccess }: { salonName: string; userName: string; onLogout: () => void; fullAccess: boolean }) => {
  const navItems = fullAccess ? FULL_NAV_ITEMS : FREE_NAV_ITEMS;
  return (
  <div className="flex flex-col h-full" style={{ background: '#ffffff' }}>
    <div className="p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
      <p className="text-sm font-semibold" style={{ color: '#111827' }}>Личный кабинет</p>
    </div>
    <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/cabinet'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-white' : 'hover:bg-gray-50'}`
          }
          style={({ isActive }) => ({
            background: isActive ? '#0da2e7' : undefined,
            color: isActive ? '#ffffff' : '#374151',
          })}
        >
          <Icon name={item.icon} size={18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
    {!fullAccess && <UpgradeBanner />}
    <div className="p-4 border-t" style={{ borderColor: '#e5e7eb' }}>
      <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>{salonName}</p>
      <p className="text-xs" style={{ color: '#9ca3af' }}>{userName}</p>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm w-full mt-3 px-3 py-2 rounded-lg transition-colors hover:bg-red-50"
        style={{ color: '#ef4444' }}
      >
        <Icon name="LogOut" size={16} />
        <span>Выйти</span>
      </button>
    </div>
  </div>
  );
};

const SalonLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [fullAccess, setFullAccess] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const syncFromStorage = () => {
    const s = getSalonInfo();
    if (s) setFullAccess(!!s.full_access);
  };

  useEffect(() => {
    const u = getSalonUser();
    const s = getSalonInfo();
    if (!u || !s) {
      navigate('/cabinet/login');
      return;
    }
    setUserName(u.name || u.email);
    setSalonName(s.name);
    setFullAccess(!!s.full_access);

    window.addEventListener('salon-access-updated', syncFromStorage);
    return () => window.removeEventListener('salon-access-updated', syncFromStorage);
  }, [navigate]);

  const handleLogout = () => {
    logoutSalon();
    navigate('/cabinet/login');
  };

  const currentPage = pageNames[location.pathname] || 'Кабинет';

  const ALLOWED_FREE_PATHS = ['/cabinet', '/cabinet/tools'];
  useEffect(() => {
    if (userName && !fullAccess && !ALLOWED_FREE_PATHS.includes(location.pathname)) {
      navigate('/cabinet', { replace: true });
    }
  }, [location.pathname, fullAccess, userName]);

  if (!userName) return null;

  return (
    <div className="min-h-screen font-sans" style={{ background: '#f8f9fa' }}>
      <CabinetNavbar salonName={salonName} userName={userName} onLogout={handleLogout} />

      <div className="flex pt-16">
        <aside
          className="hidden lg:flex lg:flex-col lg:w-[250px] lg:flex-shrink-0 border-r fixed top-16 bottom-0 left-0 z-20"
          style={{ borderColor: '#e5e7eb', background: '#ffffff' }}
        >
          <SidebarContent salonName={salonName} userName={userName} onLogout={handleLogout} fullAccess={fullAccess} />
        </aside>

        <div className="lg:hidden fixed top-16 left-0 right-0 z-20 h-12 flex items-center px-4 border-b" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="Menu" size={20} style={{ color: '#374151' }} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]" style={{ background: '#ffffff' }}>
              <SheetTitle className="sr-only">Навигация</SheetTitle>
              <div onClick={() => setMobileSidebarOpen(false)}>
                <SidebarContent salonName={salonName} userName={userName} onLogout={handleLogout} fullAccess={fullAccess} />
              </div>
            </SheetContent>
          </Sheet>
          <h2 className="ml-3 text-base font-semibold" style={{ color: '#111827' }}>{currentPage}</h2>
        </div>

        <main className="flex-1 lg:ml-[250px] pt-12 lg:pt-0 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="hidden lg:flex items-center h-14 px-6 border-b" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            <h2 className="text-lg font-semibold font-sans" style={{ color: '#111827' }}>{currentPage}</h2>
          </div>
          <div className="flex-1 p-4 lg:p-6">
            <Outlet />
          </div>
          <CabinetFooter />
        </main>
      </div>
    </div>
  );
};

export default SalonLayout;