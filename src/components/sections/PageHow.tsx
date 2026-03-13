import Icon from "@/components/ui/icon";
import { AnimatedSection, CTAButton, Page } from "@/components/ui/shared";

export function PageHow({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Процесс</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              Как это <span className="gradient-text">работает</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              МассоПРО внедряет профессиональные массажные услуги в салонах под ключ, повышая качество процедур и прибыль салона.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {[
            {
              n: "1", title: "Диагностика салона",
              desc: "Проводим детальный анализ вашего бизнеса: текущие услуги, квалификацию мастеров, целевую аудиторию и конкурентную среду.",
              points: ["Анализ текущего меню услуг", "Оценка квалификации команды", "Исследование целевой аудитории", "Анализ конкурентов в районе"]
            },
            {
              n: "2", title: "Подбор и внедрение услуг",
              desc: "На основе диагностики выбираем оптимальные процедуры. Адаптируем протоколы под особенности вашего салона и ценовой сегмент.",
              points: ["Подбор релевантных техник", "Адаптация под формат салона", "Подготовка оборудования и материалов", "Создание меню и прайса"]
            },
            {
              n: "3", title: "Обучение мастеров",
              desc: "Комплексное обучение: практические занятия в вашем салоне, доступ к онлайн-курсам и регулярные вебинары со специалистами.",
              points: ["Офлайн-занятия в вашем салоне", "Доступ к онлайн-платформе курсов", "Еженедельные вебинары с экспертами", "Закрытый чат для вопросов и поддержки"]
            },
            {
              n: "4", title: "Сертификация и каталог",
              desc: "По завершении мастера проходят аттестацию. Салон получает официальный сертификат МассоПРО и размещение в каталоге.",
              points: ["Аттестация мастеров", "Выдача официального сертификата", "Знак качества МассоПРО", "Размещение в каталоге партнёров"]
            },
          ].map((step, i) => (
            <AnimatedSection key={i} delay={100} className="mb-4 md:mb-6">
              <div className="gradient-card rounded-3xl p-6 sm:p-8 md:p-10 glow-card">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center glow-cyan">
                      <span className="font-display text-2xl font-bold" style={{ color: "hsl(220, 30%, 6%)" }}>{step.n}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-primary text-xs font-body font-semibold uppercase tracking-widest mb-1">Шаг {step.n}</div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 md:mb-3">{step.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">{step.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.points.map((p, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                            <Icon name="Check" size={10} className="text-primary" />
                          </div>
                          <span className="text-foreground/70 text-xs font-body">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 gradient-section">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Готовы начать?</h2>
            <CTAButton large onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Получить консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}