import { useState } from "react";
import SimpleLayout from "@/components/layout/SimpleLayout";

const ACCENT = "hsl(185, 85%, 45%)";
const ACCENT_DARK = "hsl(185, 85%, 36%)";
const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

function AuditForm() {
  const [form, setForm] = useState({ name: "", phone: "", salon: "", city: "" });
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Необходимо дать согласие"); return; }
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
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <div className="font-display" style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 700, color: "hsl(210 40% 96%)", marginBottom: 12 }}>
          Заявка принята!
        </div>
        <p style={{ fontSize: 15, color: "hsl(215 20% 55%)", lineHeight: 1.65 }}>
          Свяжемся в течение 2 рабочих часов.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid hsl(220 20% 16%)",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "hsl(220 20% 14%)",
    color: "hsl(210 40% 96%)",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210 40% 96%)", marginBottom: 6 }}>Ваше имя *</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Иван Петров" required
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 20% 16%)")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210 40% 96%)", marginBottom: 6 }}>Телефон *</label>
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" required type="tel"
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 20% 16%)")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210 40% 96%)", marginBottom: 6 }}>Название салона *</label>
        <input value={form.salon} onChange={e => setForm({ ...form, salon: e.target.value })} placeholder="Студия релаксации" required
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 20% 16%)")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210 40% 96%)", marginBottom: 6 }}>Город</label>
        <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Москва"
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 20% 16%)")}
        />
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }}
        />
        <span style={{ fontSize: 12, color: "hsl(215 20% 55%)", lineHeight: 1.6 }}>
          Я согласен с{" "}
          <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
        </span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#f87171", textAlign: "center" }}>{error}</p>}
      <button type="submit" disabled={loading}
        style={{ background: ACCENT, color: "hsl(220 30% 6%)", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit" }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DARK; }}
        onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = ACCENT; }}
      >
        {loading ? "Отправляем..." : "Получить аудит"}
      </button>
    </form>
  );
}

export default function Audit() {
  return (
    <SimpleLayout>
      <div className="font-body" style={{ color: "hsl(210 40% 96%)", minHeight: "100vh" }}>

        {/* HERO */}
        <section className="gradient-section" style={{ padding: "80px 0 72px" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <p style={{ color: ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
              Аудит массажного салона
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(28px,5vw,54px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20, maxWidth: 720 }}>
              Сколько денег вы теряете каждый день — не замечая этого?
            </h1>
            <p style={{ fontSize: "clamp(15px,2.5vw,18px)", color: "hsl(215 20% 55%)", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
              За 1 час покажем скрытые потери в вашем салоне и дадим конкретный план роста выручки
            </p>
            <div style={{ marginBottom: 36 }}>
              {["Анализ всей цепочки клиента", "Выявление потерь в рублях", "Конкретные решения для вашего салона"].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "hsl(210 40% 85%)", fontSize: 15, marginBottom: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, display: "inline-block", flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
            <a href="#audit-form"
              className="inline-flex items-center h-11 px-6 rounded-xl text-sm font-semibold gradient-bg hover:opacity-90 transition-opacity"
              style={{ color: "hsl(220, 30%, 6%)", textDecoration: "none", fontSize: 16, fontWeight: 700, height: "auto", padding: "15px 32px" }}>
              Узнать потери →
            </a>
          </div>
        </section>

        {/* ПРОБЛЕМЫ */}
        <section style={{ padding: "72px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-display" style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, marginBottom: 36, maxWidth: 580 }}>
              Вы теряете деньги, даже если клиенты приходят
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                ["📵", "Клиентов не доводят до записи"],
                ["🤷", "Мастера не выявляют потребности"],
                ["🛒", "Никто не предлагает доп. услуги"],
                ["👋", "Клиент уходит и не возвращается"],
              ].map(([emoji, text], i) => (
                <div key={i} style={{ background: "hsl(220 25% 9%)", border: "1px solid hsl(220 20% 16%)", borderRadius: 16, padding: "20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 28 }}>{emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "hsl(40 60% 10%)", border: "1.5px solid hsl(40 70% 30%)", borderRadius: 12, padding: "18px 22px", fontWeight: 700, color: "hsl(40 80% 70%)" }}>
              ⚠️ Эти потери происходят каждый день, но остаются незаметными
            </div>
          </div>
        </section>

        {/* ЦИФРЫ */}
        <section className="gradient-section" style={{ padding: "72px 0" }}>
          <div className="container mx-auto px-4 sm:px-6" style={{ textAlign: "center" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, marginBottom: 12 }}>
              Сколько это в деньгах
            </h2>
            <p style={{ color: "hsl(215 20% 55%)", marginBottom: 40 }}>
              Если терять 3 000 ₽ с клиента при 10 посещениях в день:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 640, margin: "0 auto 40px" }}>
              <div style={{ background: "hsl(220 25% 9%)", border: "1.5px solid hsl(220 20% 16%)", borderRadius: 18, padding: "36px 24px" }}>
                <div className="font-display" style={{ fontSize: "clamp(36px,6vw,60px)", fontWeight: 700, color: ACCENT }}>30 000 ₽</div>
                <div style={{ color: "hsl(215 20% 55%)", marginTop: 8 }}>потери в день</div>
              </div>
              <div style={{ background: "hsl(0 30% 10%)", border: "1.5px solid hsl(0 40% 25%)", borderRadius: 18, padding: "36px 24px" }}>
                <div className="font-display" style={{ fontSize: "clamp(36px,6vw,60px)", fontWeight: 700, color: "#f87171" }}>900 000 ₽</div>
                <div style={{ color: "hsl(215 20% 55%)", marginTop: 8 }}>потери в месяц</div>
              </div>
            </div>
            <a href="#audit-form"
              className="inline-flex items-center gradient-bg hover:opacity-90 transition-opacity"
              style={{ color: "hsl(220, 30%, 6%)", textDecoration: "none", fontSize: 16, fontWeight: 700, padding: "15px 32px", borderRadius: 12 }}>
              Проверить мой салон →
            </a>
          </div>
        </section>

        {/* ЧТО ПОЛУЧИТЕ */}
        <section style={{ padding: "72px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-display" style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, marginBottom: 28 }}>
              Что вы получите
            </h2>
            {[
              "Где именно теряются деньги в вашем салоне",
              "Сколько рублей уходит с каждого клиента",
              "Оценку работы персонала по реальным критериям",
              "Потенциал роста выручки в цифрах",
              "Конкретные действия для изменений уже сегодня",
            ].map((r, i) => (
              <div key={i} style={{ background: "hsl(220 25% 9%)", border: "1px solid hsl(220 20% 16%)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: "hsl(185 85% 8%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: ACCENT, flexShrink: 0, fontSize: 14 }}>
                  {i + 1}
                </span>
                <span style={{ fontWeight: 600 }}>{r}</span>
              </div>
            ))}
          </div>
        </section>

        {/* КАК ПРОХОДИТ */}
        <section className="gradient-section" style={{ padding: "72px 0" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-display" style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, marginBottom: 40, textAlign: "center" }}>
              Как проходит аудит
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24 }}>
              {[
                ["🔍", "Анализ работы с клиентом"],
                ["👥", "Оценка действий персонала"],
                ["⚠️", "Выявление ошибок"],
                ["💰", "Перевод потерь в деньги"],
                ["💡", "Конкретные рекомендации"],
              ].map(([emoji, text], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "hsl(185 85% 8%)", border: "1px solid hsl(185 85% 20%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>
                    {emoji}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                    ШАГ {i + 1}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: "hsl(210 40% 75%)" }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ФОРМА */}
        <section id="audit-form" style={{ padding: "72px 0 96px" }}>
          <div className="container mx-auto px-4 sm:px-6">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "start" }}>
              <div>
                <h2 className="font-display" style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, marginBottom: 16 }}>
                  Получить аудит
                </h2>
                <p style={{ color: "hsl(215 20% 55%)", lineHeight: 1.7, marginBottom: 24 }}>
                  Оставьте заявку — свяжемся в течение 2 часов и договоримся об удобном времени.
                </p>
                {[
                  "Аудит проходит за 1 час",
                  "Результат — конкретные цифры потерь",
                  "Без скрытых обязательств",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "hsl(210 40% 85%)", marginBottom: 10 }}>
                    <span style={{ color: ACCENT, fontWeight: 700 }}>✓</span> {t}
                  </div>
                ))}
              </div>
              <div style={{ background: "hsl(220 25% 9%)", border: "1px solid hsl(220 20% 16%)", borderRadius: 20, padding: "36px" }}>
                <AuditForm />
              </div>
            </div>
          </div>
        </section>

      </div>
    </SimpleLayout>
  );
}
