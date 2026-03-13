import Icon from "@/components/ui/icon";
import { AnimatedSection, CTAButton, Page } from "@/components/ui/shared";

// ─── PageSalons ───────────────────────────────────────────────────────────────

export function PageSalons({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Партнёрство</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              Для <span className="gradient-text">салонов</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              МассоПРО помогает внедрять массажные услуги, обучать мастеров и повышать статус салонов по всей России.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Пакеты</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">Пакеты внедрения</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                name: "Базовый",
                subtitle: "Старт",
                features: ["Офлайн-обучение мастеров", "Доступ к онлайн-курсам", "Базовые протоколы процедур", "Техподдержка в течение месяца"],
                accent: false,
              },
              {
                name: "Расширенный",
                subtitle: "Рекомендуем",
                features: ["Всё из Базового", "Готовые протоколы и инструкции", "Участие в вебинарах", "Закрытый чат с экспертами", "Поддержка 3 месяца"],
                accent: true,
              },
              {
                name: "Полный",
                subtitle: "Максимум",
                features: ["Всё из Расширенного", "Официальная сертификация", "Знак качества МассоПРО", "Размещение в каталоге студий", "Поддержка 6 месяцев"],
                accent: false,
              },
            ].map((pkg, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className={`rounded-3xl p-6 sm:p-8 h-full flex flex-col glow-card transition-all duration-300 ${pkg.accent ? "gradient-bg relative overflow-hidden" : "gradient-card"}`}>
                  {pkg.accent && (
                    <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider" style={{ background: "rgba(0,0,0,0.2)", color: "hsl(220, 30%, 6%)" }}>
                      Популярный
                    </div>
                  )}
                  <div className="mb-5">
                    <div className={`text-xs font-body font-semibold uppercase tracking-widest mb-2 ${pkg.accent ? "text-background/70" : "text-primary"}`} style={pkg.accent ? { color: "rgba(220,240,255,0.7)" } : {}}>{pkg.subtitle}</div>
                    <h3 className="font-display text-3xl font-bold" style={pkg.accent ? { color: "hsl(220, 30%, 6%)" } : {}}>{pkg.name}</h3>
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.accent ? "" : "bg-primary/20 border border-primary/40"}`} style={pkg.accent ? { background: "rgba(0,0,0,0.15)" } : {}}>
                          <Icon name="Check" size={11} className={pkg.accent ? "" : "text-primary"} style={pkg.accent ? { color: "hsl(220, 30%, 6%)" } : {}} />
                        </div>
                        <span className="text-sm font-body leading-snug" style={pkg.accent ? { color: "rgba(10,20,40,0.85)" } : { color: "hsl(210,40%,75%)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onNavigate("contacts")}
                    className="w-full rounded-xl py-3 text-sm font-body font-semibold transition-all duration-300"
                    style={pkg.accent
                      ? { background: "hsl(220, 30%, 6%)", color: "hsl(185, 85%, 45%)" }
                      : { border: "1px solid hsl(185,85%,45%,0.4)", color: "hsl(185, 85%, 45%)" }
                    }
                  >
                    Выбрать пакет
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Case */}
      <section className="py-16 md:py-24 gradient-section">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto gradient-card rounded-3xl p-8 sm:p-10 md:p-16 relative overflow-hidden glow-card">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-5">Кейс</div>
                <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-6">
                  «После внедрения МассоПРО средний чек салона вырос на{" "}
                  <span className="gradient-text">25%</span>, а возвратность клиентов увеличилась вдвое»
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center glow-cyan">
                    <Icon name="User" size={20} style={{ color: "hsl(220, 30%, 6%)" }} />
                  </div>
                  <div>
                    <div className="text-foreground font-body font-semibold text-sm">Партнёр МассоПРО</div>
                    <div className="text-muted-foreground font-body text-xs">Салон красоты, Москва</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Готовы стать партнёром?</h2>
            <CTAButton large onClick={() => onNavigate("contacts")}>Оставить заявку на консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

// ─── PageCatalog ──────────────────────────────────────────────────────────────

export function PageCatalog({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 gradient-hero min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 md:mb-8 glow-cyan animate-float">
              <Icon name="LayoutGrid" size={36} style={{ color: "hsl(220, 30%, 6%)" }} />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              Каталог <span className="gradient-text">студий</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-4">
              Каталог сертифицированных студий откроется после формирования сети партнёрских салонов.
            </p>
            <p className="font-body text-foreground font-semibold text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 md:mb-8">
              Мы подключаем ограниченное количество салонов в каждом городе — 3–5 студий на город.
            </p>
            <CTAButton onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="mb-4">
              Оставить заявку
            </CTAButton>

            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto opacity-25 pointer-events-none select-none">
              {["А", "Б", "В"].map((_, i) => (
                <div key={i} className="gradient-card rounded-2xl p-5 text-left">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 mb-3" />
                  <div className="h-3 bg-foreground/20 rounded mb-2" />
                  <div className="h-2 bg-foreground/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}