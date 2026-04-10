import { useState } from "react";
import { ACCENT, ACCENT_GLOW, ACCENT_BORDER, cardStyle, SEND_URL, FadeIn } from "./auditUtils";

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

export function AuditForWhom() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Для кого этот аудит
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
  );
}

export function AuditAfterActions() {
  return (
    <section className="gradient-section" style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 36 }}>
            <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Что вы сможете сделать
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
  );
}

export function AuditPricing() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <div style={{ ...cardStyle, border: `1px solid ${ACCENT_BORDER}`, padding: "48px 36px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
                <span style={{ marginRight: 6 }}>◆</span>Стоимость
              </div>
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
  );
}

export function AuditFormSection() {
  return (
    <section id="audit-form" className="gradient-section" style={{ padding: "80px 0" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 56, alignItems: "start", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <div>
              <h2 className="font-display" style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, marginBottom: 18 }}>
                <span style={{ color: ACCENT, marginRight: 12, fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>Получить аудит
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
  );
}

export function AuditClosing() {
  return (
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
  );
}
