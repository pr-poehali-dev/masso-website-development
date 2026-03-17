import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getAdminUser, logoutAdmin } from '@/lib/admin-api';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Дашборд', icon: 'LayoutDashboard', path: '/admin' },
  { label: 'Салоны', icon: 'Building2', path: '/admin/salons' },
  { label: 'Специалисты', icon: 'Users', path: '/admin/specialists' },
  { label: 'Доступы', icon: 'KeyRound', path: '/admin/access' },
  { label: 'Аналитика', icon: 'BarChart3', path: '/admin/analytics' },
  { label: 'Инструменты', icon: 'Wrench', path: '/admin/tools' },
  { label: 'Контент', icon: 'FileText', path: '/admin/content' },
  { label: 'Каталог', icon: 'BookOpen', path: '/admin/catalog' },
  { label: 'Заявки', icon: 'Inbox', path: '/admin/leads' },
  { label: 'Настройки', icon: 'Settings', path: '/admin/settings' },
];

const pageNames: Record<string, string> = {
  '/admin': 'Дашборд',
  '/admin/salons': 'Салоны',
  '/admin/specialists': 'Специалисты',
  '/admin/access': 'Доступы',
  '/admin/analytics': 'Аналитика',
  '/admin/tools': 'Инструменты',
  '/admin/content': 'Контент',
  '/admin/catalog': 'Каталог',
  '/admin/leads': 'Заявки',
  '/admin/settings': 'Настройки',
};

const SidebarContent = ({
  user,
  onLogout,
}: {
  user: { name: string; role: string } | null;
  onLogout: () => void;
}) => (
  <div className="flex flex-col h-full" style={{ background: '#ffffff' }}>
    <div className="p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
      <h1 className="text-xl font-bold font-sans" style={{ color: '#000000' }}>
        МассоПро
      </h1>
      <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
        Админ-панель
      </p>
    </div>

    <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/admin'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'hover:bg-gray-50'
            }`
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

    <div
      className="p-4 border-t"
      style={{ borderColor: '#e5e7eb' }}
    >
      {user && (
        <div className="mb-3">
          <p
            className="text-sm font-medium truncate"
            style={{ color: '#111827' }}
          >
            {user.name}
          </p>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            {user.role === 'admin' ? 'Администратор' : 'Менеджер'}
          </p>
        </div>
      )}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition-colors hover:bg-red-50"
        style={{ color: '#ef4444' }}
      >
        <Icon name="LogOut" size={16} />
        <span>Выйти</span>
      </button>
    </div>
  </div>
);

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const u = getAdminUser();
    if (!u) {
      navigate('/admin/login');
      return;
    }
    setUser(u);
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const currentPage =
    pageNames[location.pathname] ||
    (location.pathname.startsWith('/admin/salons/') ? 'Салон' : 'Админ-панель');

  const breadcrumbs: { label: string; path?: string }[] = [{ label: 'Главная', path: '/admin' }];
  if (location.pathname !== '/admin') {
    if (location.pathname.startsWith('/admin/salons/') && location.pathname !== '/admin/salons') {
      breadcrumbs.push({ label: 'Салоны', path: '/admin/salons' });
      breadcrumbs.push({ label: 'Детали салона' });
    } else {
      breadcrumbs.push({ label: currentPage });
    }
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen font-sans" style={{ background: '#f8f9fa' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[250px] lg:flex-shrink-0 border-r fixed inset-y-0 left-0 z-30"
        style={{ borderColor: '#e5e7eb', background: '#ffffff' }}
      >
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile Header */}
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
          <SheetContent
            side="left"
            className="p-0 w-[280px]"
            style={{ background: '#ffffff' }}
          >
            <SheetTitle className="sr-only">Навигация</SheetTitle>
            <div onClick={() => setMobileOpen(false)}>
              <SidebarContent user={user} onLogout={handleLogout} />
            </div>
          </SheetContent>
        </Sheet>
        <h1
          className="ml-3 text-lg font-bold font-sans"
          style={{ color: '#000000' }}
        >
          МассоПро
        </h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[250px] pt-14 lg:pt-0">
        {/* Top bar */}
        <div
          className="hidden lg:flex items-center justify-between h-14 px-6 border-b"
          style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
        >
          <div>
            <h2
              className="text-lg font-semibold font-sans"
              style={{ color: '#111827' }}
            >
              {currentPage}
            </h2>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#9ca3af' }}>
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span>/</span>}
                  {crumb.path ? (
                    <NavLink
                      to={crumb.path}
                      className="hover:underline"
                      style={{ color: '#0da2e7' }}
                    >
                      {crumb.label}
                    </NavLink>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#6b7280' }}>
              {user.name}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: '#0da2e7' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
