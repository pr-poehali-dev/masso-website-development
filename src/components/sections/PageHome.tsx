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

// ─── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">{tag}</div>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">{title}</h2>
    </div>
  );
}

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
        <p className="text-muted-foreground text-sm mb-6">Мы свяжемся с вами в течение 24 часов</p>
        <a
          href="/presentation"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all"
        >
          <Icon name="Play" size={18} />
          Посмотреть презентацию
        </a>
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
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 min-w-0">
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

            <div className="hidden lg:block flex-shrink-0 w-[420px] xl:w-[480px] animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              <div className="relative rounded-3xl overflow-hidden glow-card" style={{ aspectRatio: "3/4" }}>
                <img
                  src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/e74c7283-08f7-49f9-a8b6-0bdf51dad48f.jpg"
                  alt="Профессиональный массаж"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                      <Icon name="Star" size={14} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <div>
                      <div className="text-foreground text-xs font-body font-semibold">Сертифицированные мастера</div>
                      <div className="text-muted-foreground text-xs font-body">Обучены по единому стандарту</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-8 flex items-center gap-2 animate-bounce">
          <span className="text-muted-foreground text-xs font-body hidden sm:block">Узнать подробнее</span>
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
                <ProblemCard {...item} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <SectionHeader tag="Решение" title="Полная экосистема для вашего салона" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "Users", title: "Офлайн-обучение", desc: "Практическое обучение мастеров в вашем салоне по единым стандартам МассоПРО" },
              { icon: "Monitor", title: "Онлайн-курсы", desc: "Доступ к полной базе курсов и видеоуроков для постоянного развития мастеров" },
              { icon: "MessageCircle", title: "Вебинары и чат", desc: "Регулярные вебинары с экспертами и закрытый чат для вопросов и поддержки" },
              { icon: "FileText", title: "Готовые протоколы", desc: "Подробные инструкции по каждой процедуре — мастер знает каждый шаг" },
              { icon: "Award", title: "Сертификация", desc: "Официальный знак качества МассоПРО повышает доверие клиентов к салону" },
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