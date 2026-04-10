import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { NAV_ITEMS } from "@/components/ui/shared";

const PAGE_URLS: Record<string, string> = {
  home: "/",
  how: "/#how",
  salons: "/#salons",
  catalog: "/#catalog",
  about: "/#about",
  audit: "/audit",
  contacts: "/kontakty",
  privacy: "/privacy",
  offer: "/offer",
};

function SimpleNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20" : "bg-background/95 backdrop-blur-xl border-b border-border"}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="Waves" size={16} style={{ color: "hsl(220, 30%, 6%)" }} />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Массо<span className="gradient-text">ПРО</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={PAGE_URLS[item.id] || "/"}
                className="nav-link font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/cabinet/login"
              className="inline-flex items-center gap-1.5 font-body font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon name="User" size={16} />
              Кабинет
            </a>
            <a
              href="/#cta-form"
              className="inline-flex items-center h-9 px-4 rounded-xl text-sm font-semibold gradient-bg hover:opacity-90 transition-opacity"
              style={{ color: "hsl(220, 30%, 6%)" }}
            >
              Консультация
            </a>
          </div>

          <button className="lg:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border py-4">
          <div className="container mx-auto px-4 sm:px-6 space-y-1">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={PAGE_URLS[item.id] || "/"}
                className="block w-full text-left px-4 py-3 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/cabinet/login"
              className="block w-full text-left px-4 py-3 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Личный кабинет
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function SimpleFooter() {
  return (
    <footer className="border-t border-border py-12 gradient-section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Icon name="Waves" size={14} style={{ color: "hsl(220, 30%, 6%)" }} />
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
                href={PAGE_URLS[item.id] || "/"}
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

export default function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleNavbar />
      <div className="flex-1 pt-16 md:pt-20">
        {children}
      </div>
      <SimpleFooter />
    </div>
  );
}