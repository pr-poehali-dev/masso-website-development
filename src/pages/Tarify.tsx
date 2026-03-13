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

const PLANS = [
  {
    name: "Базовый",
    price: "150 000",
    period: "/ внедрение",
    badge: null,
    color: "#fff",
    textColor: "#1a1a1a",
    features: [
      "Для салонов до 3 мастеров",
      "Медицинский массаж",
      "Висцеральный массаж",
      "Остеопатические техники",
      "Коррекция фигуры без масла",
      "Диагностика и протоколы работы",
      "Доступ к онлайн-курсам платформы",
    ],
    note: "Для салонов, только начинающих внедрение МассоПро",
    cta: "Выбрать Базовый",
    ctaStyle: "outline",
  },
  {
    name: "Расширенный",
    price: "250 000",
    period: "/ внедрение",
    badge: "Популярный",
    color: ACCENT,
    textColor: "#fff",
    features: [
      "Для салонов до 3 мастеров",
      "Все техники Базового тарифа",
      "Регуляция ВНС",
      "Работа с ВНЧС",
      "Доступ к чату специалистов",
      "Участие в вебинарах",
      "Поддержка специалистов",
    ],
    note: "Для салонов, нацеленных на профессиональный рост",
    cta: "Выбрать Расширенный",
    ctaStyle: "filled",
  },
  {
    name: "Полный",
    price: "По запросу",
    period: "",
    badge: null,
    color: "#1a1a1a",
    textColor: "#fff",
    features: [
      "Для салонов от 3 специалистов",
      "Все техники Расширенного тарифа",
      "Краниосакральные техники",
      "Курс по онлайн-рекламе",
      "Доступ ко всем онлайн-курсам",
      "Внедрение услуг под конкретных мастеров",
      "Приоритетная поддержка 24/7",
    ],
    note: "Для мастеров, стремящихся к экспертному уровню",
    cta: "Получить предложение",
    ctaStyle: "filled",
  },
];

const FAQ = [
  {
    q: "Можно ли сменить тариф в процессе обучения?",
    a: "Да, вы можете перейти на более высокий тариф в любой момент. При переходе доплачивается разница за оставшиеся дни месяца.",
  },
  {
    q: "Что будет, если я пропущу оплату?",
    a: "Доступ к платформе приостанавливается до следующего платежа. Все прогресс и данные сохраняются в течение 60 дней.",
  },
  {
    q: "Подходит ли платформа для частных мастеров?",
    a: "Платформа создана для специалистов салонов и студий МассоПро. Частные мастера могут оставить заявку на консультацию — мы рассматриваем каждый случай индивидуально.",
  },
  {
    q: "Есть ли пробный период?",
    a: "Для специалистов салонов МассоПро предусмотрен 7-дневный пробный доступ к тарифу Старт. Уточните детали у менеджера вашего салона.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          textAlign: "left" as const,
          background: "none",
          border: "none",
          padding: "22px 28px",
          fontSize: 16,
          fontWeight: 600,
          color: "#1a1a1a",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span>{q}</span>
        <span style={{
          color: ACCENT,
          fontSize: 22,
          lineHeight: 1,
          transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 28px 22px", fontSize: 15, color: "#5a5a5a", lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

function ConsultForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !plan) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
          Заявка принята!
        </div>
        <p style={{ fontSize: 16, color: "#5a5a5a", lineHeight: 1.65 }}>
          Мы свяжемся с вами в течение рабочего дня и расскажем всё о доступе к платформе.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Мария Иванова"
          required
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0",
            fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          required
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0",
            fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Интересующий тариф</label>
        <select
          value={plan}
          onChange={e => setPlan(e.target.value)}
          required
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0",
            fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box",
            fontFamily: "Montserrat, sans-serif", color: plan ? "#1a1a1a" : "#999",
          }}
        >
          <option value="" disabled>Выберите тариф</option>
          <option value="Базовый">Базовый — 150 000 ₽</option>
          <option value="Расширенный">Расширенный — 250 000 ₽</option>
          <option value="Полный">Полный — по запросу</option>
        </select>
      </div>
      <button
        type="submit"
        style={{
          marginTop: 8, background: ACCENT, color: "#fff", padding: "14px 28px",
          borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
          transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`,
          fontFamily: "Montserrat, sans-serif",
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
        Оставить заявку на консультацию
      </button>
      <p style={{ margin: 0, fontSize: 12, color: "#aaa", textAlign: "center", lineHeight: 1.5 }}>
        Отправляя заявку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

export default function Tarify() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: 72 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20,
            }}>
              Тарифы Док Диалог
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a",
              marginBottom: 24, letterSpacing: "-0.5px",
            }}>
              Выберите свой<br />
              <span style={{ color: ACCENT }}>план обучения</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#5a5a5a", maxWidth: 580, margin: "0 auto 16px" }}>
              Три формата внедрения МассоПро — выберите подходящий для вашего салона. Все тарифы включают обучение мастеров и доступ к онлайн-платформе.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Plans */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            alignItems: "stretch",
          }}>
            {PLANS.map((plan, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div style={{
                  background: plan.color,
                  borderRadius: 24,
                  padding: "40px 32px",
                  boxShadow: plan.name === "Расширенный"
                    ? `0 24px 80px ${ACCENT_SHADOW}`
                    : "0 4px 32px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative" as const,
                  transform: plan.name === "Расширенный" ? "scale(1.03)" : "scale(1)",
                  boxSizing: "border-box",
                }}>
                  {plan.badge && (
                    <div style={{
                      position: "absolute" as const, top: -14, left: "50%", transform: "translateX(-50%)",
                      background: "#fff", color: ACCENT, fontSize: 12, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase" as const,
                      padding: "6px 20px", borderRadius: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 30, fontWeight: 700, color: plan.textColor, marginBottom: 4 }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: 13, color: plan.textColor, opacity: 0.65, lineHeight: 1.5 }}>
                      {plan.note}
                    </div>
                  </div>

                  <div style={{ margin: "28px 0", borderTop: `1px solid ${plan.textColor === "#fff" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}` }} />

                  <div style={{ marginBottom: 28 }}>
                    <span style={{ fontFamily: "Cormorant, serif", fontSize: 48, fontWeight: 700, color: plan.textColor, lineHeight: 1 }}>
                      {plan.price}{plan.period ? " ₽" : ""}
                    </span>
                    <span style={{ fontSize: 14, color: plan.textColor, opacity: 0.6, marginLeft: 4 }}>
                      {plan.period}
                    </span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    {plan.features.map((f, fi) => (
                      <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: plan.name === "Расширенный" ? "#fff" : ACCENT, fontWeight: 700, fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 14, color: plan.textColor, opacity: 0.9, lineHeight: 1.55 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    style={{
                      background: plan.ctaStyle === "outline" ? "transparent" : plan.name === "Расширенный" ? "#fff" : ACCENT,
                      color: plan.ctaStyle === "outline" ? "#1a1a1a" : plan.name === "Расширенный" ? ACCENT : "#fff",
                      border: plan.ctaStyle === "outline" ? "2px solid #d0d0d0" : "none",
                      padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                      transition: "all 0.2s ease", letterSpacing: "0.02em",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.opacity = "0.85";
                      el.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.opacity = "1";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Private practice */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{
              background: "#fff",
              borderRadius: 32,
              overflow: "hidden",
              boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}>
              <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{
                  display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20,
                }}>
                  Частная практика
                </div>
                <h2 style={{
                  fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2,
                }}>
                  Работаете<br />на себя?
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                  Платформа Dok Диалог создана для мастеров салонов и студий системы МассоПро. Но если вы ведёте <strong>частную практику</strong> и хотите профессионально расти — мы готовы рассмотреть вашу заявку.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#5a5a5a", marginBottom: 0 }}>
                  Доступ к платформе предоставляется при <strong>наличии активной подписки</strong> на один из тарифов. Оставьте заявку — мы проконсультируем и поможем выбрать оптимальный план.
                </p>
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Онлайн-обучение в любое удобное время", "Актуальные техники и протоколы", "Поддержка профессионального сообщества"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: ACCENT, fontWeight: 700, fontSize: 16 }}>✓</span>
                      <span style={{ fontSize: 15, color: "#3a3a3a" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#f8f8f6", padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Оставить заявку
                </div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>
                  Заполните форму, и мы свяжемся с вами для консультации. Доступ предоставляется при покупке любого тарифа.
                </p>
                <ConsultForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingBottom: 120 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{
                display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16,
              }}>
                Вопросы и ответы
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Частые вопросы
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <FaqItem q={item.q} a={item.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}