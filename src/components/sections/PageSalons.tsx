import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AnimatedSection, CTAButton, Page } from "@/components/ui/shared";

const ACCENT = "hsl(185, 85%, 45%)";
const ACCENT_DARK = "hsl(185, 85%, 32%)";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

function Calculator({ onCta }: { onCta: () => void }) {
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
          style={{ flex: 1, accentColor: ACCENT, cursor: "pointer" }}
        />
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
          style={{ width: 80, padding: "5px 8px", borderRadius: 8, border: "1px solid hsl(185,85%,30%,0.4)", background: "hsl(220,30%,13%)", color: "hsl(210,40%,90%)", fontSize: 13, textAlign: "right" }}
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

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
                <div key={i} style={{ background: "hsl(220,30%,11%)", borderRadius: 16, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid hsl(185,85%,30%,0.15)" }}>
                  <span style={{ fontSize: 13, color: "hsl(210,30%,60%)" }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "hsl(210,40%,90%)" }}>{item.value}</span>
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
          <div style={{ marginTop: 32, background: "hsl(220,30%,11%)", borderRadius: 20, padding: "20px 28px", border: "1px solid hsl(185,85%,30%,0.2)", display: "flex", flexWrap: "wrap", gap: 16 }}>
            {["Увеличивается средний чек", "Клиенты проходят курс процедур", "Формируется стабильный поток клиентов"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${ACCENT}22`, border: `1px solid ${ACCENT}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Check" size={11} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 13, color: "hsl(210,40%,75%)" }}>После МассоПро — {t.toLowerCase()}</span>
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
              style={{ padding: "14px 36px", borderRadius: 14, background: ACCENT, color: "hsl(220,30%,6%)", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.25s", boxShadow: `0 4px 24px ${ACCENT}55` }}
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

// ─── PageSalons ───────────────────────────────────────────────────────────────

export function PageSalons({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Партнёрство</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              Для <span className="gradient-text">салонов</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              МассоПРО помогает внедрять массажные услуги, обучать мастеров и повышать статус салонов по всей России.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Пакеты</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">Пакеты внедрения</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                name: "Базовый",
                subtitle: "Старт",
                features: ["Офлайн-обучение мастеров", "Доступ к онлайн-курсам", "Базовые протоколы процедур", "Техподдержка в течение месяца"],
                accent: false,
              },
              {
                name: "Расширенный",
                subtitle: "Рекомендуем",
                features: ["Всё из Базового", "Готовые протоколы и инструкции", "Участие в вебинарах", "Закрытый чат с экспертами", "Поддержка 3 месяца"],
                accent: true,
              },
              {
                name: "Полный",
                subtitle: "Максимум",
                features: ["Всё из Расширенного", "Официальная сертификация", "Знак качества МассоПРО", "Размещение в каталоге студий", "Поддержка 6 месяцев"],
                accent: false,
              },
            ].map((pkg, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className={`rounded-3xl p-4 sm:p-6 md:p-8 h-full flex flex-col glow-card transition-all duration-300 ${pkg.accent ? "gradient-bg relative overflow-hidden" : "gradient-card"}`}>
                  {pkg.accent && (
                    <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider" style={{ background: "rgba(0,0,0,0.2)", color: "hsl(220, 30%, 6%)" }}>
                      Популярный
                    </div>
                  )}
                  <div className="mb-5">
                    <div className={`text-xs font-body font-semibold uppercase tracking-widest mb-2 ${pkg.accent ? "text-background/70" : "text-primary"}`} style={pkg.accent ? { color: "rgba(220,240,255,0.7)" } : {}}>{pkg.subtitle}</div>
                    <h3 className="font-display text-3xl font-bold" style={pkg.accent ? { color: "hsl(220, 30%, 6%)" } : {}}>{pkg.name}</h3>
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.accent ? "" : "bg-primary/20 border border-primary/40"}`} style={pkg.accent ? { background: "rgba(0,0,0,0.15)" } : {}}>
                          <Icon name="Check" size={11} className={pkg.accent ? "" : "text-primary"} style={pkg.accent ? { color: "hsl(220, 30%, 6%)" } : {}} />
                        </div>
                        <span className="text-sm font-body leading-snug" style={pkg.accent ? { color: "rgba(10,20,40,0.85)" } : { color: "hsl(210,40%,75%)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }}
                    className="w-full rounded-xl py-3 text-sm font-body font-semibold transition-all duration-300"
                    style={pkg.accent
                      ? { background: "hsl(220, 30%, 6%)", color: "hsl(185, 85%, 45%)" }
                      : { border: "1px solid hsl(185,85%,45%,0.4)", color: "hsl(185, 85%, 45%)" }
                    }
                  >
                    Выбрать пакет
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <Calculator onCta={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }} />

      {/* Case */}
      <section className="py-16 md:py-24 gradient-section">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto gradient-card rounded-3xl p-5 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden glow-card">
              <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-5">Кейс</div>
                <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-6">
                  «После внедрения МассоПРО средний чек салона вырос на{" "}
                  <span className="gradient-text">25%</span>, а возвратность клиентов увеличилась вдвое»
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden glow-cyan shrink-0">
                    <img src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/78b04f6f-e80e-4580-9eb1-581ee0c4065a.jpg" alt="Партнёр МассоПРО" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <div className="text-foreground font-body font-semibold text-sm">Партнёр МассоПРО</div>
                    <div className="text-muted-foreground font-body text-xs">Салон красоты, Москва</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Готовы стать партнёром?</h2>
            <CTAButton large onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Оставить заявку на консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

// ─── PageCatalog ──────────────────────────────────────────────────────────────

export function PageCatalog({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 gradient-hero min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 md:mb-8 glow-cyan animate-float">
              <Icon name="LayoutGrid" size={36} style={{ color: "hsl(220, 30%, 6%)" }} />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              Каталог <span className="gradient-text">студий</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-4">
              Каталог сертифицированных студий откроется после формирования сети партнёрских салонов.
            </p>
            <p className="font-body text-foreground font-semibold text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 md:mb-8">
              Мы подключаем ограниченное количество салонов в каждом городе — 3–5 студий на город.
            </p>
            <CTAButton onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="mb-4">
              Оставить заявку
            </CTAButton>

            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto opacity-25 pointer-events-none select-none">
              {["А", "Б", "В"].map((_, i) => (
                <div key={i} className="gradient-card rounded-2xl p-5 text-left">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 mb-3" />
                  <div className="h-3 bg-foreground/20 rounded mb-2" />
                  <div className="h-2 bg-foreground/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}