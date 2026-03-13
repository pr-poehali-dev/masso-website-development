import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, ACCENT_SHADOW_HOVER, FadeIn } from "./partneryUtils";

export default function PartnerHero() {
  return (
    <section style={{ paddingTop: 144, paddingBottom: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <FadeIn>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
                Партнёрская программа
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 28, letterSpacing: "-0.5px" }}>
                Рекомендуйте —<br />
                <span style={{ color: ACCENT }}>зарабатывайте</span>
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: "#3a3a3a", marginBottom: 16 }}>
                Рекомендуйте платформу <strong>Dok Диалог</strong> владельцам салонов и студий массажа — и получайте <strong>10% с каждой оплаты</strong> ежемесячно.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#5a5a5a", marginBottom: 40 }}>
                Салон вводит ваш уникальный промокод, получает скидку на обучение мастеров — и становится вашим источником постоянного пассивного дохода.
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  href="#forma"
                  style={{
                    display: "inline-block", background: ACCENT, color: "#fff",
                    padding: "16px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
                    textDecoration: "none", transition: "all 0.25s ease",
                    boxShadow: `0 4px 20px ${ACCENT_SHADOW}`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = ACCENT_DARK;
                    el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = ACCENT;
                    el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`;
                    el.style.transform = "translateY(0)";
                  }}
                >
                  Стать партнёром
                </a>
                <a
                  href="#kabinet"
                  style={{
                    display: "inline-block", background: "transparent", color: "#1a1a1a",
                    padding: "16px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600,
                    textDecoration: "none", transition: "all 0.25s ease",
                    border: "2px solid #d0d0d0",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = ACCENT;
                    el.style.color = ACCENT;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "#d0d0d0";
                    el.style.color = "#1a1a1a";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  Войти в кабинет →
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Stats */}
          <FadeIn delay={200}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { value: "10%", label: "комиссии с каждой оплаты" },
                { value: "∞", label: "без лимита на количество салонов" },
                { value: "30", label: "дней до первой выплаты" },
                { value: "0 ₽", label: "вступительного взноса" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: i === 0 ? ACCENT : "#fff",
                  borderRadius: 20,
                  padding: "32px 24px",
                  boxShadow: i === 0 ? `0 16px 48px ${ACCENT_SHADOW}` : "0 4px 24px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 44, fontWeight: 700, color: i === 0 ? "#fff" : ACCENT, lineHeight: 1, marginBottom: 8 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 13, color: i === 0 ? "rgba(255,255,255,0.8)" : "#6a6a6a", lineHeight: 1.45 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}