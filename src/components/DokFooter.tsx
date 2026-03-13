const ACCENT = "hsl(185, 85%, 32%)";

export default function DokFooter() {
  return (
    <footer style={{
      background: "#1a1a1a",
      color: "#fff",
      fontFamily: "Montserrat, sans-serif",
      padding: "48px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}>

          {/* Brand + requisites */}
          <div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Док <span style={{ color: ACCENT }}>Диалог</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              ИП Водопьянов С.Г.<br />
              ОГРНИП: 321508100047334
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", alignItems: "center" }}>
            {[
              { label: "Политика конфиденциальности", href: "/privacy" },
              { label: "Условия оферты", href: "/offer" },
              { label: "Контакты", href: "/kontakty" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Док Диалог
          </div>

        </div>
      </div>
    </footer>
  );
}