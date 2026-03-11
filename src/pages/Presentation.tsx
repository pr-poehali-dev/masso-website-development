import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

type IconName = string;

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  bg?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "МассоПРО",
    subtitle: "Профессиональный массаж для салонов и студий",
    bg: "slide-hero",
    content: (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl">
          Внедряем новые услуги, обучаем мастеров, повышаем статус и прибыльность вашего салона
        </p>
        <div className="flex gap-6 mt-4 flex-wrap justify-center">
          {[
            { value: "25%", label: "рост среднего чека" },
            { value: "4 шага", label: "до старта" },
            { value: "100%", label: "под ключ" },
          ].map((s) => (
            <div key={s.value} className="bg-white/10 backdrop-blur rounded-2xl px-8 py-4 text-center border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">{s.value}</div>
              <div className="text-sm text-white/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Проблема рынка",
    subtitle: "Массаж в салонах — без единого стандарта",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {[
          { icon: "AlertTriangle", text: "Разные техники массажа у каждого мастера — клиент не знает, что получит" },
          { icon: "ShieldOff", text: "Мастера работают по собственным методикам без единых протоколов качества" },
          { icon: "TrendingDown", text: "Клиенты не доверяют массажу в салоне — прибыль от услуги занижена" },
        ].map((item, i) => (
          <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 flex flex-col gap-3">
            <Icon name={item.icon} size={32} className="text-red-400" />
            <p className="text-white/90 text-base leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 3,
    title: "Наше решение",
    subtitle: "Полная экосистема для вашего салона",
    content: (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {[
          { icon: "Users", title: "Офлайн-обучение", desc: "Практические занятия в вашем салоне" },
          { icon: "Monitor", title: "Онлайн-курсы", desc: "База видеоуроков для мастеров" },
          { icon: "MessageCircle", title: "Вебинары и чат", desc: "Экспертная поддержка онлайн" },
          { icon: "FileText", title: "Готовые протоколы", desc: "Пошаговые инструкции процедур" },
          { icon: "Award", title: "Сертификация", desc: "Официальный знак качества МассоПРО" },
          { icon: "MapPin", title: "Каталог студий", desc: "Новые клиенты сами вас найдут" },
        ].map((item, i) => (
          <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 flex flex-col gap-2">
            <Icon name={item.icon} size={24} className="text-cyan-400" />
            <div className="font-semibold text-white text-sm md:text-base">{item.title}</div>
            <div className="text-white/60 text-xs md:text-sm">{item.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 4,
    title: "4 шага до старта",
    subtitle: "Простой путь к профессиональному массажу",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {[
          { step: "01", title: "Диагностика салона", desc: "Анализируем текущие услуги, состав команды и потенциал для развития" },
          { step: "02", title: "Подбор и внедрение", desc: "Выбираем оптимальные процедуры, адаптируем под ваш формат и уровень клиентов" },
          { step: "03", title: "Обучение мастеров", desc: "Офлайн-обучение, онлайн-курсы, вебинары и постоянная поддержка в чате" },
          { step: "04", title: "Сертификация и каталог", desc: "Получаете знак качества и размещение в каталоге сертифицированных студий" },
        ].map((item) => (
          <div key={item.step} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 flex gap-4">
            <div className="text-4xl font-black text-cyan-400/40 leading-none">{item.step}</div>
            <div>
              <div className="font-bold text-white text-base md:text-lg mb-1">{item.title}</div>
              <div className="text-white/70 text-sm leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 5,
    title: "Что получает ваш салон",
    subtitle: "Реальные результаты для бизнеса",
    content: (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {[
          { icon: "PlusCircle", title: "Новые услуги", desc: "Расширяете меню без хаоса и ошибок" },
          { icon: "CheckSquare", title: "Единые стандарты", desc: "Клиенты всегда знают, что получат" },
          { icon: "BookOpen", title: "Лёгкое обучение", desc: "От теории до практики в вашем салоне" },
          { icon: "Users", title: "Сообщество мастеров", desc: "Закрытый клуб профессионалов" },
          { icon: "Shield", title: "Доверие клиентов", desc: "Знак сертификации МассоПРО" },
          { icon: "TrendingUp", title: "+25% к чеку", desc: "Среднее увеличение выручки партнёров" },
        ].map((item, i) => (
          <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 flex flex-col gap-2">
            <Icon name={item.icon} size={24} className="text-cyan-400" />
            <div className="font-semibold text-white text-sm md:text-base">{item.title}</div>
            <div className="text-white/60 text-xs md:text-sm">{item.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 6,
    title: "Пакеты сотрудничества",
    subtitle: "Выберите подходящий формат",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {[
          {
            name: "Старт",
            popular: false,
            features: ["Офлайн-обучение мастеров", "Доступ к онлайн-курсам", "Базовые протоколы", "Поддержка 1 месяц"],
          },
          {
            name: "Рекомендуем",
            popular: true,
            features: ["Всё из Старта", "Готовые протоколы", "Участие в вебинарах", "Закрытый чат", "Поддержка 3 месяца"],
          },
          {
            name: "Максимум",
            popular: false,
            features: ["Всё из Рекомендуем", "Официальная сертификация", "Знак качества МассоПРО", "Каталог студий", "Поддержка 6 месяцев"],
          },
        ].map((pkg) => (
          <div
            key={pkg.name}
            className={`rounded-2xl p-5 border flex flex-col gap-3 ${
              pkg.popular
                ? "bg-cyan-500/20 border-cyan-400/60 ring-2 ring-cyan-400/40"
                : "bg-white/10 border-white/20"
            }`}
          >
            {pkg.popular && (
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Популярный</span>
            )}
            <div className="text-xl font-bold text-white">{pkg.name}</div>
            <ul className="flex flex-col gap-2">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                  <Icon name="Check" size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 7,
    title: "Результат наших партнёров",
    subtitle: "Реальный кейс",
    content: (
      <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto text-center">
        <div className="text-6xl md:text-8xl font-black text-cyan-400">+25%</div>
        <p className="text-xl md:text-2xl text-white/90 italic leading-relaxed">
          «После внедрения МассоПРО средний чек салона вырос на 25%, а возвратность клиентов увеличилась вдвое»
        </p>
        <div className="text-white/60 text-sm">— Партнёр МассоПРО, Салон красоты, Москва</div>
        <div className="flex gap-8 flex-wrap justify-center">
          {[
            { value: "×2", label: "возвратность клиентов" },
            { value: "50+", label: "обученных мастеров" },
            { value: "100%", label: "удовлетворённость" },
          ].map((s) => (
            <div key={s.value} className="bg-white/10 backdrop-blur rounded-xl px-6 py-3 border border-white/20 text-center">
              <div className="text-2xl font-bold text-cyan-400">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Начнём сотрудничество?",
    subtitle: "Ваш салон уже ждёт нас",
    content: (
      <div className="flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
        <p className="text-xl text-white/80 leading-relaxed">
          Мы уже готовы провести диагностику вашего салона и подобрать оптимальный формат сотрудничества. Ответим в течение 24 часов.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="tel:+78000000000"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all"
          >
            <Icon name="Phone" size={18} />
            +7 (800) 000-00-00
          </a>
          <a
            href="mailto:info@massopro.ru"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl border border-white/20 transition-all"
          >
            <Icon name="Mail" size={18} />
            info@massopro.ru
          </a>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm mt-2">
          <Icon name="MessageCircle" size={16} />
          Telegram: @massopro
        </div>
      </div>
    ),
  },
];

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    if (current < slides.length - 1) goTo(current + 1, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, "prev");
  }, [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1628] to-[#081018] flex flex-col select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          Вернуться на сайт
        </button>
        <div className="text-white/40 text-sm font-medium">
          МассоПРО — Презентация
        </div>
        <div className="text-white/40 text-sm">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 py-8 overflow-hidden">
        <div
          className="w-full max-w-5xl flex flex-col items-center gap-6 transition-all duration-300"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === "next" ? "40px" : "-40px"})`
              : "translateX(0)",
          }}
        >
          {/* Slide number badge */}
          <div className="text-cyan-400/60 text-xs font-mono tracking-widest uppercase">
            Слайд {slide.id} из {slides.length}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white text-center leading-tight">
            {slide.title}
          </h1>

          {/* Subtitle */}
          {slide.subtitle && (
            <p className="text-base md:text-xl text-white/60 text-center max-w-2xl">
              {slide.subtitle}
            </p>
          )}

          {/* Content */}
          <div className="w-full mt-2">{slide.content}</div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-t border-white/10">
        {/* Prev */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <Icon name="ChevronLeft" size={18} />
          Назад
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-6 h-2 bg-cyan-400"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Далее
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>
    </div>
  );
}