import { useState, useEffect } from "react";

const ACCENT = "hsl(185, 85%, 32%)";

const NAV_LINKS = [
  { label: "Платформа", href: "/doc-dialog" },
  { label: "Тарифы", href: "/tarify" },
  { label: "Партнёрская программа", href: "/partnery" },
  { label: "Блог", href: "https://school.brossok.ru/blog", external: true },
  { label: "Контакты", href: "/kontakty" },
];

export default function DokNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: scrolled ? "rgba(248,248,246,0.95)" : "rgba(248,248,246,0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
      boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none",
      transition: "all 0.3s ease",
      fontFamily: "Montserrat, sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>
              Dok <span style={{ color: ACCENT }}>Диалог</span>
            </span>
          </a>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="dok-nav-desktop">
            {NAV_LINKS.map((link) => {
              const isActive = current === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? ACCENT : "#3a3a3a",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    borderBottom: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = ACCENT; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#3a3a3a"; }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Cabinet button */}
          <a
            href="https://school.brossok.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="dok-nav-cabinet"
            style={{
              fontSize: 14, fontWeight: 600, color: "#fff",
              background: ACCENT, textDecoration: "none",
              padding: "8px 18px", borderRadius: 10,
              transition: "all 0.2s ease",
              whiteSpace: "nowrap" as const,
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "hsl(185, 85%, 26%)"; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
          >
            Личный кабинет
          </a>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "8px", display: "none", flexDirection: "column",
              gap: 5, alignItems: "center", justifyContent: "center",
            }}
            className="dok-nav-burger"
            aria-label="Меню"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#1a1a1a", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#1a1a1a", transition: "all 0.2s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#1a1a1a", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: "rgba(248,248,246,0.98)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: "16px 24px 24px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.map((link) => {
              const isActive = current === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 15,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? ACCENT : "#1a1a1a",
                    textDecoration: "none",
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: isActive ? `hsla(185, 85%, 32%, 0.08)` : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dok-nav-desktop { display: none !important; }
          .dok-nav-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}