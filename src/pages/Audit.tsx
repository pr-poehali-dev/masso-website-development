import { useState } from "react";
import SimpleLayout from "@/components/layout/SimpleLayout";

const ACCENT = "#0e7490";
const ACCENT_LIGHT = "#ecfeff";
const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

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
      setError("Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    border: "1.5px solid #e5e7eb", borderRadius: 12,
    fontSize: 15, fontFamily: "Montserrat, sans-serif",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
          Заявка принята!
        </div>
        <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6 }}>
          Свяжемся в течение 2 часов и договоримся о времени аудита.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input style={inp} placeholder="Ваше имя *" value={name} onChange={e => setName(e.target.value)} required />
      <input style={inp} placeholder="Телефон *" value={phone} onChange={e => setPhone(e.target.value)} required type="tel" />
      <input style={inp} placeholder="Название салона *" value={salonName} onChange={e => setSalonName(e.target.value)} required />
      <input style={inp} placeholder="Город" value={city} onChange={e => setCity(e.target.value)} />
      {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: ACCENT, width: 16, height: 16 }} />
        <span style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
          Согласен с{" "}
          <a href="/privacy" style={{ color: ACCENT }}>политикой конфиденциальности</a>
        </span>
      </label>
      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#9ca3af" : ACCENT, color: "#fff",
          border: "none", padding: "16px", borderRadius: 12,
          fontSize: 16, fontWeight: 700, cursor: loading ? "default" : "pointer",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {loading ? "Отправка..." : "👉 Получить аудит"}
      </button>
    </form>
  );
}

export default function Audit() {
  return (
    <SimpleLayout>
      <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>
        <style>{`
          .as { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
          .ag2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .ag5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
          @media (max-width: 900px) { .ag5 { grid-template-columns: repeat(3, 1fr); } }
          @media (max-width: 640px) { .ag2 { grid-template-columns: 1fr; } .ag5 { grid-template-columns: 1fr 1fr; } }
        `}</style>

        {/* HERO */}
        <section style={{ paddingTop: 120, paddingBottom: 80, background: "linear-gradient(135deg, #0a1628 0%, #0e2a3a 60%, #0e7490 100%)" }}>
          <div className="as">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#67e8f9", marginBottom: 20 }}>
              Аудит массажных услуг
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: 20, maxWidth: 760 }}>
              Сколько денег вы теряете на каждом клиенте — не замечая этого?
            </h1>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
              Покажем за 1 час скрытые потери в массажных услугах и точки роста выручки
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {["Анализ всей цепочки клиента", "Выявление потерь в рублях", "Конкретные решения"].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: 15 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22d3ee", flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
            <CTAButton href="#audit-form">👉 Узнать потери</CTAButton>
          </div>
        </section>

        {/* БОЛЬ */}
        <section style={{ padding: "80px 0" }}>
          <div className="as">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40, maxWidth: 640 }}>
              Вы теряете деньги, даже если клиенты приходят
            </h2>
            <div className="ag2" style={{ marginBottom: 32 }}>
              {[
                { e: "📵", t: "Клиентов не доводят до записи" },
                { e: "🤷", t: "Не выявляют потребности клиента" },
                { e: "🛒", t: "Не предлагают дополнительные услуги" },
                { e: "👋", t: "Клиент не возвращается повторно" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{item.e}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}>{item.t}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fef9c3", border: "1.5px solid #fbbf24", borderRadius: 14, padding: "20px 24px", fontSize: 16, fontWeight: 700, color: "#78350f" }}>
              👉 Потери происходят каждый день, но остаются незаметными
            </div>
          </div>
        </section>

        {/* МАСШТАБ ПОТЕРЬ */}
        <section style={{ padding: "80px 0", background: "#0e2a3a" }}>
          <div className="as">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 12, textAlign: "center" }}>
              Сколько это в деньгах
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 16, textAlign: "center", marginBottom: 40 }}>
              Если вы теряете 3 000 ₽ с одного клиента и в день проходит 10 человек:
            </p>
            <div className="ag2" style={{ marginBottom: 40 }}>
              <div style={{ background: "rgba(14,116,144,0.2)", border: "1.5px solid rgba(14,116,144,0.4)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 700, color: "#22d3ee", lineHeight: 1 }}>30 000 ₽</div>
                <div style={{ color: "#94a3b8", fontSize: 16, marginTop: 12 }}>потери в день</div>
              </div>
              <div style={{ background: "rgba(220,38,38,0.15)", border: "1.5px solid rgba(220,38,38,0.35)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 700, color: "#f87171", lineHeight: 1 }}>900 000 ₽</div>
                <div style={{ color: "#94a3b8", fontSize: 16, marginTop: 12 }}>потери в месяц</div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <CTAButton href="#audit-form">👉 Проверить мой салон</CTAButton>
            </div>
          </div>
        </section>

        {/* ЧТО ПОЛУЧИТЕ */}
        <section style={{ padding: "80px 0" }}>
          <div className="as">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
              Что вы получите
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Где именно теряются деньги",
                "Сколько теряется с каждого клиента",
                "Оценка работы персонала",
                "Потенциал роста выручки",
                "Конкретные действия для изменений",
              ].map((r, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Cormorant, serif", fontWeight: 700, color: ACCENT, fontSize: 18 }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* КАК ПРОХОДИТ */}
        <section style={{ padding: "80px 0", background: "#fff" }}>
          <div className="as">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40, textAlign: "center" }}>
              Как проходит аудит
            </h2>
            <div className="ag5">
              {[
                { e: "🔍", t: "Анализ работы с клиентом" },
                { e: "👥", t: "Оценка действий персонала" },
                { e: "⚠️", t: "Выявление ошибок" },
                { e: "💰", t: "Перевод потерь в деньги" },
                { e: "💡", t: "Конкретные рекомендации" },
              ].map((step, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28 }}>
                    {step.e}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.1em", marginBottom: 6 }}>ШАГ {i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}>{step.t}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* БЫСТРЫЙ РЕЗУЛЬТАТ */}
        <section style={{ padding: "80px 0", background: ACCENT_LIGHT }}>
          <div className="as" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏱</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
              Результат уже в течение 1 часа
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
              {["Без теории и лекций", "Без долгого внедрения", "Сразу цифры и понимание"].map((t, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 700, color: ACCENT, fontSize: 15, boxShadow: "0 4px 16px rgba(14,116,144,0.1)" }}>
                  ✓ {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ДО / ПОСЛЕ */}
        <section style={{ padding: "80px 0" }}>
          <div className="as">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40, textAlign: "center" }}>
              Пример результата
            </h2>
            <div className="ag2" style={{ maxWidth: 760, margin: "0 auto 40px" }}>
              <div style={{ background: "#f1f5f9", borderRadius: 20, padding: "36px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8", marginBottom: 16, textTransform: "uppercase" }}>До аудита</div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#64748b" }}>2 000 ₽</div>
                <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 8 }}>средний чек</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #ecfeff, #cffafe)", border: "2px solid " + ACCENT, borderRadius: 20, padding: "36px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: ACCENT, marginBottom: 16, textTransform: "uppercase" }}>Потенциал</div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: ACCENT }}>6–8 000 ₽</div>
                <div style={{ color: "#0e7490", fontSize: 14, marginTop: 8 }}>средний чек</div>
                <div style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 8, padding: "8px 16px", marginTop: 16 }}>
                  👉 Рост +200–300%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ДЛЯ КОГО */}
        <section style={{ padding: "80px 0", background: "#fff" }}>
          <div className="as">
            <div className="ag2" style={{ alignItems: "center" }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a" }}>
                Для кого аудит
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Салоны с массажными услугами",
                  "Есть клиенты, но выручка не растёт",
                  "Нет контроля продаж и допуслуг",
                  "Низкий средний чек",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "#374151" }}>
                    <span style={{ color: ACCENT, fontSize: 18 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ПОСЛЕ АУДИТА */}
        <section style={{ padding: "80px 0" }}>
          <div className="as">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
              Что вы сможете сделать
            </h2>
            <div className="ag2">
              {[
                "Увеличить средний чек",
                "Внедрить новые техники продаж",
                "Повысить конверсию записи",
                "Вернуть клиентов, которые ушли",
              ].map((item, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 22, color: ACCENT }}>📈</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* СТОИМОСТЬ */}
        <section style={{ padding: "80px 0", background: "#0e2a3a" }}>
          <div className="as" style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Стоимость
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 18, marginBottom: 40 }}>
              Рассчитывается индивидуально — под размер и специфику вашего салона
            </p>
            <CTAButton href="#audit-form">👉 Оставить заявку</CTAButton>
          </div>
        </section>

        {/* ФОРМА */}
        <section id="audit-form" style={{ padding: "80px 0" }}>
          <div className="as">
            <div className="ag2" style={{ gap: 48, alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
                  Получить аудит
                </h2>
                <p style={{ color: "#666", fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                  Оставьте заявку — свяжемся в течение 2 часов и договоримся об удобном времени.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Аудит длится 1 час", "Результат — конкретные цифры", "Без обязательств и доплат"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#374151" }}>
                      <span style={{ color: ACCENT, fontWeight: 700 }}>✓</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}>
                <AuditForm />
              </div>
            </div>
          </div>
        </section>

        {/* ФИНАЛЬНЫЙ ДОЖИМ */}
        <section style={{ padding: "80px 0 100px", background: "#0a1628" }}>
          <div className="as" style={{ textAlign: "center" }}>
            <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>
              Вы можете продолжать работать как есть<br />
              и терять деньги каждый день.<br /><br />
              Или за 1 час увидеть реальную картину<br />
              и начать зарабатывать больше.
            </p>
            <div style={{ border: "1.5px solid rgba(14,116,144,0.5)", borderRadius: 20, padding: "32px 40px", display: "inline-block", marginBottom: 48, maxWidth: 560 }}>
              <p style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#fff", lineHeight: 1.5, margin: 0 }}>
                Деньги уже есть в вашем салоне.<br />
                <span style={{ color: "#22d3ee" }}>Вопрос — забираете вы их или нет.</span>
              </p>
            </div>
            <br />
            <CTAButton href="#audit-form">👉 Узнать потери бесплатно</CTAButton>
          </div>
        </section>
      </div>
    </SimpleLayout>
  );
}
