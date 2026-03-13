import { useState } from "react";
import { ACCENT, STEPS, BENEFITS, CALC_PLANS, FadeIn } from "./partneryUtils";

function Calculator() {
  const [salons, setSalons] = useState(5);
  const [planIdx, setPlanIdx] = useState(1);
  const monthly = Math.round(salons * CALC_PLANS[planIdx].price * 0.1);

  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(24px, 5vw, 48px) clamp(20px, 4vw, 40px)", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 28 }}>
        Посчитайте свой доход
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3a3a3a", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
          Количество привлечённых салонов: <span style={{ color: ACCENT, fontSize: 18 }}>{salons}</span>
        </label>
        <input
          type="range" min={1} max={50} value={salons}
          onChange={e => setSalons(Number(e.target.value))}
          style={{ width: "100%", accentColor: ACCENT, height: 4, cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa", marginTop: 6 }}>
          <span>1 салон</span><span>50 салонов</span>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3a3a3a", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
          Средний тариф салона
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CALC_PLANS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPlanIdx(i)}
              style={{
                flex: 1, minWidth: 80, padding: "10px 6px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
                background: planIdx === i ? ACCENT : "#f0f0ee",
                color: planIdx === i ? "#fff" : "#555",
                border: "none",
              }}
            >
              {p.name}<br />
              <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.85 }}>{p.price.toLocaleString("ru")} ₽</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#f8f8f6", borderRadius: 16, padding: "20px 24px" }}>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Ваша комиссия</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 6vw, 48px)", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
          {monthly.toLocaleString("ru")} ₽
        </div>
        <div style={{ fontSize: 13, color: "#aaa", marginTop: 6 }}>
          {salons} салон{salons === 1 ? "" : salons < 5 ? "а" : "ов"} × {CALC_PLANS[planIdx].price.toLocaleString("ru")} ₽ × 10%
        </div>
      </div>
    </div>
  );
}

export default function PartnerSections() {
  return (
    <>
      <style>{`
        .ps-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .ps-step-card { padding: 28px 24px; }
        .ps-benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }
        .ps-benefit-card { padding: 28px 24px; }
        .ps-calc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .ps-steps-grid { grid-template-columns: 1fr; gap: 12px; }
          .ps-step-card { padding: 24px 20px; }
          .ps-benefits-grid { grid-template-columns: 1fr; gap: 12px; }
          .ps-benefit-card { padding: 24px 20px; }
          .ps-calc-grid { gap: 24px; }
        }
      `}</style>

      {/* How it works */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
                Как это работает
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Четыре простых шага
              </h2>
            </div>
          </FadeIn>

          <div className="ps-steps-grid">
            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="ps-step-card" style={{
                  background: "#fff", borderRadius: 20,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)", height: "100%", boxSizing: "border-box" as const,
                  borderTop: `4px solid ${ACCENT}`,
                }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 40, fontWeight: 700, color: ACCENT, opacity: 0.18, lineHeight: 1, marginBottom: 14 }}>
                    {step.num}
                  </div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 10, lineHeight: 1.3 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: "#6a6a6a" }}>
                    {step.text}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ paddingBottom: 80, background: "#f0f4f4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 0" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
                Преимущества
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Почему это выгодно
              </h2>
            </div>
          </FadeIn>
          <div className="ps-benefits-grid">
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="ps-benefit-card" style={{
                  background: "#fff", borderRadius: 20,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; }}
                >
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{b.icon}</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{b.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.65, color: "#6a6a6a" }}>{b.text}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="ps-calc-grid">
            <FadeIn>
              <div>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
                  Калькулятор дохода
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2 }}>
                  Сколько вы<br />можете заработать?
                </h2>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 14 }}>
                  Комиссия выплачивается ежемесячно за каждый активный салон, оформивший подписку по вашему промокоду.
                </p>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a" }}>
                  Один привлечённый салон с тарифом «Профи» приносит вам <strong style={{ color: ACCENT }}>299 ₽ в месяц</strong>. Десять салонов — уже <strong style={{ color: ACCENT }}>2 990 ₽</strong> ежемесячно, без дополнительных усилий.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <Calculator />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
