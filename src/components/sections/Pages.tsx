import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  AnimatedSection,
  CTAButton,
  OutlineButton,
  StatBadge,
  FeatureCard,
  StepCard,
  ProblemCard,
  Page,
} from "@/components/ui/shared";

// ─── ConsultForm ──────────────────────────────────────────────────────────────

function ConsultForm() {
  const [form, setForm] = useState({ city: "", salon: "", hasМassage: "", masters: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 glow-cyan">
          <Icon name="Check" size={28} style={{ color: "hsl(220, 30%, 6%)" }} />
        </div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground text-sm">Мы свяжемся с вами в течение 24 часов</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Город</label>
          <input
            type="text"
            placeholder="Москва"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Название салона</label>
          <input
            type="text"
            placeholder="Название вашего салона"
            value={form.salon}
            onChange={e => setForm(f => ({ ...f, salon: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Есть ли массаж в меню?</label>
        <select
          value={form.hasМassage}
          onChange={e => setForm(f => ({ ...f, hasМassage: e.target.value }))}
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
        >
          <option value="" className="bg-background">Выберите вариант</option>
          <option value="yes" className="bg-background">Да, уже есть</option>
          <option value="no" className="bg-background">Нет, хотим добавить</option>
          <option value="partial" className="bg-background">Частично</option>
        </select>
      </div>
      <div>
        <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Количество мастеров</label>
        <input
          type="number"
          placeholder="5"
          value={form.masters}
          onChange={e => setForm(f => ({ ...f, masters: e.target.value }))}
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <CTAButton large>Отправить заявку</CTAButton>
    </form>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">{tag}</div>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">{title}</h2>
    </div>
  );
}

// ─── PageHome ─────────────────────────────────────────────────────────────────

export function PageHome({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-48 md:w-64 h-48 md:h-64 rounded-full bg-primary/8 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(185,85%,45%)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 md:mb-8 animate-fadeInUp">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-body font-semibold uppercase tracking-widest">Профессиональный стандарт</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] mb-4 md:mb-6 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">Массо</span>
              <span className="gradient-text">ПРО</span>
            </h1>

            <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/70 font-light mb-3 md:mb-4 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              Профессиональный массаж для салонов и студий
            </p>

            <p className="font-body text-sm sm:text-base text-muted-foreground max-w-xl mb-8 md:mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              Внедряем новые услуги, обучаем мастеров, повышаем статус и прибыльность вашего салона
            </p>

            <div className="flex flex-wrap gap-3 mb-10 md:mb-14 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
              <CTAButton large onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
              <OutlineButton onClick={() => onNavigate("how")}>Как это работает</OutlineButton>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xs sm:max-w-sm md:max-w-lg animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
              <StatBadge value="25%" label="рост среднего чека" />
              <StatBadge value="4 шага" label="до старта" />
              <StatBadge value="100%" label="под ключ" />
            </div>
          </div>
        </div>

        <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-8 flex items-center gap-2 animate-bounce">
          <span className="text-muted-foreground text-xs font-body hidden sm:block">Скролл вниз</span>
          <Icon name="ChevronDown" size={16} className="text-primary" />
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 md:py-24 gradient-section">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <SectionHeader tag="Проблема рынка" title="Массаж в салонах — без единого стандарта" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: "Shuffle", text: "Разные техники массажа у каждого мастера — клиент не знает, что получит" },
              { icon: "Users", text: "Мастера работают по собственным методикам без единых протоколов качества" },
              { icon: "TrendingDown", text: "Клиенты не доверяют массажу в салоне — прибыль от услуги занижена" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <ProblemCard icon={item.icon} text={item.text} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <SectionHeader tag="Наше решение" title="Полная экосистема для вашего салона" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "GraduationCap", title: "Офлайн-обучение", desc: "Практическое обучение мастеров в вашем салоне по единым стандартам МассоПРО" },
              { icon: "Monitor", title: "Онлайн-курсы", desc: "Доступ к полной базе курсов и видеоуроков для постоянного развития мастеров" },
              { icon: "Video", title: "Вебинары и чат", desc: "Регулярные вебинары с экспертами и закрытый чат для вопросов и поддержки" },
              { icon: "FileText", title: "Готовые протоколы", desc: "Подробные инструкции по каждой процедуре — мастер знает каждый шаг" },
              { icon: "Award", title: "Сертификация", desc: "Официальный знак качества МассоПРО повышает доверие клиентов к вашему салону" },
              { icon: "MapPin", title: "Каталог студий", desc: "Размещение в каталоге сертифицированных салонов — новые клиенты сами вас найдут" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <FeatureCard {...item} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24 gradient-section">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <SectionHeader tag="Процесс" title="4 шага до профессионального массажа" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { number: "1", title: "Диагностика салона", desc: "Анализируем текущие услуги, состав команды и потенциал для развития массажного направления" },
              { number: "2", title: "Подбор и внедрение", desc: "Выбираем оптимальные процедуры, адаптируем под ваш формат и уровень клиентов" },
              { number: "3", title: "Обучение мастеров", desc: "Офлайн-обучение, онлайн-курсы, вебинары и постоянная поддержка в чате" },
              { number: "4", title: "Сертификация и каталог", desc: "Получаете знак качества и размещение в каталоге сертифицированных студий" },
            ].map((step, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <StepCard {...step} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <SectionHeader tag="Результаты" title="Что получает ваш салон" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "TrendingUp", title: "Новые прибыльные услуги", desc: "Расширяете меню востребованными процедурами без хаоса и ошибок" },
              { icon: "CheckSquare", title: "Единые стандарты", desc: "Все мастера работают по одним протоколам — клиенты всегда знают, что получат" },
              { icon: "Zap", title: "Лёгкое обучение", desc: "Мы берём на себя весь процесс: от теории до практики в вашем салоне" },
              { icon: "Users", title: "Сообщество мастеров", desc: "Доступ в закрытое сообщество профессионалов для обмена опытом и идеями" },
              { icon: "Star", title: "Доверие клиентов", desc: "Знак сертификации МассоПРО — видимый сигнал профессионализма для гостей" },
              { icon: "BarChart3", title: "Рост среднего чека", desc: "Партнёры МассоПРО увеличивают выручку от массажа в среднем на 25%" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <FeatureCard {...item} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section className="py-16 md:py-24 gradient-section">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-8 md:mb-10">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Начать сотрудничество</div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
                  Оставьте заявку на консультацию
                </h2>
                <p className="text-muted-foreground font-body text-sm">Ответим в течение 24 часов и подберём оптимальный формат для вашего салона</p>
              </div>
              <div className="gradient-card rounded-3xl p-6 sm:p-8 glow-cyan">
                <ConsultForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PageHow ──────────────────────────────────────────────────────────────────

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
            <CTAButton large onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

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
            <SectionHeader tag="Пакеты" title="Пакеты внедрения" />
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

export function PageCatalog() {
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
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 md:mb-8">
              Каталог сертифицированных студий откроется после формирования сети партнёрских салонов.
            </p>
            <div className="inline-flex items-center gap-3 bg-secondary border border-border rounded-2xl px-5 py-3 md:px-6 md:py-4">
              <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
              <span className="text-muted-foreground font-body text-sm">Будет доступен позже</span>
            </div>

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

// ─── PageAbout ────────────────────────────────────────────────────────────────

export function PageAbout({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">О нас</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              О <span className="gradient-text">проекте</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Создаём профессиональную систему массажа в России: обучение мастеров, внедрение стандартов и сертификация салонов.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-8 sm:p-10 md:p-16 mb-4 md:mb-6 glow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-5">Миссия</div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                    Профессиональный стандарт массажа — в каждом российском салоне
                  </h2>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    Мы верим, что профессиональный массаж должен быть доступен везде — не только в дорогих спа-отелях.
                    Наша миссия: создать сеть сертифицированных салонов с единым стандартом качества,
                    где клиент всегда знает, что получит отличный результат.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 md:mb-6">
              {[
                { icon: "Target", title: "Цель", desc: "Создать профессиональную экосистему массажа в российских салонах красоты и wellness-студиях" },
                { icon: "Eye", title: "Видение", desc: "Мир, где каждый клиент любого салона получает качественный профессиональный массаж" },
                { icon: "Heart", title: "Ценности", desc: "Качество, профессионализм, поддержка партнёров и непрерывное развитие мастеров" },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 150}>
                  <FeatureCard {...item} />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-6 sm:p-8 glow-card">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-5">Команда</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { role: "Основатель", exp: "15+ лет в индустрии красоты" },
                    { role: "Главный эксперт", exp: "Сертифицированный преподаватель массажа" },
                    { role: "Директор по развитию", exp: "Опыт работы с 50+ салонами" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl gradient-bg flex items-center justify-center shrink-0 glow-cyan">
                        <Icon name="User" size={22} style={{ color: "hsl(220, 30%, 6%)" }} />
                      </div>
                      <div>
                        <div className="text-foreground font-body font-semibold text-sm mb-1">{member.role}</div>
                        <div className="text-muted-foreground font-body text-xs leading-relaxed">{member.exp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 gradient-section">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Станьте частью МассоПРО</h2>
            <CTAButton large onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

// ─── PageContacts ─────────────────────────────────────────────────────────────

export function PageContacts() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Связаться</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              <span className="gradient-text">Контакты</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Ответим на все вопросы и поможем выбрать оптимальный формат сотрудничества для вашего салона.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-6 sm:p-8 h-full glow-card">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-6 md:mb-8">Напишите нам</h2>

                {sent ? (
                  <div className="text-center py-10 md:py-12">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 glow-cyan">
                      <Icon name="Check" size={28} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Сообщение отправлено!</h3>
                    <p className="text-muted-foreground text-sm font-body">Мы ответим в течение 24 часов</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div>
                      <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Ваше имя</label>
                      <input
                        type="text"
                        placeholder="Александр"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Телефон или Email</label>
                      <input
                        type="text"
                        placeholder="+7 (999) 000-00-00"
                        value={form.contact}
                        onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Сообщение</label>
                      <textarea
                        rows={4}
                        placeholder="Расскажите о вашем салоне..."
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <CTAButton large>Отправить сообщение</CTAButton>
                  </form>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 000-00-00", sub: "Пн–Пт, 9:00–18:00" },
                  { icon: "Mail", label: "Email", value: "info@massopro.ru", sub: "Ответим в течение 24ч" },
                  { icon: "MessageCircle", label: "Telegram", value: "@massopro", sub: "Быстрый ответ" },
                  { icon: "Instagram", label: "Instagram", value: "@massopro.ru", sub: "Кейсы и новости" },
                ].map((contact, i) => (
                  <div key={i} className="gradient-card rounded-2xl p-4 sm:p-5 flex items-start gap-4 glow-card">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                      <Icon name={contact.icon} fallback="Mail" size={20} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-0.5">{contact.label}</div>
                      <div className="text-foreground font-body font-semibold text-sm">{contact.value}</div>
                      <div className="text-muted-foreground text-xs font-body">{contact.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
