import { useEffect, useRef, useState } from "react";
import SimpleLayout from "@/components/layout/SimpleLayout";

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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const ACCENT = "hsl(185, 85%, 45%)";
const ACCENT_GLOW = "hsla(185, 85%, 45%, 0.12)";
const ACCENT_BORDER = "hsla(185, 85%, 45%, 0.28)";
const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

const cardStyle: React.CSSProperties = {
  background: "hsl(220, 25%, 9%)",
  border: "1px solid hsl(220, 20%, 16%)",
  borderRadius: 20,
  padding: "28px 24px",
};

function AuditForm() {
  const [form, setForm] = useState({ name: "", phone: "", salon: "", city: "" });
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Необходимо принять политику конфиденциальности"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonName: form.salon,
          phone: form.phone,
          package: "Аудит салона",
          contactName: form.name,
          city: form.city,
        }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, color: ACCENT, fontWeight: 700 }}>✓</div>
        <div className="font-display" style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 700, color: "hsl(210, 40%, 96%)", marginBottom: 12 }}>
          Заявка принята
        </div>
        <p style={{ fontSize: 16, color: "hsl(215, 20%, 60%)", lineHeight: 1.7 }}>
          Свяжемся в течение 2 рабочих часов<br />и договоримся об удобном времени.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1.5px solid hsl(220, 20%, 18%)",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "hsl(220, 30%, 7%)",
    color: "hsl(210, 40%, 96%)",
    transition: "border-color 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {[
        { key: "name", label: "Ваше имя", placeholder: "Иван Петров", type: "text", required: true },
        { key: "phone", label: "Телефон", placeholder: "+7 (999) 000-00-00", type: "tel", required: true },
        { key: "salon", label: "Название салона", placeholder: "Студия «Релакс»", type: "text", required: true },
        { key: "city", label: "Город", placeholder: "Москва", type: "text", required: false },
      ].map(({ key, label, placeholder, type, required }) => (
        <div key={key}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210, 40%, 75%)", marginBottom: 7 }}>
            {label}{required && " *"}
          </label>
          <input
            type={type}
            value={form[key as keyof typeof form]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            required={required}
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
            onBlur={e => (e.currentTarget.style.borderColor = "hsl(220, 20%, 18%)")}
          />
        </div>
      ))}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }}
        />
        <span style={{ fontSize: 12, color: "hsl(215, 20%, 50%)", lineHeight: 1.65 }}>
          Я согласен с{" "}
          <a href="/privacy" style={{ color: ACCENT }} target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" style={{ color: ACCENT }} target="_blank" rel="noopener noreferrer">публичной офертой</a>
        </span>
      </label>
      {error && (
        <p style={{ margin: 0, fontSize: 13, color: "#f87171", textAlign: "center", background: "hsla(0,60%,20%,0.4)", padding: "10px 14px", borderRadius: 10 }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="gradient-bg hover:opacity-90 transition-opacity"
        style={{ padding: "16px 28px", borderRadius: 14, fontSize: 16, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1, fontFamily: "inherit", color: "hsl(220, 30%, 6%)" }}
      >
        {loading ? "Отправляем..." : "Получить аудит"}
      </button>
    </form>
  );
}

export default function Audit() {
  return (
    <SimpleLayout>
      <div className="font-body" style={{ color: "hsl(210, 40%, 96%)", minHeight: "100vh" }}>

        {/* ── 1. HERO ── */}
        <section className="gradient-section" style={{ padding: "88px 0 80px" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 40, padding: "6px 16px", marginBottom: 24 }}>
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

        {/* ── 2. БОЛЬ ── */}
        <section style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 40, maxWidth: 600 }}>
                Вы теряете деньги,<br />даже если клиенты приходят
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

        {/* ── 3. МАСШТАБ ПОТЕРЬ ── */}
        <section className="gradient-section" style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 14, textAlign: "center" }}>
                Сколько это в деньгах
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

        {/* ── 4. РЕЗУЛЬТАТ АУДИТА ── */}
        <section style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
                Что вы получите
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

        {/* ── 5. КАК ПРОХОДИТ ── */}
        <section className="gradient-section" style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 48, textAlign: "center" }}>
                Как проходит аудит
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

        {/* ── 6. БЫСТРЫЙ РЕЗУЛЬТАТ ── */}
        <section style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
                <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
                  Результат уже в течение 1 часа
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

        {/* ── 7. ДО / ПОСЛЕ ── */}
        <section className="gradient-section" style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 48, textAlign: "center" }}>
                Пример результата
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

        {/* ── 8. ДЛЯ КОГО ── */}
        <section style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
                Для кого этот аудит
              </h2>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, maxWidth: 760 }}>
              {[
                "Салоны и студии с массажем",
                "Есть клиенты, но нет роста",
                "Нет контроля продаж персонала",
                "Низкий средний чек",
              ].map((text, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{text}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. ПОСЛЕ АУДИТА ── */}
        <section className="gradient-section" style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
                Что вы сможете сделать
              </h2>
            </FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560 }}>
              {[
                "Увеличить средний чек",
                "Внедрить новые техники массажа",
                "Повысить конверсию записи",
                "Увеличить возврат клиентов",
              ].map((r, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 16, color: "hsl(210, 40%, 88%)" }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: ACCENT_GLOW, border: `1px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>✓</span>
                    {r}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. СТОИМОСТЬ ── */}
        <section style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <div style={{ ...cardStyle, border: `1px solid ${ACCENT_BORDER}`, padding: "48px 36px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Стоимость</div>
                  <div className="font-display" style={{ fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 700, marginBottom: 14 }}>
                    Рассчитывается индивидуально
                  </div>
                  <p style={{ color: "hsl(215, 20%, 55%)", lineHeight: 1.7, marginBottom: 28, fontSize: 15 }}>
                    Зависит от размера салона, количества мастеров и задач.<br />Оставьте заявку — обсудим и назовём точную цену.
                  </p>
                  <a
                    href="#audit-form"
                    className="gradient-bg hover:opacity-90 transition-opacity"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 32px", borderRadius: 50, fontWeight: 700, fontSize: 16, textDecoration: "none", color: "hsl(220, 30%, 6%)" }}
                  >
                    Оставить заявку
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── 11. ФОРМА ── */}
        <section id="audit-form" className="gradient-section" style={{ padding: "80px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 56, alignItems: "start", maxWidth: 960, margin: "0 auto" }}>
              <FadeIn>
                <div>
                  <h2 className="font-display" style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, marginBottom: 18 }}>
                    Получить аудит
                  </h2>
                  <p style={{ color: "hsl(215, 20%, 55%)", lineHeight: 1.75, marginBottom: 28, fontSize: 16 }}>
                    Оставьте заявку — свяжемся в течение 2 часов и договоримся об удобном времени.
                  </p>
                  {[
                    "Аудит проходит за 1 час",
                    "Результат — конкретные цифры потерь",
                    "Без скрытых обязательств",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "hsl(210, 40%, 82%)", marginBottom: 12 }}>
                      <span style={{ color: ACCENT, fontWeight: 700, fontSize: 14 }}>✓</span> {t}
                    </div>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={120}>
                <div style={{ ...cardStyle, border: `1px solid ${ACCENT_BORDER}`, padding: "40px 36px" }}>
                  <AuditForm />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── 12. ФИНАЛЬНЫЙ ДОЖИМ ── */}
        <section style={{ padding: "88px 0 100px" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn>
              <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
                <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "hsl(215, 20%, 55%)", lineHeight: 1.75, marginBottom: 24 }}>
                  Вы можете продолжать работать как есть
                </p>
                <div className="font-display" style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 32 }}>
                  Или за 1 час увидеть реальную картину<br />
                  <span className="gradient-text">и начать зарабатывать больше</span>
                </div>
                <div style={{ ...cardStyle, border: `1px solid ${ACCENT_BORDER}`, padding: "28px 32px", marginBottom: 36 }}>
                  <p style={{ fontSize: "clamp(17px, 2.5vw, 22px)", fontWeight: 700, color: "hsl(210, 40%, 96%)", lineHeight: 1.6, margin: 0 }}>
                    Деньги уже есть в вашем салоне.<br />
                    <span className="gradient-text">Вопрос — забираете вы их или нет.</span>
                  </p>
                </div>
                <a
                  href="#audit-form"
                  className="gradient-bg hover:opacity-90 transition-opacity animate-pulse-glow"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 40px", borderRadius: 50, fontWeight: 700, fontSize: 18, textDecoration: "none", color: "hsl(220, 30%, 6%)" }}
                >
                  Получить аудит сейчас
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

      </div>
    </SimpleLayout>
  );
}
