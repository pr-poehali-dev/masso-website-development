import { AnimatedSection } from "@/components/ui/shared";

export default function DokDialog() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontFamily: "Montserrat, sans-serif",
        paddingTop: "40px",
      }}
    >
      {/* Hero */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div
              className="inline-block text-xs font-body font-semibold uppercase tracking-widest mb-6"
              style={{ color: "hsl(var(--primary))" }}
            >
              Образовательная платформа
            </div>
            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-8"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Док Диалог
            </h1>
            <div className="space-y-4 max-w-xl">
              <p
                className="font-body text-lg md:text-xl leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Образовательная платформа для специалистов системы МассоПро.
              </p>
              <p
                className="font-body text-base md:text-lg leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Платформа объединяет обучение, профессиональное сообщество и базу знаний для мастеров салонов и студий массажа.
              </p>
              <p
                className="font-body text-base md:text-lg leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Доступ к платформе получают специалисты салонов, подключённых к системе МассоПро.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
