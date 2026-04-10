import React, { useState } from "react";
import SimpleLayout from "@/components/layout/SimpleLayout";

const A = "#0e7490";
const URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {err: boolean}> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) return <div style={{padding:40,color:"red"}}>Ошибка рендера страницы</div>;
    return this.props.children;
  }
}

function Form() {
  const [f, setF] = useState({ name: "", phone: "", salon: "", city: "" });
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert("Дайте согласие на обработку данных");
    setLoading(true);
    try {
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salonName: f.salon, phone: f.phone, email: "audit@massopro.ru", package: "Аудит массажных услуг", contactName: f.name, city: f.city }),
      });
      setOk(true);
    } finally {
      setLoading(false);
    }
  };

  if (ok) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>Заявка принята!</div>
      <p style={{ color: "#666", marginTop: 8 }}>Свяжемся в течение 2 часов.</p>
    </div>
  );

  const inp: React.CSSProperties = { width: "100%", padding: "13px 16px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none", marginBottom: 12 };

  return (
    <form onSubmit={submit}>
      <input style={inp} placeholder="Ваше имя *" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
      <input style={inp} placeholder="Телефон *" required type="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
      <input style={inp} placeholder="Название салона *" required value={f.salon} onChange={e => setF({ ...f, salon: e.target.value })} />
      <input style={inp} placeholder="Город" value={f.city} onChange={e => setF({ ...f, city: e.target.value })} />
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
        <span style={{ fontSize: 12, color: "#888" }}>Согласен с <a href="/privacy" style={{ color: A }}>политикой конфиденциальности</a></span>
      </label>
      <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", background: loading ? "#aaa" : A, color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        {loading ? "Отправка..." : "👉 Получить аудит"}
      </button>
    </form>
  );
}

export default function Audit() {
  return (
    <ErrorBoundary>
      <SimpleLayout>
        <div style={{ background: "#f8f8f6", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>

          {/* HERO */}
          <section style={{ background: "linear-gradient(135deg,#0a1628,#0e2a3a,#0e7490)", padding: "100px 0 72px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <p style={{ color: "#67e8f9", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Аудит массажных услуг</p>
              <h1 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(30px,5vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20, maxWidth: 720 }}>
                Сколько денег вы теряете на каждом клиенте — не замечая этого?
              </h1>
              <p style={{ fontSize: "clamp(15px,2.5vw,19px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
                Покажем за 1 час скрытые потери в массажных услугах и точки роста выручки
              </p>
              <div style={{ marginBottom: 36 }}>
                {["Анализ всей цепочки клиента", "Выявление потерь в рублях", "Конкретные решения"].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: 15, marginBottom: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22d3ee", display: "inline-block", flexShrink: 0 }} />
                    {b}
                  </div>
                ))}
              </div>
              <a href="#audit-form" style={{ display: "inline-block", background: A, color: "#fff", padding: "15px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                👉 Узнать потери
              </a>
            </div>
          </section>

          {/* БОЛЬ */}
          <section style={{ padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, marginBottom: 36, maxWidth: 600 }}>
                Вы теряете деньги, даже если клиенты приходят
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  ["📵", "Клиентов не доводят до записи"],
                  ["🤷", "Не выявляют потребности клиента"],
                  ["🛒", "Не продают дополнительные услуги"],
                  ["👋", "Клиент не возвращается повторно"],
                ].map(([e, t], i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 28 }}>{e}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fef9c3", border: "1.5px solid #fbbf24", borderRadius: 12, padding: "18px 22px", fontWeight: 700, color: "#78350f" }}>
                👉 Потери происходят каждый день, но остаются незаметными
              </div>
            </div>
          </section>

          {/* ЦИФРЫ */}
          <section style={{ background: "#0e2a3a", padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
              <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>Сколько это в деньгах</h2>
              <p style={{ color: "#94a3b8", marginBottom: 40 }}>Если вы теряете 3 000 ₽ с одного клиента и в день проходит 10 человек:</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 40, maxWidth: 700, margin: "0 auto 40px" }}>
                <div style={{ background: "rgba(14,116,144,.2)", border: "1.5px solid rgba(14,116,144,.4)", borderRadius: 18, padding: "36px 24px" }}>
                  <div style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(42px,7vw,72px)", fontWeight: 700, color: "#22d3ee" }}>30 000 ₽</div>
                  <div style={{ color: "#94a3b8", marginTop: 8 }}>потери в день</div>
                </div>
                <div style={{ background: "rgba(220,38,38,.15)", border: "1.5px solid rgba(220,38,38,.35)", borderRadius: 18, padding: "36px 24px" }}>
                  <div style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(42px,7vw,72px)", fontWeight: 700, color: "#f87171" }}>900 000 ₽</div>
                  <div style={{ color: "#94a3b8", marginTop: 8 }}>потери в месяц</div>
                </div>
              </div>
              <a href="#audit-form" style={{ display: "inline-block", background: A, color: "#fff", padding: "15px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                👉 Проверить мой салон
              </a>
            </div>
          </section>

          {/* ЧТО ПОЛУЧИТЕ */}
          <section style={{ padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, marginBottom: 28 }}>Что вы получите</h2>
              {["Где именно теряются деньги", "Сколько теряется с каждого клиента", "Оценка работы персонала", "Потенциал роста выручки", "Конкретные действия для изменений"].map((r, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: "#ecfeff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: A, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontWeight: 600 }}>{r}</span>
                </div>
              ))}
            </div>
          </section>

          {/* КАК ПРОХОДИТ */}
          <section style={{ background: "#fff", padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, marginBottom: 40, textAlign: "center" }}>Как проходит аудит</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20 }}>
                {[["🔍","Анализ работы с клиентом"],["👥","Оценка действий персонала"],["⚠️","Выявление ошибок"],["💰","Перевод потерь в деньги"],["💡","Конкретные рекомендации"]].map(([e, t], i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: "#ecfeff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 26 }}>{e}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: A, letterSpacing: "0.1em", marginBottom: 4 }}>ШАГ {i + 1}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ДО/ПОСЛЕ */}
          <section style={{ padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, marginBottom: 36, textAlign: "center" }}>Пример результата</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, maxWidth: 680, margin: "0 auto" }}>
                <div style={{ background: "#f1f5f9", borderRadius: 18, padding: "32px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8", marginBottom: 12, textTransform: "uppercase" }}>До аудита</div>
                  <div style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, color: "#64748b" }}>2 000 ₽</div>
                  <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>средний чек</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#ecfeff,#cffafe)", border: "2px solid " + A, borderRadius: 18, padding: "32px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: A, marginBottom: 12, textTransform: "uppercase" }}>Потенциал</div>
                  <div style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, color: A }}>6–8 000 ₽</div>
                  <div style={{ color: A, fontSize: 13, marginTop: 6 }}>средний чек</div>
                  <div style={{ display: "inline-block", background: A, color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 8, padding: "7px 14px", marginTop: 14 }}>👉 Рост +200–300%</div>
                </div>
              </div>
            </div>
          </section>

          {/* СТОИМОСТЬ */}
          <section style={{ background: "#0e2a3a", padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
              <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>Стоимость</h2>
              <p style={{ color: "#94a3b8", fontSize: 17, marginBottom: 36 }}>Рассчитывается индивидуально — под размер и специфику вашего салона</p>
              <a href="#audit-form" style={{ display: "inline-block", background: A, color: "#fff", padding: "15px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                👉 Оставить заявку
              </a>
            </div>
          </section>

          {/* ФОРМА */}
          <section id="audit-form" style={{ padding: "72px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "start" }}>
                <div>
                  <h2 style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(24px,4vw,42px)", fontWeight: 700, marginBottom: 16 }}>Получить аудит</h2>
                  <p style={{ color: "#666", lineHeight: 1.7, marginBottom: 24 }}>Оставьте заявку — свяжемся в течение 2 часов.</p>
                  {["Аудит длится 1 час", "Результат — конкретные цифры", "Без обязательств и доплат"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#374151", marginBottom: 10 }}>
                      <span style={{ color: A, fontWeight: 700 }}>✓</span> {t}
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fff", borderRadius: 20, padding: "36px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}>
                  <Form />
                </div>
              </div>
            </div>
          </section>

          {/* ФИНАЛ */}
          <section style={{ background: "#0a1628", padding: "72px 0 96px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.9, marginBottom: 36 }}>
                Вы можете продолжать работать как есть и терять деньги каждый день.<br />
                Или за 1 час увидеть реальную картину и начать зарабатывать больше.
              </p>
              <div style={{ border: "1.5px solid rgba(14,116,144,.5)", borderRadius: 18, padding: "28px 36px", display: "inline-block", marginBottom: 40, maxWidth: 520 }}>
                <p style={{ fontFamily: "Cormorant,serif", fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, color: "#fff", lineHeight: 1.5, margin: 0 }}>
                  Деньги уже есть в вашем салоне.<br />
                  <span style={{ color: "#22d3ee" }}>Вопрос — забираете вы их или нет.</span>
                </p>
              </div>
              <br />
              <a href="#audit-form" style={{ display: "inline-block", background: A, color: "#fff", padding: "15px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                👉 Узнать потери бесплатно
              </a>
            </div>
          </section>

        </div>
      </SimpleLayout>
    </ErrorBoundary>
  );
}
