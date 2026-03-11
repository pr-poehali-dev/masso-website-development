import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "how" | "salons" | "catalog" | "about" | "contacts";

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "how", label: "Как это работает" },
  { id: "salons", label: "Для салонов" },
  { id: "catalog", label: "Каталог студий" },
  { id: "about", label: "О проекте" },
  { id: "contacts", label: "Контакты" },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function CTAButton({ children, onClick, large = false }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 font-body gradient-bg rounded-full overflow-hidden group transition-all duration-300 hover:scale-105 animate-pulse-glow ${large ? "px-10 py-4 text-base" : "px-7 py-3 text-sm"}`}
      style={{ color: "hsl(220, 30%, 6%)" }}
    >
      <span className="relative z-10 font-semibold">{children}</span>
      <Icon name="ArrowRight" size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
    </button>
  );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 font-body font-semibold text-primary border border-primary/60 rounded-full px-7 py-3 text-sm hover:bg-primary/10 transition-all duration-300 hover:border-primary"
    >
      {children}
    </button>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="gradient-card rounded-2xl px-6 py-4 text-center glow-card">
      <div className="gradient-text font-display text-4xl font-bold">{value}</div>
      <div className="text-muted-foreground text-xs mt-1 font-body">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="gradient-card rounded-2xl p-6 glow-card cursor-default h-full">
      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
        <Icon name={icon} fallback="Star" size={22} style={{ color: "hsl(220, 30%, 6%)" }} />
      </div>
      <h3 className="font-body font-semibold text-foreground mb-2 text-base">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="relative gradient-card rounded-2xl p-8 glow-card">
      <div className="step-number absolute top-4 right-6">{number}</div>
      <div className="relative z-10">
        <div className="text-primary text-sm font-body font-semibold mb-2 uppercase tracking-widest">Шаг {number}</div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ProblemCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-4 gradient-card rounded-xl p-5 glow-card">
      <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
        <Icon name={icon} fallback="AlertCircle" size={18} className="text-destructive" />
      </div>
      <p className="text-foreground/80 text-sm leading-relaxed pt-1">{text}</p>
    </div>
  );
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

function PageHome({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/8 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-20 left-1/2 w-px h-40 bg-gradient-to-b from-primary/40 to-transparent" />
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

        <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fadeInUp">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-body font-semibold uppercase tracking-widest">Профессиональный стандарт</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.95] mb-6 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">Masso</span>
              <span className="gradient-text">PRO</span>
            </h1>

            <p className="font-display text-2xl md:text-3xl text-foreground/70 font-light mb-4 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              Профессиональный массаж для салонов и студий
            </p>

            <p className="font-body text-base text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              Внедряем новые услуги, обучаем мастеров, повышаем статус и прибыльность вашего салона
            </p>

            <div className="flex flex-wrap gap-4 mb-16 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
              <CTAButton large onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
              <OutlineButton onClick={() => onNavigate("how")}>Как это работает</OutlineButton>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-lg animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
              <StatBadge value="25%" label="рост среднего чека" />
              <StatBadge value="4 шага" label="до старта" />
              <StatBadge value="100%" label="под ключ" />
            </div>
          </div>
        </div>

        <div className="absolute right-8 bottom-8 flex items-center gap-2 animate-bounce">
          <span className="text-muted-foreground text-xs font-body">Скролл вниз</span>
          <Icon name="ChevronDown" size={16} className="text-primary" />
        </div>
      </section>

      <section className="py-24 gradient-section">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Проблема рынка</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
                Массаж в салонах — без единого стандарта
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
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

      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Наше решение</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
                Полная экосистема для вашего салона
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "GraduationCap", title: "Офлайн-обучение", desc: "Практическое обучение мастеров в вашем салоне по единым стандартам MassoPRO" },
              { icon: "Monitor", title: "Онлайн-курсы", desc: "Доступ к полной базе курсов и видеоуроков для постоянного развития мастеров" },
              { icon: "Video", title: "Вебинары и чат", desc: "Регулярные вебинары с экспертами и закрытый чат для вопросов и поддержки" },
              { icon: "FileText", title: "Готовые протоколы", desc: "Подробные инструкции по каждой процедуре — мастер знает каждый шаг" },
              { icon: "Award", title: "Сертификация", desc: "Официальный знак качества MassoPRO повышает доверие клиентов к вашему салону" },
              { icon: "MapPin", title: "Каталог студий", desc: "Размещение в каталоге сертифицированных салонов — новые клиенты сами вас найдут" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <FeatureCard {...item} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 gradient-section">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Процесс</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
                4 шага до профессионального массажа
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
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

      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Результаты</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
                Что получает ваш салон
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "TrendingUp", title: "Новые прибыльные услуги", desc: "Расширяете меню востребованными процедурами без хаоса и ошибок" },
              { icon: "CheckSquare", title: "Единые стандарты", desc: "Все мастера работают по одним протоколам — клиенты всегда знают, что получат" },
              { icon: "Zap", title: "Лёгкое обучение", desc: "Мы берём на себя весь процесс: от теории до практики в вашем салоне" },
              { icon: "Users", title: "Сообщество мастеров", desc: "Доступ в закрытое сообщество профессионалов для обмена опытом и идеями" },
              { icon: "Star", title: "Доверие клиентов", desc: "Знак сертификации MassoPRO — видимый сигнал профессионализма для гостей" },
              { icon: "BarChart3", title: "Рост среднего чека", desc: "Партнёры MassoPRO увеличивают выручку от массажа в среднем на 25%" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <FeatureCard {...item} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 gradient-section">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Начать сотрудничество</div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Оставьте заявку на консультацию
                </h2>
                <p className="text-muted-foreground font-body text-sm">Ответим в течение 24 часов и подберём оптимальный формат для вашего салона</p>
              </div>
              <div className="gradient-card rounded-3xl p-8 glow-cyan">
                <ConsultForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageHow({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Процесс</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              Как это <span className="gradient-text">работает</span>
            </h1>
            <p className="font-body text-muted-foreground text-base max-w-xl leading-relaxed">
              MassoPRO внедряет профессиональные массажные услуги в салонах под ключ, повышая качество процедур и прибыль салона.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {[
            {
              n: "1", title: "Диагностика салона",
              desc: "Проводим детальный анализ вашего бизнеса: текущие услуги, квалификацию мастеров, целевую аудиторию и конкурентную среду. Определяем потенциал для развития массажного направления.",
              points: ["Анализ текущего меню услуг", "Оценка квалификации команды", "Исследование целевой аудитории", "Анализ конкурентов в районе"]
            },
            {
              n: "2", title: "Подбор и внедрение услуг",
              desc: "На основе диагностики выбираем оптимальные процедуры для вашего формата. Адаптируем протоколы под особенности вашего салона и ценовой сегмент.",
              points: ["Подбор релевантных техник", "Адаптация под формат салона", "Подготовка оборудования и материалов", "Создание меню и прайса"]
            },
            {
              n: "3", title: "Обучение мастеров",
              desc: "Комплексное обучение включает практические занятия в вашем салоне, доступ к онлайн-курсам и регулярные вебинары с ведущими специалистами.",
              points: ["Офлайн-занятия в вашем салоне", "Доступ к онлайн-платформе курсов", "Еженедельные вебинары с экспертами", "Закрытый чат для вопросов и поддержки"]
            },
            {
              n: "4", title: "Сертификация и каталог",
              desc: "По завершении обучения мастера проходят аттестацию. Салон получает официальный сертификат MassoPRO и размещение в каталоге сертифицированных студий.",
              points: ["Аттестация мастеров", "Выдача официального сертификата", "Знак качества MassoPRO", "Размещение в каталоге партнёров"]
            },
          ].map((step, i) => (
            <AnimatedSection key={i} delay={100} className="mb-10">
              <div className="gradient-card rounded-3xl p-8 md:p-10 glow-card">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center glow-cyan">
                      <span className="font-display text-2xl font-bold" style={{ color: "hsl(220, 30%, 6%)" }}>{step.n}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-primary text-xs font-body font-semibold uppercase tracking-widest mb-2">Шаг {step.n}</div>
                    <h3 className="font-display text-3xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5">{step.desc}</p>
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

      <section className="py-16 gradient-section">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Готовы начать?</h2>
            <CTAButton large onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function PageSalons({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Партнёрство</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              Для <span className="gradient-text">салонов</span>
            </h1>
            <p className="font-body text-muted-foreground text-base max-w-xl leading-relaxed">
              MassoPRO помогает внедрять массажные услуги, обучать мастеров и повышать статус салонов по всей России.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Пакеты</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Пакеты внедрения</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                features: ["Всё из Расширенного", "Официальная сертификация", "Знак качества MassoPRO", "Размещение в каталоге студий", "Поддержка 6 месяцев"],
                accent: false,
              },
            ].map((pkg, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className={`rounded-3xl p-8 h-full flex flex-col glow-card transition-all duration-300 ${pkg.accent ? "gradient-bg relative overflow-hidden" : "gradient-card"}`}>
                  {pkg.accent && (
                    <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider" style={{ background: "rgba(0,0,0,0.2)", color: "hsl(220, 30%, 6%)" }}>
                      Популярный
                    </div>
                  )}
                  <div className="mb-6">
                    <div className={`text-xs font-body font-semibold uppercase tracking-widest mb-2 ${pkg.accent ? "text-background/70" : "text-primary"}`} style={pkg.accent ? { color: "rgba(220,240,255,0.7)" } : {}}>{pkg.subtitle}</div>
                    <h3 className="font-display text-3xl font-bold" style={pkg.accent ? { color: "hsl(220, 30%, 6%)" } : {}}>{pkg.name}</h3>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
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

      <section className="py-24 gradient-section">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto gradient-card rounded-3xl p-10 md:p-16 relative overflow-hidden glow-card">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-6">Кейс</div>
                <blockquote className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-6">
                  «После внедрения MassoPRO средний чек салона вырос на{" "}
                  <span className="gradient-text">25%</span>, а возвратность клиентов увеличилась вдвое»
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center glow-cyan">
                    <Icon name="User" size={20} style={{ color: "hsl(220, 30%, 6%)" }} />
                  </div>
                  <div>
                    <div className="text-foreground font-body font-semibold text-sm">Партнёр MassoPRO</div>
                    <div className="text-muted-foreground font-body text-xs">Салон красоты, Москва</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Готовы стать партнёром?</h2>
            <CTAButton large onClick={() => onNavigate("contacts")}>Оставить заявку на консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function PageCatalog() {
  return (
    <div>
      <section className="pt-32 pb-24 gradient-hero min-h-screen flex items-center">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-8 glow-cyan animate-float">
              <Icon name="LayoutGrid" size={40} style={{ color: "hsl(220, 30%, 6%)" }} />
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              Каталог <span className="gradient-text">студий</span>
            </h1>
            <p className="font-body text-muted-foreground text-base max-w-lg mx-auto leading-relaxed mb-8">
              Каталог сертифицированных студий откроется после формирования сети партнёрских салонов.
            </p>
            <div className="inline-flex items-center gap-3 bg-secondary border border-border rounded-2xl px-6 py-4">
              <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
              <span className="text-muted-foreground font-body text-sm">Будет доступен позже</span>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto opacity-25 pointer-events-none select-none">
              {["Студия А", "Студия Б", "Студия В"].map((_, i) => (
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

function PageAbout({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">О нас</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              О <span className="gradient-text">проекте</span>
            </h1>
            <p className="font-body text-muted-foreground text-base max-w-xl leading-relaxed">
              Создаём профессиональную систему массажа в России: обучение мастеров, внедрение стандартов и сертификация салонов.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-10 md:p-16 mb-8 glow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-6">Миссия</div>
                  <h2 className="font-display text-4xl font-semibold text-foreground mb-6 leading-tight">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
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
              <div className="gradient-card rounded-3xl p-8 glow-card">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-6">Команда</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { role: "Основатель", exp: "15+ лет в индустрии красоты" },
                    { role: "Главный эксперт", exp: "Сертифицированный преподаватель массажа" },
                    { role: "Директор по развитию", exp: "Опыт работы с 50+ салонами" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shrink-0 glow-cyan">
                        <Icon name="User" size={24} style={{ color: "hsl(220, 30%, 6%)" }} />
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

      <section className="py-16 gradient-section">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Станьте частью MassoPRO</h2>
            <CTAButton large onClick={() => onNavigate("contacts")}>Получить консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function PageContacts() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4">Связаться</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              <span className="gradient-text">Контакты</span>
            </h1>
            <p className="font-body text-muted-foreground text-base max-w-xl leading-relaxed">
              Ответим на все вопросы и поможем выбрать оптимальный формат сотрудничества для вашего салона.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-8 h-full glow-card">
                <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Напишите нам</h2>

                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 glow-cyan">
                      <Icon name="Check" size={28} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Сообщение отправлено!</h3>
                    <p className="text-muted-foreground text-sm font-body">Мы ответим в течение 24 часов</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="space-y-5">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 000-00-00", sub: "Пн–Пт, 9:00–18:00" },
                  { icon: "Mail", label: "Email", value: "info@massopro.ru", sub: "Ответим в течение 24ч" },
                  { icon: "MessageCircle", label: "Telegram", value: "@massopro", sub: "Быстрый ответ" },
                  { icon: "Instagram", label: "Instagram", value: "@massopro.ru", sub: "Кейсы и новости" },
                ].map((contact, i) => (
                  <div key={i} className="gradient-card rounded-2xl p-5 flex items-start gap-4 glow-card">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
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

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages: Record<Page, React.ReactNode> = {
    home: <PageHome onNavigate={navigate} />,
    how: <PageHow onNavigate={navigate} />,
    salons: <PageSalons onNavigate={navigate} />,
    catalog: <PageCatalog />,
    about: <PageAbout onNavigate={navigate} />,
    contacts: <PageContacts />,
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20" : "bg-transparent"}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={() => navigate("home")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Waves" size={16} style={{ color: "hsl(220, 30%, 6%)" }} />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Masso<span className="gradient-text">PRO</span>
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-7">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`nav-link font-body text-sm transition-colors ${currentPage === item.id ? "text-primary active" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:block">
              <CTAButton onClick={() => navigate("contacts")}>Консультация</CTAButton>
            </div>

            <button
              className="lg:hidden text-foreground p-2"
              onClick={() => setMobileOpen(o => !o)}
            >
              <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border py-4">
            <div className="container mx-auto px-6 space-y-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-colors ${currentPage === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3">
                <CTAButton onClick={() => navigate("contacts")}>Получить консультацию</CTAButton>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>{pages[currentPage]}</main>

      <footer className="border-t border-border py-12 gradient-section">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                  <Icon name="Waves" size={14} style={{ color: "hsl(220, 30%, 6%)" }} />
                </div>
                <span className="font-display text-lg font-bold text-foreground">
                  Masso<span className="gradient-text">PRO</span>
                </span>
              </div>
              <p className="text-muted-foreground text-xs font-body max-w-xs leading-relaxed">
                Профессиональный стандарт массажа для салонов и студий по всей России
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className="text-muted-foreground hover:text-primary font-body text-xs transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground text-xs font-body">
            © 2026 MassoPRO. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}