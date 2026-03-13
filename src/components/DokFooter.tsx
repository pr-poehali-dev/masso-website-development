const ACCENT = "hsl(185, 85%, 32%)";

export default function DokFooter() {
  return (
    <footer style={{
      background: "#1a1a1a",
      color: "#fff",
      fontFamily: "Montserrat, sans-serif",
      padding: "40px 24px",
    }}>
      <style>{`
        .dok-footer-inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }
        .dok-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 28px;
          align-items: center;
        }
        .dok-footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .dok-footer-inner {
            flex-direction: column;
            gap: 20px;
          }
          .dok-footer-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .dok-footer-copy {
            white-space: normal;
          }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="dok-footer-inner">

          {/* Brand + requisites */}
          <div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Dok <span style={{ color: ACCENT }}>Диалог</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              ИП Водопьянов С.Г.<br />
              ОГРНИП: 321508100047334
            </div>
          </div>

          {/* Links */}
          <div className="dok-footer-links">
            {[
              { label: "Политика конфиденциальности", href: "/privacy" },
              { label: "Условия оферты", href: "/offer" },
              { label: "Контакты", href: "/kontakty" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="dok-footer-copy">
            © {new Date().getFullYear()} Dok Диалог
          </div>

        </div>
      </div>
    </footer>
  );
}
