import { useState } from "react";
import { ACCENT, STEPS, BENEFITS, CALC_PLANS, FadeIn } from "./partneryUtils";

function Calculator() {
  const [salons, setSalons] = useState(5);
  const [planIdx, setPlanIdx] = useState(1);
  const monthly = Math.round(salons * CALC_PLANS[planIdx].price * 0.1);

  return (
    <div style={{ background: "#fff", borderRadius: 28, padding: "48px 40px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 30, fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
        Посчитайте свой доход
      </div>

      <div style={{ marginBottom: 28 }}>
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

      <div style={{ marginBottom: 36 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3a3a3a", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
          Средний тариф салона
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          {CALC_PLANS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPlanIdx(i)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
                background: planIdx === i ? ACCENT : "#f0f0ee",
                color: planIdx === i ? "#fff" : "#555",
                border: "none",
              }}
            >
              {p.name}<br />
              <span style={{ fontWeight: 400, fontSize: 12, opacity: 0.85 }}>{p.price.toLocaleString("ru")} ₽</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: "#f8f8f6", borderRadius: 16, padding: "28px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Ваша комиссия</div>
          <div style={{ fontFamily: "Cormorant, serif", fontSize: 48, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
            {monthly.toLocaleString("ru")} ₽
          </div>
          <div style={{ fontSize: 13, color: "#aaa", marginTop: 6 }}>
            {salons} салон{salons === 1 ? "" : salons < 5 ? "а" : "ов"} × {CALC_PLANS[planIdx].price.toLocaleString("ru")} ₽ × 10%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerSections() {
  return (
    <>
      {/* How it works */}
      <section style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
                Как это работает
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Четыре простых шага
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{
                  background: "#fff", borderRadius: 20, padding: "36px 28px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)", height: "100%", boxSizing: "border-box",
                  borderTop: `4px solid ${ACCENT}`,
                }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 48, fontWeight: 700, color: ACCENT, opacity: 0.18, lineHeight: 1, marginBottom: 16 }}>
                    {step.num}
                  </div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.3 }}>
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
      <section style={{ paddingBottom: 100, background: "#f0f4f4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
                Преимущества
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Почему это выгодно
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{
                  background: "#fff", borderRadius: 20, padding: "32px 28px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{b.icon}</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{b.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.65, color: "#6a6a6a" }}>{b.text}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56, alignItems: "center" }}>
            <FadeIn>
              <div>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
                  Калькулятор дохода
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2 }}>
                  Сколько вы<br />можете заработать?
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                  Комиссия выплачивается ежемесячно за каждый активный салон, оформивший подписку по вашему промокоду.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#5a5a5a" }}>
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
