import { useEffect, useRef, useState } from "react";
import DokFooter from "@/components/DokFooter";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

const STEPS = [
  {
    num: "01",
    title: "Регистрируетесь как партнёр",
    text: "Получаете личный кабинет и уникальный промокод, который даёт скидку на подписку платформы Док Диалог для салона.",
  },
  {
    num: "02",
    title: "Рекомендуете платформу салонам",
    text: "Рассказываете владельцам салонов и студий, как онлайн-обучение мастеров повышает качество услуг и доход бизнеса.",
  },
  {
    num: "03",
    title: "Салон вводит ваш промокод",
    text: "При оформлении подписки на любой тариф Док Диалог салон вводит ваш промокод и получает скидку на обучение специалистов.",
  },
  {
    num: "04",
    title: "Вы получаете 10% комиссии",
    text: "С каждой оплаты, совершённой по вашему промокоду, на ваш счёт начисляется 10% комиссионных. Ежемесячно, автоматически.",
  },
];

const BENEFITS = [
  {
    icon: "💰",
    title: "Пассивный доход",
    text: "Комиссия начисляется ежемесячно, пока салон остаётся подписчиком. Рекомендовали один раз — получаете регулярно.",
  },
  {
    icon: "🎯",
    title: "Промокод со скидкой",
    text: "Ваш промокод даёт салону реальную выгоду — это облегчает разговор и повышает конверсию в подписку.",
  },
  {
    icon: "📊",
    title: "Прозрачная аналитика",
    text: "В личном кабинете видите все активации промокода, начисленные комиссии и историю выплат в режиме реального времени.",
  },
  {
    icon: "🤝",
    title: "Поддержка партнёров",
    text: "Персональный менеджер, обучающие материалы и готовые скрипты для переговоров с владельцами салонов.",
  },
  {
    icon: "⚡",
    title: "Быстрый старт",
    text: "Регистрация занимает 5 минут. Промокод активен сразу — можно начинать рекомендовать в тот же день.",
  },
  {
    icon: "🔄",
    title: "Без ограничений",
    text: "Количество привлечённых салонов не ограничено. Чем больше активных салонов — тем выше ежемесячный доход.",
  },
];

const CALC_PLANS = [
  { name: "Базовый", price: 150000 },
  { name: "Расширенный", price: 250000 },
  { name: "Полный", price: 400000 },
];

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

function PartnerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
          Заявка отправлена!
        </div>
        <p style={{ fontSize: 16, color: "#5a5a5a", lineHeight: 1.65 }}>
          Мы свяжемся с вами в течение рабочего дня, подключим к партнёрской программе и выдадим ваш промокод.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input
          value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
        <input
          value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Расскажите о себе <span style={{ color: "#aaa", fontWeight: 400 }}>(необязательно)</span></label>
        <textarea
          value={about} onChange={e => setAbout(e.target.value)}
          placeholder="Чем занимаетесь, как планируете привлекать салоны..."
          rows={3}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", resize: "vertical" as const }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <button
        type="submit"
        style={{
          marginTop: 8, background: ACCENT, color: "#fff", padding: "15px 28px",
          borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
          transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`,
          fontFamily: "Montserrat, sans-serif", letterSpacing: "0.01em",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = ACCENT_DARK;
          el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`;
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = ACCENT;
          el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`;
          el.style.transform = "translateY(0)";
        }}
      >
        Стать партнёром
      </button>
      <p style={{ margin: 0, fontSize: 12, color: "#aaa", textAlign: "center", lineHeight: 1.5 }}>
        Отправляя заявку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

export default function Partnery() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: 0 }}>
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
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 52, fontWeight: 700, color: "#f0f0ee", lineHeight: 1, marginBottom: 16 }}>
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

      {/* Forma */}
      <section id="forma" style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{
              background: "#fff", borderRadius: 32, overflow: "hidden",
              boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}>
              <div style={{ background: ACCENT, padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 24, lineHeight: 1.2 }}>
                  Станьте партнёром<br />Dok Диалог
                </div>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 36 }}>
                  Оставьте заявку — мы свяжемся с вами, расскажем об условиях программы и выдадим ваш уникальный промокод.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    "Бесплатное подключение",
                    "Промокод с первого дня",
                    "Поддержка персонального менеджера",
                    "Выплаты без задержек",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 15, color: "rgba(255,255,255,0.9)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Заявка на партнёрство
                </div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>
                  Расскажите о себе, и мы подключим вас к программе в течение рабочего дня.
                </p>
                <PartnerForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Cabinet CTA */}
      <section id="kabinet" style={{ paddingBottom: 120 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <FadeIn>
            <div style={{ background: "#1a1a1a", borderRadius: 28, padding: "56px 48px", boxShadow: "0 16px 64px rgba(0,0,0,0.15)" }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Уже являетесь партнёром?
              </div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36 }}>
                Войдите в личный кабинет, чтобы отслеживать активации промокода, начисленные комиссии и историю выплат.
              </p>
              <a
                href="#"
                style={{
                  display: "inline-block", background: "#fff", color: "#1a1a1a",
                  padding: "16px 40px", borderRadius: 12, fontSize: 15, fontWeight: 700,
                  textDecoration: "none", transition: "all 0.25s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = ACCENT;
                  el.style.color = "#fff";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#fff";
                  el.style.color = "#1a1a1a";
                  el.style.transform = "translateY(0)";
                }}
              >
                Войти в кабинет →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}