import { ACCENT, ACCENT_GLOW, ACCENT_BORDER, cardStyle, FadeIn } from "./auditUtils";

export function AuditDeliverables() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Что вы получите
          </h2>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
          {[
            "Где именно теряются деньги в вашем салоне",
            "Сколько рублей уходит с каждого клиента",
            "Оценку работы персонала по реальным критериям",
            "Потенциал роста выручки в цифрах",
            "Конкретные действия — что сделать уже сегодня",
          ].map((r, i) => (
            <FadeIn key={i} delay={i * 70}>
              <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 18, padding: "18px 22px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: ACCENT, flexShrink: 0, fontSize: 15 }}>
                  {i + 1}
                </div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{r}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AuditProcess() {
  return (
    <section className="gradient-section" style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 48, textAlign: "center" }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Как проходит аудит
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24 }}>
          {[
            "Анализ работы с клиентом",
            "Оценка действий персонала",
            "Выявление ошибок",
            "Перевод в деньги",
            "Рекомендации",
          ].map((text, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontWeight: 800, color: ACCENT, fontSize: 20 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                  Шаг {i + 1}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: "hsl(210, 40%, 80%)" }}>{text}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AuditSpeed() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
              <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Результат уже в течение 1 часа
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              {[
                "Без теории",
                "Без долгого внедрения",
                "Сразу цифры и понимание",
              ].map((text, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div style={{ ...cardStyle, textAlign: "center", padding: "24px 16px" }}>
                    <div style={{ width: 36, height: 2, background: ACCENT, borderRadius: 2, margin: "0 auto 16px" }} />
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{text}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function AuditBeforeAfter() {
  return (
    <section className="gradient-section" style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 48, textAlign: "center" }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Пример результата
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, maxWidth: 760, margin: "0 auto", alignItems: "center" }}>
          <FadeIn delay={100}>
            <div style={{ background: "hsl(0, 20%, 9%)", border: "1px solid hsl(0, 30%, 20%)", borderRadius: 20, padding: "36px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "hsl(0, 40%, 55%)", marginBottom: 16 }}>До аудита</div>
              <div className="font-display" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#f87171", lineHeight: 1 }}>2 000 ₽</div>
              <div style={{ marginTop: 12, fontSize: 14, color: "hsl(215, 20%, 50%)" }}>средний чек</div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div style={{ fontSize: 28, fontWeight: 300, color: "hsl(215, 20%, 40%)", textAlign: "center", padding: "0 8px" }}>→</div>
          </FadeIn>
          <FadeIn delay={300}>
            <div style={{ ...cardStyle, textAlign: "center", border: `1px solid ${ACCENT_BORDER}`, padding: "36px 28px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>После аудита</div>
              <div className="font-display gradient-text" style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, lineHeight: 1 }}>6 000 – 8 000 ₽</div>
              <div style={{ marginTop: 12, fontSize: 14, color: "hsl(215, 20%, 50%)" }}>потенциал чека</div>
              <div style={{ marginTop: 14, background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 30, padding: "6px 16px", display: "inline-block", fontWeight: 700, color: ACCENT, fontSize: 13 }}>
                Рост +200–300%
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
