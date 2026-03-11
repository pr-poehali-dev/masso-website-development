import Icon from "@/components/ui/icon";
import { CTAButton, NAV_ITEMS, Page } from "@/components/ui/shared";

interface NavbarProps {
  currentPage: Page;
  mobileOpen: boolean;
  scrolled: boolean;
  onNavigate: (p: Page) => void;
  onToggleMobile: () => void;
}

export function Navbar({ currentPage, mobileOpen, scrolled, onNavigate, onToggleMobile }: NavbarProps) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20" : "bg-transparent"}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="Waves" size={16} style={{ color: "hsl(220, 30%, 6%)" }} />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Masso<span className="gradient-text">PRO</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link font-body text-sm transition-colors ${currentPage === item.id ? "text-primary active" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block">
            <CTAButton onClick={() => onNavigate("contacts")}>Консультация</CTAButton>
          </div>

          <button
            className="lg:hidden text-foreground p-2"
            onClick={onToggleMobile}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border py-4">
          <div className="container mx-auto px-6 space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-colors ${currentPage === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3">
              <CTAButton onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

interface FooterProps {
  onNavigate: (p: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-border py-12 gradient-section">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Icon name="Waves" size={14} style={{ color: "hsl(220, 30%, 6%)" }} />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Masso<span className="gradient-text">PRO</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-body max-w-xs leading-relaxed">
              Профессиональный стандарт массажа для салонов и студий по всей России
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="text-muted-foreground hover:text-primary font-body text-xs transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground text-xs font-body">
          © 2026 MassoPRO. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
