import { useState } from "react";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, ACCENT_SHADOW_HOVER, FadeIn } from "./partneryUtils";

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

export default function PartnerFormaSection() {
  return (
    <>
      <style>{`
        .pf-forma-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .pf-forma-left { padding: 56px 48px; }
        .pf-forma-right { padding: 56px 48px; }
        .pf-cabinet { padding: 48px 40px; }
        @media (max-width: 640px) {
          .pf-forma-grid { grid-template-columns: 1fr; }
          .pf-forma-left { padding: 32px 24px; }
          .pf-forma-right { padding: 32px 24px; }
          .pf-cabinet { padding: 32px 24px; }
        }
      `}</style>

      {/* Forma */}
      <section id="forma" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="pf-forma-grid">
              <div className="pf-forma-left" style={{ background: ACCENT, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>
                  Станьте партнёром<br />Dok Диалог
                </div>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 28 }}>
                  Оставьте заявку — мы свяжемся с вами, расскажем об условиях программы и выдадим ваш уникальный промокод.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    "Бесплатное подключение",
                    "Промокод с первого дня",
                    "Поддержка персонального менеджера",
                    "Выплаты без задержек",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pf-forma-right" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
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
      <section id="kabinet" style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <FadeIn>
            <div className="pf-cabinet" style={{ background: "#1a1a1a", borderRadius: 24, boxShadow: "0 16px 64px rgba(0,0,0,0.15)" }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Уже являетесь партнёром?
              </div>
              <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
                Войдите в личный кабинет, чтобы отслеживать активации промокода, начисленные комиссии и историю выплат.
              </p>
              <a
                href="#"
                style={{ display: "inline-block", background: "#fff", color: "#1a1a1a", padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.25s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.color = "#fff"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#fff"; el.style.color = "#1a1a1a"; el.style.transform = "translateY(0)"; }}
              >
                Войти в кабинет →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}