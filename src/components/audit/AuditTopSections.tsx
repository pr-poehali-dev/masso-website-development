import { ACCENT, ACCENT_GLOW, ACCENT_BORDER, cardStyle, FadeIn } from "./auditUtils";

export function AuditHero() {
  return (
    <section className="gradient-section" style={{ padding: "88px 0 80px" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 40, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: ACCENT, fontSize: 10 }}>◆</span>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT }}>Аудит массажного салона</span>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 5.5vw, 58px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 22, maxWidth: 760 }}>
            Сколько денег вы теряете<br />
            <span className="gradient-text">на каждом клиенте</span> — не замечая этого?
          </h1>
        </FadeIn>
        <FadeIn delay={160}>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "hsl(215, 20%, 60%)", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
            Покажем за 1 час скрытые потери в массажных услугах и точки роста выручки
          </p>
        </FadeIn>
        <FadeIn delay={240}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40, maxWidth: 380 }}>
            {[
              "Анализ всей цепочки клиента",
              "Выявление потерь в рублях",
              "Конкретные решения",
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "hsl(210, 40%, 85%)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, display: "inline-block", flexShrink: 0 }} />
                {b}
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={320}>
          <a
            href="#audit-form"
            className="gradient-bg hover:opacity-90 transition-opacity"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 50, fontWeight: 700, fontSize: 17, textDecoration: "none", color: "hsl(220, 30%, 6%)" }}
          >
            Узнать потери
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

export function AuditPainSection() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 40, maxWidth: 600 }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Вы теряете деньги,<br />даже если клиенты приходят
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            "Администратор не доводит до записи",
            "Мастера не выявляют потребности",
            "Никто не предлагает дополнительные услуги",
            "Клиент уходит и не возвращается",
          ].map((text, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16, height: "100%" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(0, 60%, 50%)", flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{text}</span>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <div style={{ background: "hsla(40,70%,30%,0.10)", border: "1.5px solid hsla(40,70%,45%,0.28)", borderRadius: 14, padding: "18px 24px", fontWeight: 700, color: "hsl(40, 80%, 70%)", fontSize: 15 }}>
            Потери происходят каждый день, но остаются незаметными
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function AuditLossScale() {
  return (
    <section className="gradient-section" style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 14, textAlign: "center" }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Сколько это в деньгах
          </h2>
          <p style={{ color: "hsl(215, 20%, 55%)", textAlign: "center", marginBottom: 48, fontSize: 16 }}>
            Если терять 3 000 ₽ с одного клиента и в день проходит 10 человек:
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 680, margin: "0 auto 48px" }}>
          <FadeIn delay={100}>
            <div style={{ ...cardStyle, textAlign: "center", padding: "40px 28px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "hsl(215, 20%, 50%)", marginBottom: 14 }}>потери в день</div>
              <div className="font-display gradient-text" style={{ fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 700, lineHeight: 1 }}>30 000 ₽</div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div style={{ background: "hsl(0, 25%, 10%)", border: "1px solid hsl(0, 35%, 22%)", borderRadius: 20, padding: "40px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "hsl(0, 40%, 55%)", marginBottom: 14 }}>потери в месяц</div>
              <div className="font-display" style={{ fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 700, lineHeight: 1, color: "#f87171" }}>900 000 ₽</div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={300}>
          <div style={{ textAlign: "center" }}>
            <a
              href="#audit-form"
              className="gradient-bg hover:opacity-90 transition-opacity"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", borderRadius: 50, fontWeight: 700, fontSize: 16, textDecoration: "none", color: "hsl(220, 30%, 6%)" }}
            >
              Проверить мой салон
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
