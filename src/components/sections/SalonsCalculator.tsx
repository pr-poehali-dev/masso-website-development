import { useState } from "react";
import { AnimatedSection } from "@/components/ui/shared";

const ACCENT = "hsl(185, 85%, 45%)";
const ACCENT_DARK = "hsl(185, 85%, 32%)";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

export function SalonsCalculator({ onCta }: { onCta: () => void }) {
  const [masters, setMasters] = useState(3);
  const [price, setPrice] = useState(8000);
  const [clientsDay, setClientsDay] = useState(4);
  const [workDays, setWorkDays] = useState(22);
  const [course, setCourse] = useState(6);
  const [mode, setMode] = useState<"before" | "after">("after");

  const BEFORE_MULT = 0.35;

  const incomePerMaster = clientsDay * price * workDays;
  const totalIncome = incomePerMaster * masters;
  const incomeFromCourse = price * course;
  const clientsMonth = clientsDay * workDays * masters;
  const totalTurnover = clientsMonth * course * price;

  const beforeIncome = Math.round(totalIncome * BEFORE_MULT);
  const growth = totalIncome - beforeIncome;

  const tariffBase = 150000;
  const paybackDays = Math.ceil((tariffBase / totalIncome) * 30);

  const field = (label: string, hint: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "hsl(210,40%,80%)" }}>{label}</label>
      {hint && <span style={{ fontSize: 11, color: "hsl(210,30%,55%)" }}>{hint}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, minWidth: 0, accentColor: ACCENT, cursor: "pointer" }}
        />
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
          style={{ width: "clamp(58px, 18vw, 84px)", flexShrink: 0, padding: "5px 6px", borderRadius: 8, border: "1px solid hsl(185,85%,30%,0.4)", background: "hsl(220,30%,13%)", color: "hsl(210,40%,90%)", fontSize: 13, textAlign: "right" }}
        />
      </div>
    </div>
  );

  return (
    <section style={{ padding: "80px 0", background: "hsl(220,25%,8%)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", color: ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Калькулятор</div>
            <h2 style={{ fontFamily: "var(--font-display, inherit)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "hsl(210,40%,95%)", marginBottom: 12, lineHeight: 1.2 }}>
              Калькулятор дохода массажных услуг
            </h2>
            <p style={{ color: "hsl(210,30%,60%)", fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
              Рассчитайте потенциальную прибыль салона после внедрения системы МассоПро
            </p>
          </div>
        </AnimatedSection>

        {/* Toggle */}
        <AnimatedSection delay={100}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", background: "hsl(220,30%,13%)", borderRadius: 14, padding: 4, border: "1px solid hsl(185,85%,30%,0.25)" }}>
              {(["before", "after"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ padding: "8px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.25s",
                    background: mode === m ? ACCENT : "transparent",
                    color: mode === m ? "hsl(220,30%,6%)" : "hsl(210,30%,60%)",
                    border: "none" }}>
                  {m === "before" ? "До МассоПро" : "После МассоПро"}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 24, alignItems: "start" }}>

          {/* Inputs */}
          <AnimatedSection delay={150}>
            <div style={{ background: "hsl(220,30%,11%)", borderRadius: 24, padding: 28, border: "1px solid hsl(185,85%,30%,0.2)", display: "flex", flexDirection: "column", gap: 22 }}>
              {field("Количество специалистов", "", masters, 1, 20, 1, setMasters)}
              {field("Стоимость процедуры (₽)", "После внедрения МассоПро — от 8 000 ₽", price, 1000, 30000, 500, setPrice)}
              {field("Клиентов в день (1 специалист)", "Обычно 3–5 клиентов", clientsDay, 1, 12, 1, setClientsDay)}
              {field("Рабочих дней в месяц", "", workDays, 1, 31, 1, setWorkDays)}
              {field("Курс процедур (сеансов)", "В МассоПро — курсами по 5–8 процедур", course, 1, 15, 1, setCourse)}
            </div>
          </AnimatedSection>

          {/* Results */}
          <AnimatedSection delay={200}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Main result */}
              <div style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(200,90%,45%))`, borderRadius: 24, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,20,40,0.7)", marginBottom: 8 }}>
                  {mode === "before" ? "Доход сейчас" : "Доход после МассоПро"}
                </div>
                <div style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, color: "hsl(220,30%,6%)", lineHeight: 1.1 }}>
                  {fmt(mode === "before" ? beforeIncome : totalIncome)} ₽
                </div>
                <div style={{ fontSize: 13, color: "rgba(0,20,40,0.65)", marginTop: 6 }}>в месяц</div>
                {mode === "after" && (
                  <div style={{ marginTop: 14, padding: "8px 16px", borderRadius: 10, background: "rgba(0,0,0,0.15)", fontSize: 13, fontWeight: 600, color: "hsl(220,30%,6%)" }}>
                    +{fmt(growth)} ₽ к текущему доходу
                  </div>
                )}
              </div>

              {/* Metrics */}
              {[
                { label: "Доход 1 специалиста", value: `${fmt(mode === "before" ? incomePerMaster * BEFORE_MULT : incomePerMaster)} ₽/мес` },
                { label: "Клиентов в месяц", value: `${fmt(clientsMonth)} чел.` },
                { label: "Доход с 1 клиента (курс)", value: `${fmt(incomeFromCourse)} ₽` },
                { label: "Общий оборот по курсам", value: `${fmt(mode === "before" ? totalTurnover * BEFORE_MULT : totalTurnover)} ₽/мес` },
              ].map((item, i) => (
                <div key={i} style={{ background: "hsl(220,30%,11%)", borderRadius: 16, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", border: "1px solid hsl(185,85%,30%,0.15)" }}>
                  <span style={{ fontSize: 13, color: "hsl(210,30%,60%)" }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "hsl(210,40%,90%)", whiteSpace: "nowrap" }}>{item.value}</span>
                </div>
              ))}

              {/* Payback */}
              <div style={{ background: "hsl(220,30%,11%)", borderRadius: 16, padding: "14px 20px", border: "1px solid hsl(185,85%,30%,0.3)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>Окупаемость</div>
                <div style={{ fontSize: 14, color: "hsl(210,40%,85%)", lineHeight: 1.6 }}>
                  Базовый тариф (150 000 ₽) окупается примерно за <span style={{ color: ACCENT, fontWeight: 700 }}>
                    {paybackDays <= 7 ? "1 неделю" : paybackDays <= 14 ? "1–2 недели" : paybackDays <= 21 ? "2–3 недели" : "месяц"}
                  </span> работы
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Benefits */}
        <AnimatedSection delay={250}>
          <div style={{ marginTop: 32, background: "hsl(220,30%,11%)", borderRadius: 20, padding: "16px 20px", border: "1px solid hsl(185,85%,30%,0.2)", display: "flex", flexDirection: "column", gap: 12 }}>
            {["Увеличивается средний чек", "Клиенты проходят курс процедур", "Формируется стабильный поток клиентов"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 13, color: "hsl(210,40%,80%)" }}>{t}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={300}>
          <div style={{ marginTop: 36, textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(210,40%,85%)", marginBottom: 8 }}>
              Хотите получить точный расчёт для вашего салона?
            </p>
            <p style={{ fontSize: 13, color: "hsl(210,30%,55%)", marginBottom: 24, lineHeight: 1.6 }}>
              Оставьте заявку — мы подготовим индивидуальный прогноз
            </p>
            <button onClick={onCta}
              style={{ padding: "14px 24px", width: "100%", maxWidth: 420, borderRadius: 14, background: ACCENT, color: "hsl(220,30%,6%)", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.25s", boxShadow: `0 4px 24px ${ACCENT}55` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DARK; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT; (e.currentTarget as HTMLButtonElement).style.color = "hsl(220,30%,6%)"; }}
            >
              Получить консультацию по внедрению МассоПро
            </button>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
