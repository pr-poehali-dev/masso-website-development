import { useEffect, useRef, useState } from "react";

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

export default function DokDialog() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 64,
            alignItems: "center",
          }}>

            {/* Left */}
            <div>
              <FadeIn delay={0}>
                <div style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "hsl(185, 85%, 32%)",
                  marginBottom: 20,
                }}>
                  Образовательная платформа
                </div>
              </FadeIn>

              <FadeIn delay={100}>
                <h1 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(44px, 5vw, 64px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "#1a1a1a",
                  marginBottom: 32,
                  letterSpacing: "-0.5px",
                }}>
                  Dok{" "}
                  <span style={{ color: "hsl(185, 85%, 32%)" }}>Диалог</span>
                </h1>
              </FadeIn>

              <FadeIn delay={200}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
                  <p style={{ fontSize: 18, lineHeight: 1.75, color: "#3a3a3a", margin: 0 }}>
                    Dok Диалог — <strong>образовательная платформа</strong> для{" "}
                    <strong>специалистов</strong> системы <strong>МассоПро</strong>.
                  </p>
                  <p style={{ fontSize: 17, lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Платформа объединяет обучение, профессиональное сообщество и базу знаний для мастеров салонов и студий массажа.
                  </p>
                  <p style={{ fontSize: 17, lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Доступ к платформе получают специалисты салонов, подключённых к системе МассоПро.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                <a
                  href="https://massopro.ru"
                  style={{
                    display: "inline-block",
                    background: "hsl(185, 85%, 32%)",
                    color: "#fff",
                    padding: "16px 32px",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                    boxShadow: "0 4px 20px hsla(185, 85%, 32%, 0.3)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "hsl(185, 85%, 26%)";
                    el.style.boxShadow = "0 8px 32px hsla(185, 85%, 32%, 0.45)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "hsl(185, 85%, 32%)";
                    el.style.boxShadow = "0 4px 20px hsla(185, 85%, 32%, 0.3)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  Получить консультацию по подключению салона
                </a>
                <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: "#999", lineHeight: 1.5 }}>
                  Доступ предоставляется только специалистам салонов
                </p>
              </FadeIn>
            </div>

            {/* Right — image */}
            <FadeIn delay={150}>
              <div style={{
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
                aspectRatio: "4/5",
              }}>
                <img
                  src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/eb14bab8-7443-476d-b998-e554ced72794.jpg"
                  alt="Специалист Dok Диалог"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}>
            {[
              { icon: "📚", title: "Обучение", text: "Структурированные курсы и программы для мастеров массажа" },
              { icon: "👥", title: "Сообщество", text: "Профессиональная сеть специалистов со всей России" },
              { icon: "🗂️", title: "База знаний", text: "Методические материалы, протоколы и рекомендации" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "36px 32px",
                    boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    cursor: "default",
                    height: "100%",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 2px 24px rgba(0,0,0,0.06)";
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{item.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.65, color: "#6a6a6a" }}>{item.text}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
