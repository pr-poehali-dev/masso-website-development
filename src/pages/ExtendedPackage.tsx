import { useState, useRef, useEffect } from "react";
import SimpleLayout from "@/components/layout/SimpleLayout";
import Icon from "@/components/ui/icon";

function useInView(threshold = 0.1) {
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

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  { icon: "GraduationCap", title: "Всё из Базового пакета", desc: "Офлайн-обучение мастеров, онлайн-курсы, базовые протоколы и месяц техподдержки — полностью включены." },
  { icon: "BookOpen", title: "Готовые протоколы и инструкции", desc: "Расширенная библиотека протоколов под разные форматы массажа. Инструкции для мастеров и администраторов." },
  { icon: "TrendingUp", title: "Обучение техникам продаж +25%", desc: "Практический курс: как предлагать услуги, повышать средний чек и удерживать клиентов." },
  { icon: "Video", title: "Участие в вебинарах", desc: "Регулярные живые сессии с экспертами МассоПРО: разбор кейсов, новые техники, ответы на вопросы." },
  { icon: "MessageCircle", title: "Закрытый чат с экспертами", desc: "Прямой доступ к экспертам МассоПРО. Ответы на вопросы мастеров и руководства — в течение дня." },
  { icon: "Shield", title: "Поддержка 3 месяца", desc: "Три месяца персонального сопровождения: корректировка стандартов и помощь в нестандартных ситуациях." },
];

const METRICS = [
  { label: "Мастеров", key: "masters", placeholder: "5" },
  { label: "Рабочих дней в месяц", key: "workDays", placeholder: "22" },
  { label: "Макс. клиентов/день на мастера", key: "maxClients", placeholder: "8" },
  { label: "Факт. клиентов/день на мастера", key: "factClients", placeholder: "5" },
  { label: "Средний чек, ₽", key: "avgCheck", placeholder: "3500" },
  { label: "Клиентов в месяц всего", key: "totalClients", placeholder: "550" },
  { label: "Возврат клиентов, %", key: "returnRate", placeholder: "40" },
  { label: "Целевой средний чек, ₽", key: "targetCheck", placeholder: "4500" },
  { label: "Плановая загрузка, %", key: "plannedLoad", placeholder: "80" },
  { label: "Новые мастера (+)", key: "newMasters", placeholder: "2" },
  { label: "Рост клиентов от ускорения, %", key: "clientGrowth", placeholder: "15" },
];

type FormData = { [key: string]: string };

function AnalysisForm() {
  const [form, setForm] = useState<FormData>({
    salonName: "", city: "", contactName: "", phone: "", email: "",
    masters: "", workDays: "", maxClients: "", factClients: "", avgCheck: "",
    totalClients: "", returnRate: "", targetCheck: "", plannedLoad: "", newMasters: "", clientGrowth: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.salonName || !form.phone || !form.email) { setError("Заполните название салона, телефон и email"); return; }
    setLoading(true); setError("");
    try {
      await new Promise(res => setTimeout(res, 800));
      setSent(true);
    } catch { setError("Ошибка отправки. Попробуйте ещё раз."); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-secondary border border-border rounded-xl px-3 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors";
  const labelCls = "block text-xs font-body font-semibold text-muted-foreground mb-1.5";

  if (sent) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={26} style={{ color: "hsl(220, 30%, 6%)" }} />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">Заявка принята!</h3>
        <p className="text-muted-foreground font-body text-sm leading-relaxed">
          Свяжемся с вами в течение рабочего дня.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Название салона *</label>
          <input className={inputCls} placeholder="Студия красоты «...»" value={form.salonName} onChange={set("salonName")} />
        </div>
        <div>
          <label className={labelCls}>Город</label>
          <input className={inputCls} placeholder="Москва" value={form.city} onChange={set("city")} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Контактное лицо</label>
        <input className={inputCls} placeholder="Имя и фамилия" value={form.contactName} onChange={set("contactName")} />
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Телефон *</label>
          <input className={inputCls} placeholder="+7 (___) ___-__-__" value={form.phone} onChange={set("phone")} type="tel" />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input className={inputCls} placeholder="salon@example.com" value={form.email} onChange={set("email")} type="email" />
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-body font-semibold text-muted-foreground">Показатели салона</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="text-xs font-body text-muted-foreground mb-3 leading-relaxed">
          Заполните что знаете — мы <span className="text-primary font-semibold">бесплатно рассчитаем</span>, что пакет даст вашему бизнесу.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map(m => (
            <div key={m.key}>
              <label className={labelCls}>{m.label}</label>
              <input className={inputCls} placeholder={m.placeholder} value={form[m.key]} onChange={set(m.key)} />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-destructive text-sm font-body">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 font-body gradient-bg rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ color: "hsl(220, 30%, 6%)" }}
      >
        {loading ? "Отправляем..." : "Получить бесплатный расчёт"}
        {!loading && <Icon name="ArrowRight" size={15} style={{ color: "hsl(220, 30%, 6%)" }} />}
      </button>
    </form>
  );
}

export default function ExtendedPackage() {
  return (
    <SimpleLayout>
      <div className="min-h-screen">

        {/* Hero */}
        <section className="relative py-12 sm:py-20 md:py-28 overflow-hidden gradient-hero">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-56 sm:w-96 h-56 sm:h-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-40 sm:w-64 h-40 sm:h-64 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-body font-semibold uppercase tracking-widest mb-4 sm:mb-6">
                  <Icon name="Star" size={12} />
                  Пакет «Расширенный» · Рекомендуем
                </div>
                <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
                  Полное внедрение за <span className="gradient-text">10 рабочих</span> дней
                </h1>
                <p className="text-muted-foreground font-body text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                  Глубокое внедрение стандартов, обучение продажам и три месяца поддержки. Наш самый популярный выбор.
                </p>
                <a
                  href="#form"
                  className="inline-flex items-center gap-2 font-body gradient-bg rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ color: "hsl(220, 30%, 6%)" }}
                >
                  Получить бесплатный расчёт
                  <Icon name="ArrowDown" size={15} style={{ color: "hsl(220, 30%, 6%)" }} />
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-10 sm:py-16 md:py-20 gradient-section">
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn className="text-center mb-7 sm:mb-10">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-2">Запуск</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">До 10 рабочих дней</h2>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto">
              {[
                { day: "1–2", title: "Аудит", desc: "Анализ показателей, знакомство с командой" },
                { day: "3–5", title: "Обучение", desc: "Офлайн-тренинг, подключение к платформе" },
                { day: "6–8", title: "Продажи", desc: "Тренинг техник продаж для команды" },
                { day: "9–10", title: "Запуск", desc: "Протоколы, чат, активация поддержки" },
              ].map((step, i) => (
                <FadeIn key={i} delay={i * 80} className="h-full">
                  <div className="gradient-card rounded-xl sm:rounded-2xl p-3 sm:p-5 glow-card text-center h-full flex flex-col">
                    <div className="inline-block gradient-bg rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-body font-bold mb-2" style={{ color: "hsl(220, 30%, 6%)" }}>
                      <span className="hidden sm:inline">День </span>{step.day}
                    </div>
                    <h3 className="font-display text-sm sm:text-lg md:text-xl font-bold text-foreground mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-xs font-body leading-relaxed flex-1 hidden sm:block">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-10 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <FadeIn className="text-center mb-7 sm:mb-10">
              <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-2">Состав пакета</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Что входит в Расширенный</h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 max-w-4xl mx-auto">
              {FEATURES.map((f, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div className="gradient-card rounded-2xl p-4 sm:p-6 md:p-8 glow-card h-full flex gap-3 sm:gap-5">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                      <Icon name={f.icon} fallback="Star" size={18} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-body font-semibold text-foreground mb-1 sm:mb-2 text-sm">{f.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="form" className="py-10 sm:py-16 md:py-24 gradient-section">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <FadeIn className="text-center mb-6 sm:mb-10">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-2">Бесплатно</div>
                <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">Рассчитаем потенциал вашего салона</h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Заполните форму — покажем, что именно Расширенный пакет даст вашему бизнесу.
                </p>
              </FadeIn>
              <FadeIn delay={120}>
                <div className="gradient-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 glow-card">
                  <AnalysisForm />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      </div>
    </SimpleLayout>
  );
}
