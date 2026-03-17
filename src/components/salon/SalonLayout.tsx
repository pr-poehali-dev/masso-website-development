import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getSalonUser, getSalonInfo, logoutSalon } from '@/lib/salon-api';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { label: 'Главная', icon: 'LayoutDashboard', path: '/cabinet' },
  { label: 'Аналитика', icon: 'BarChart3', path: '/cabinet/analytics' },
  { label: 'Инструменты', icon: 'Calculator', path: '/cabinet/tools' },
  { label: 'Специалисты', icon: 'Users', path: '/cabinet/specialists' },
  { label: 'Обучение', icon: 'GraduationCap', path: '/cabinet/training' },
  { label: 'База знаний', icon: 'BookOpen', path: '/cabinet/knowledge' },
  { label: 'Рейтинг', icon: 'Star', path: '/cabinet/rating' },
  { label: 'Профиль', icon: 'Building2', path: '/cabinet/profile' },
];

const pageNames: Record<string, string> = {
  '/cabinet': 'Главная',
  '/cabinet/analytics': 'Аналитика',
  '/cabinet/tools': 'Инструменты',
  '/cabinet/specialists': 'Специалисты',
  '/cabinet/training': 'Обучение',
  '/cabinet/knowledge': 'База знаний',
  '/cabinet/rating': 'Рейтинг',
  '/cabinet/profile': 'Профиль',
};

const SidebarContent = ({ salonName, userName, onLogout }: { salonName: string; userName: string; onLogout: () => void }) => (
  <div className="flex flex-col h-full" style={{ background: '#ffffff' }}>
    <div className="p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
      <h1 className="text-xl font-bold font-sans" style={{ color: '#000000' }}>МассоПро</h1>
      <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Личный кабинет</p>
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

const SalonLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const u = getSalonUser();
    const s = getSalonInfo();
    if (!u || !s) {
      navigate('/cabinet/login');
      return;
    }
    setUserName(u.name || u.email);
    setSalonName(s.name);
  }, [navigate]);

  const handleLogout = () => {
    logoutSalon();
    navigate('/cabinet/login');
  };

  const currentPage = pageNames[location.pathname] || 'Кабинет';

  if (!userName) return null;

  return (
    <div className="flex min-h-screen font-sans" style={{ background: '#f8f9fa' }}>
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[250px] lg:flex-shrink-0 border-r fixed inset-y-0 left-0 z-30"
        style={{ borderColor: '#e5e7eb', background: '#ffffff' }}
      >
        <SidebarContent salonName={salonName} userName={userName} onLogout={handleLogout} />
      </aside>

      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 border-b"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Icon name="Menu" size={20} style={{ color: '#374151' }} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]" style={{ background: '#ffffff' }}>
            <SheetTitle className="sr-only">Навигация</SheetTitle>
            <div onClick={() => setMobileOpen(false)}>
              <SidebarContent salonName={salonName} userName={userName} onLogout={handleLogout} />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="ml-3 text-lg font-bold font-sans" style={{ color: '#000000' }}>МассоПро</h1>
      </div>

      <main className="flex-1 lg:ml-[250px] pt-14 lg:pt-0">
        <div
          className="hidden lg:flex items-center h-14 px-6 border-b"
          style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
        >
          <h2 className="text-lg font-semibold font-sans" style={{ color: '#111827' }}>{currentPage}</h2>
        </div>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SalonLayout;
