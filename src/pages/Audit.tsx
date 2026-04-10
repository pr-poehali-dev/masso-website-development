import { useState } from "react";
import SimpleLayout from "@/components/layout/SimpleLayout";
import Icon from "@/components/ui/icon";

const ACCENT = "#0e7490";
const ACCENT_LIGHT = "#ecfeff";
const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

function FadeIn({ children, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return <div style={style}>{children}</div>;
}

function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: ACCENT, color: "#fff",
        padding: "16px 32px", borderRadius: 14,
        fontWeight: 700, fontSize: 16, textDecoration: "none",
        boxShadow: "0 8px 32px rgba(14,116,144,0.35)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 14px 40px rgba(14,116,144,0.45)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(14,116,144,0.35)";
      }}
    >
      {children}
    </a>
  );
}

function AuditForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [salonName, setSalonName] = useState("");
  const [city, setCity] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !salonName.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие на обработку данных"); return; }
    setLoading(true);
    setError("");
    try {
      await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonName: salonName.trim(),
          phone: phone.trim(),
          email: "audit@massopro.ru",
          package: "Аудит массажных услуг",
          contactName: name.trim(),
          city: city.trim(),
        }),
      });
      setSent(true);
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз или позвоните нам.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    border: "1.5px solid #e5e7eb", borderRadius: 12,
    fontSize: 15, fontFamily: "Montserrat, sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
    background: "#fff",
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
          Заявка принята!
        </div>
        <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6 }}>
          Мы свяжемся с вами в течение 2 часов и договоримся о времени аудита.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input
        style={inputStyle}
        placeholder="Ваше имя *"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        onFocus={e => (e.target.style.borderColor = ACCENT)}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
      <input
        style={inputStyle}
        placeholder="Телефон *"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
        type="tel"
        onFocus={e => (e.target.style.borderColor = ACCENT)}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
      <input
        style={inputStyle}
        placeholder="Название салона *"
        value={salonName}
        onChange={e => setSalonName(e.target.value)}
        required
        onFocus={e => (e.target.style.borderColor = ACCENT)}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
      <input
        style={inputStyle}
        placeholder="Город"
        value={city}
        onChange={e => setCity(e.target.value)}
        onFocus={e => (e.target.style.borderColor = ACCENT)}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
      {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, accentColor: ACCENT, width: 16, height: 16 }}
        />
        <span style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
          Согласен с{" "}
          <a href="/privacy" style={{ color: ACCENT, textDecoration: "none" }}>политикой конфиденциальности</a>
        </span>
      </label>
      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#9ca3af" : ACCENT,
          color: "#fff", border: "none", padding: "16px",
          borderRadius: 12, fontSize: 16, fontWeight: 700,
          cursor: loading ? "default" : "pointer",
          fontFamily: "Montserrat, sans-serif",
          boxShadow: loading ? "none" : "0 8px 24px rgba(14,116,144,0.3)",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Отправка..." : "👉 Получить аудит"}
      </button>
    </form>
  );
}

export default function Audit() {
  const steps = [
    { icon: "Search", label: "Анализ работы с клиентом" },
    { icon: "Users", label: "Оценка действий персонала" },
    { icon: "AlertTriangle", label: "Выявление ошибок" },
    { icon: "DollarSign", label: "Перевод потерь в деньги" },
    { icon: "Lightbulb", label: "Конкретные рекомендации" },
  ];

  const results = [
    "Где именно теряются деньги",
    "Сколько теряется с каждого клиента",
    "Оценка работы персонала",
    "Потенциал роста выручки",
    "Конкретные действия для изменений",
  ];

  const forWhom = [
    "Салоны с массажными услугами",
    "Есть клиенты, но выручка не растёт",
    "Нет контроля продаж и допуслуг",
    "Низкий средний чек",
  ];

  const afterAudit = [
    "Увеличить средний чек",
    "Внедрить новые техники продаж",
    "Повысить конверсию записи",
    "Вернуть клиентов, которые ушли",
  ];

  return (
    <SimpleLayout>
      <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>
        <style>{`
          .audit-section { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
          .audit-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .audit-steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
          @media (max-width: 900px) {
            .audit-steps { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 640px) {
            .audit-grid-2 { grid-template-columns: 1fr; }
            .audit-steps { grid-template-columns: 1fr 1fr; }
          }
        `}</style>

        {/* HERO */}
        <section style={{ paddingTop: 120, paddingBottom: 80, background: "linear-gradient(135deg, #0a1628 0%, #0e2a3a 60%, #0e7490 100%)" }}>
          <div className="audit-section">
            <FadeIn>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#67e8f9", marginBottom: 20 }}>
                Аудит массажных услуг
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: 20, maxWidth: 760 }}>
                Сколько денег вы теряете на каждом клиенте — не замечая этого?
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
                Покажем за 1 час скрытые потери в массажных услугах и точки роста выручки
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
                {["Анализ всей цепочки клиента", "Выявление потерь в рублях", "Конкретные решения"].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: 15 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0e7490", flexShrink: 0 }} />
                    {b}
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <CTAButton href="#audit-form">👉 Узнать потери</CTAButton>
            </FadeIn>
          </div>
        </section>

        {/* БОЛЬ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="audit-section">
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40, maxWidth: 640 }}>
                Вы теряете деньги, даже если клиенты приходят
              </h2>
            </FadeIn>
            <div className="audit-grid-2" style={{ gap: 16, marginBottom: 40 }}>
              {[
                { icon: "PhoneMissed", text: "Клиентов не доводят до записи" },
                { icon: "MessageSquareOff", text: "Не выявляют потребности клиента" },
                { icon: "ShoppingCart", text: "Не предлагают дополнительные услуги" },
                { icon: "UserX", text: "Клиент не возвращается повторно" },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={item.icon as "Search"} size={20} style={{ color: "#dc2626" }} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4, paddingTop: 10 }}>{item.text}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={300}>
              <div style={{ background: "#fef9c3", border: "1.5px solid #fbbf24", borderRadius: 14, padding: "20px 24px", fontSize: 16, fontWeight: 700, color: "#78350f" }}>
                👉 Потери происходят каждый день, но остаются незаметными
              </div>
            </FadeIn>
          </div>
        </section>

        {/* МАСШТАБ ПОТЕРЬ */}
        <section style={{ paddingTop: 80, paddingBottom: 80, background: "#0e2a3a" }}>
          <div className="audit-section">
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 16, textAlign: "center" }}>
                Сколько это в деньгах
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 16, textAlign: "center", marginBottom: 48 }}>
                Если вы теряете 3 000 ₽ с одного клиента и в день проходит 10 человек:
              </p>
            </FadeIn>
            <div className="audit-grid-2" style={{ gap: 20, marginBottom: 40 }}>
              <FadeIn delay={100}>
                <div style={{ background: "rgba(14,116,144,0.2)", border: "1.5px solid rgba(14,116,144,0.4)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 700, color: "#22d3ee", lineHeight: 1 }}>30 000 ₽</div>
                  <div style={{ color: "#94a3b8", fontSize: 16, marginTop: 12 }}>потери в день</div>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div style={{ background: "rgba(220,38,38,0.15)", border: "1.5px solid rgba(220,38,38,0.35)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 700, color: "#f87171", lineHeight: 1 }}>900 000 ₽</div>
                  <div style={{ color: "#94a3b8", fontSize: 16, marginTop: 12 }}>потери в месяц</div>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={300}>
              <div style={{ textAlign: "center" }}>
                <CTAButton href="#audit-form">👉 Проверить мой салон</CTAButton>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* РЕЗУЛЬТАТ АУДИТА */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="audit-section">
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40 }}>
                Что вы получите
              </h2>
            </FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {results.map((r, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "Cormorant, serif", fontWeight: 700, color: ACCENT, fontSize: 18 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{r}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* КАК ПРОХОДИТ */}
        <section style={{ paddingTop: 80, paddingBottom: 80, background: "#fff" }}>
          <div className="audit-section">
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 48, textAlign: "center" }}>
                Как проходит аудит
              </h2>
            </FadeIn>
            <div className="audit-steps">
              {steps.map((step, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 18, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Icon name={step.icon as "Search"} size={28} style={{ color: ACCENT }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.1em", marginBottom: 6 }}>ШАГ {i + 1}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}>{step.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* БЫСТРЫЙ РЕЗУЛЬТАТ */}
        <section style={{ paddingTop: 80, paddingBottom: 80, background: ACCENT_LIGHT }}>
          <div className="audit-section">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <FadeIn>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏱</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
                  Результат уже в течение 1 часа
                </h2>
              </FadeIn>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
                {["Без теории и лекций", "Без долгого внедрения", "Сразу цифры и понимание"].map((t, i) => (
                  <FadeIn key={i} delay={i * 80}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 700, color: ACCENT, fontSize: 15, boxShadow: "0 4px 16px rgba(14,116,144,0.1)" }}>
                      ✓ {t}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ДО / ПОСЛЕ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="audit-section">
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40, textAlign: "center" }}>
                Пример результата
              </h2>
            </FadeIn>
            <div className="audit-grid-2" style={{ gap: 20, maxWidth: 760, margin: "0 auto 40px" }}>
              <FadeIn delay={100}>
                <div style={{ background: "#f1f5f9", borderRadius: 20, padding: "36px 32px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8", marginBottom: 16, textTransform: "uppercase" }}>До аудита</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#64748b" }}>2 000 ₽</div>
                  <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 8 }}>средний чек</div>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div style={{ background: "linear-gradient(135deg, #ecfeff, #cffafe)", border: "2px solid " + ACCENT, borderRadius: 20, padding: "36px 32px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: ACCENT, marginBottom: 16, textTransform: "uppercase" }}>Потенциал</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: ACCENT }}>6–8 000 ₽</div>
                  <div style={{ color: "#0e7490", fontSize: 14, marginTop: 8 }}>средний чек</div>
                  <div style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 16, borderRadius: 8, padding: "8px 16px", marginTop: 16 }}>
                    👉 Рост +200–300%
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ДЛЯ КОГО */}
        <section style={{ paddingTop: 80, paddingBottom: 80, background: "#fff" }}>
          <div className="audit-section">
            <div className="audit-grid-2" style={{ alignItems: "center" }}>
              <FadeIn>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Для кого аудит
                </h2>
              </FadeIn>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {forWhom.map((item, i) => (
                  <FadeIn key={i} delay={i * 70}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "#374151" }}>
                      <Icon name="CheckCircle" size={20} style={{ color: ACCENT, flexShrink: 0 }} />
                      {item}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ПОСЛЕ АУДИТА */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="audit-section">
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40 }}>
                Что вы сможете сделать
              </h2>
            </FadeIn>
            <div className="audit-grid-2" style={{ gap: 16 }}>
              {afterAudit.map((item, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                    <Icon name="TrendingUp" size={22} style={{ color: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{item}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* СТОИМОСТЬ */}
        <section style={{ paddingTop: 80, paddingBottom: 80, background: "#0e2a3a" }}>
          <div className="audit-section" style={{ textAlign: "center" }}>
            <FadeIn>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Стоимость
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 18, marginBottom: 40 }}>
                Рассчитывается индивидуально — под размер и специфику вашего салона
              </p>
              <CTAButton href="#audit-form">👉 Оставить заявку</CTAButton>
            </FadeIn>
          </div>
        </section>

        {/* ФОРМА */}
        <section id="audit-form" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="audit-section">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="audit-grid-2">
              <FadeIn>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
                  Получить аудит
                </h2>
                <p style={{ color: "#666", fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                  Оставьте заявку — свяжемся в течение 2 часов и договоримся об удобном времени.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Аудит длится 1 час", "Результат — конкретные цифры", "Без обязательств и доплат"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#374151" }}>
                      <Icon name="Check" size={16} style={{ color: ACCENT }} />
                      {t}
                    </div>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={150}>
                <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}>
                  <AuditForm />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ФИНАЛЬНЫЙ ДОЖИМ */}
        <section style={{ paddingTop: 80, paddingBottom: 100, background: "#0a1628" }}>
          <div className="audit-section" style={{ textAlign: "center" }}>
            <FadeIn>
              <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>
                Вы можете продолжать работать как есть<br />
                и терять деньги каждый день.<br /><br />
                Или за 1 час увидеть реальную картину<br />
                и начать зарабатывать больше.
              </p>
              <div style={{ border: "1.5px solid rgba(14,116,144,0.5)", borderRadius: 20, padding: "32px 40px", display: "inline-block", marginBottom: 48, maxWidth: 580 }}>
                <p style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#fff", lineHeight: 1.5, margin: 0 }}>
                  Деньги уже есть в вашем салоне.<br />
                  <span style={{ color: "#22d3ee" }}>Вопрос — забираете вы их или нет.</span>
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <CTAButton href="#audit-form">👉 Узнать потери бесплатно</CTAButton>
            </FadeIn>
          </div>
        </section>
      </div>
    </SimpleLayout>
  );
}