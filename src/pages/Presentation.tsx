import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

interface Slide {
  id: number;
  content: React.ReactNode;
}

function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-400/40 rounded-full px-4 py-1">
      {children}
    </span>
  );
}

function BigNumber({ value, label }: { value: string; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-5xl md:text-7xl font-black text-cyan-400 leading-none">{value}</div>
      {label && <div className="text-white/60 text-sm mt-2">{label}</div>}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3 text-left w-full max-w-md mx-auto">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-white/90 text-base">
          <Icon name="Check" size={18} className="text-cyan-400 mt-0.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3 text-left w-full max-w-md mx-auto">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-white/80 text-base">
          <span className="text-cyan-400 mt-1 shrink-0">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Card({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-5 md:p-6 border w-full ${
        highlight
          ? "bg-cyan-500/15 border-cyan-400/50"
          : "bg-white/8 border-white/15"
      }`}
    >
      {children}
    </div>
  );
}

function ConsultButton() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all text-base shadow-lg shadow-cyan-500/20"
    >
      <Icon name="MessageCircle" size={18} />
      Получить консультацию
    </a>
  );
}

const slides: Slide[] = [
  // 1 — Титул
  {
    id: 1,
    content: (
      <SlideWrapper>
        <Tag>Слайд 1 из 22</Tag>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
          Массо<span className="text-cyan-400">Про</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-xl">
          Профессиональная система массажных услуг для салонов
        </p>
        <div className="flex flex-col sm:flex-row gap-3 text-white/80 text-base">
          {["Внедрение", "Обучение мастеров", "Рост прибыли"].map((t) => (
            <div key={t} className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-xl px-5 py-3">
              <Icon name="Check" size={16} className="text-cyan-400" />
              {t}
            </div>
          ))}
        </div>
        <ConsultButton />
      </SlideWrapper>
    ),
  },
  // 2 — Проблема
  {
    id: 2,
    content: (
      <SlideWrapper>
        <Tag>Проблема</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Почему массаж плохо продаётся в салонах</h2>
        <BulletList
          items={[
            "мастера работают по разным техникам",
            "нет диагностики клиента",
            "нет системной работы",
            "нет протоколов процедур",
            "клиент не понимает результат",
          ]}
        />
        <div className="bg-red-500/15 border border-red-400/40 rounded-2xl px-8 py-5 mt-2">
          <p className="text-white text-lg md:text-xl font-semibold">
            Итог: клиент приходит <span className="text-red-400">один раз</span> и не возвращается.
          </p>
        </div>
      </SlideWrapper>
    ),
  },
  // 3 — Решение
  {
    id: 3,
    content: (
      <SlideWrapper>
        <Tag>Решение</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">МассоПро внедряет системный массажный сервис</h2>
        <p className="text-white/60 text-lg">Салон получает:</p>
        <CheckList
          items={[
            "профессиональные техники",
            "стандарты работы",
            "обучение мастеров",
            "диагностику клиентов",
            "протоколы процедур",
            "систему повторных посещений",
          ]}
        />
      </SlideWrapper>
    ),
  },
  // 4 — Как работает
  {
    id: 4,
    content: (
      <SlideWrapper>
        <Tag>Система</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Профессиональный протокол работы</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
          {[
            { n: "1", t: "Диагностика клиента" },
            { n: "2", t: "Сбор анамнеза" },
            { n: "3", t: "Определение проблемы" },
            { n: "4", t: "Программа восстановления" },
            { n: "5", t: "Работа по протоколу" },
          ].map((s) => (
            <div key={s.n} className="bg-white/8 border border-white/15 rounded-2xl p-4 flex flex-col items-center gap-2">
              <div className="text-3xl font-black text-cyan-400">{s.n}</div>
              <div className="text-white/80 text-sm text-center leading-snug">{s.t}</div>
            </div>
          ))}
        </div>
      </SlideWrapper>
    ),
  },
  // 5 — Почему возвращаются
  {
    id: 5,
    content: (
      <SlideWrapper>
        <Tag>Возврат клиентов</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Почему клиенты возвращаются</h2>
        <p className="text-white/60 text-lg">После первого сеанса клиент:</p>
        <BulletList
          items={[
            "чувствует реальный результат",
            "понимает причину проблемы",
            "получает программу восстановления",
          ]}
        />
        <p className="text-white/70 text-lg">Поэтому проходит <span className="text-white font-semibold">курс процедур</span>. Средний курс:</p>
        <BigNumber value="5–8" label="процедур" />
      </SlideWrapper>
    ),
  },
  // 6 — Финмодель
  {
    id: 6,
    content: (
      <SlideWrapper>
        <Tag>Финансы</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Финансовая модель салона</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card>
            <div className="text-white/60 text-sm mb-2">Средний чек процедуры</div>
            <div className="text-4xl font-black text-cyan-400">8 000 ₽</div>
          </Card>
          <Card>
            <div className="text-white/60 text-sm mb-2">Минимальный курс</div>
            <div className="text-4xl font-black text-cyan-400">5 процедур</div>
          </Card>
          <Card highlight>
            <div className="text-white/60 text-sm mb-2">Доход с одного клиента</div>
            <div className="text-4xl font-black text-cyan-400">40 000 ₽</div>
            <div className="text-white/40 text-xs mt-1">8 000 × 5</div>
          </Card>
        </div>
      </SlideWrapper>
    ),
  },
  // 7 — Доход мастера
  {
    id: 7,
    content: (
      <SlideWrapper>
        <Tag>Расчёт</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Доход одного массажиста</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card>
            <div className="text-white/60 text-sm mb-2">Всего 2 клиента в день</div>
            <div className="text-4xl font-black text-cyan-400">16 000 ₽</div>
            <div className="text-white/40 text-xs mt-1">в день</div>
          </Card>
          <Card>
            <div className="text-white/60 text-sm mb-2">20 рабочих дней</div>
            <div className="text-4xl font-black text-cyan-400">× 20</div>
          </Card>
          <Card highlight>
            <div className="text-white/60 text-sm mb-2">Оборот в месяц</div>
            <div className="text-4xl font-black text-cyan-400">320 000 ₽</div>
          </Card>
        </div>
      </SlideWrapper>
    ),
  },
  // 8 — Доход салона (1 мастер)
  {
    id: 8,
    content: (
      <SlideWrapper>
        <Tag>Доход салона</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Если салон получает 50%</h2>
        <BigNumber value="160 000 ₽" label="в месяц с одного мастера" />
      </SlideWrapper>
    ),
  },
  // 9 — 3 мастера
  {
    id: 9,
    content: (
      <SlideWrapper>
        <Tag>Масштаб</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">3 мастера в салоне</h2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/60 text-xl">160 000 × 3 =</p>
          <BigNumber value="480 000 ₽" label="в месяц" />
        </div>
      </SlideWrapper>
    ),
  },
  // 10 — 3 клиента в день
  {
    id: 10,
    content: (
      <SlideWrapper>
        <Tag>Реальный потенциал</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Если мастер принимает 3 клиента в день</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Card>
            <div className="text-white/60 text-sm mb-2">Оборот массажиста</div>
            <div className="text-3xl font-black text-cyan-400">480 000 ₽</div>
            <div className="text-white/40 text-xs mt-1">3 × 8 000 × 20 дней</div>
          </Card>
          <Card highlight>
            <div className="text-white/60 text-sm mb-2">Доход салона (50%)</div>
            <div className="text-3xl font-black text-cyan-400">240 000 ₽</div>
            <div className="text-white/40 text-xs mt-1">с одного мастера</div>
          </Card>
        </div>
      </SlideWrapper>
    ),
  },
  // 11 — 3 мастера × 3 клиента
  {
    id: 11,
    content: (
      <SlideWrapper>
        <Tag>Максимум</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Если мастеров 3</h2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/60 text-xl">240 000 × 3 =</p>
          <BigNumber value="720 000 ₽" label="в месяц" />
        </div>
      </SlideWrapper>
    ),
  },
  // 12 — Окупаемость
  {
    id: 12,
    content: (
      <SlideWrapper>
        <Tag>Окупаемость</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Окупаемость внедрения</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Card>
            <div className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-3">Базовый тариф</div>
            <div className="text-4xl font-black text-white mb-2">150 000 ₽</div>
            <div className="text-white/60 text-sm">Окупаемость: <span className="text-white font-semibold">~1 месяц</span></div>
          </Card>
          <Card highlight>
            <div className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-3">Расширенный тариф</div>
            <div className="text-4xl font-black text-white mb-2">250 000 ₽</div>
            <div className="text-white/60 text-sm">Окупаемость: <span className="text-white font-semibold">1–2 месяца</span></div>
          </Card>
        </div>
      </SlideWrapper>
    ),
  },
  // 13 — Что входит в обучение
  {
    id: 13,
    content: (
      <SlideWrapper>
        <Tag>Обучение</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Все тарифы включают обучение</h2>
        <BulletList
          items={[
            "диагностика клиента",
            "сбор анамнеза",
            "правильное общение с клиентом",
            "составление программы восстановления",
            "работа по протоколам",
            "большой блок противопоказаний",
          ]}
        />
      </SlideWrapper>
    ),
  },
  // 14 — Базовый тариф
  {
    id: 14,
    content: (
      <SlideWrapper>
        <Tag>Тарифы</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Тариф Базовый</h2>
        <Card>
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl font-black text-cyan-400">150 000 ₽</div>
            <div className="text-white/60">Для салонов до <span className="text-white font-semibold">3 мастеров</span></div>
            <div className="w-full border-t border-white/10 pt-4">
              <p className="text-white/60 text-sm mb-3">Обучение включает:</p>
              <BulletList
                items={[
                  "медицинский массаж",
                  "висцеральный массаж",
                  "остеопатические техники",
                  "коррекция фигуры без масла",
                ]}
              />
            </div>
          </div>
        </Card>
      </SlideWrapper>
    ),
  },
  // 15 — Расширенный тариф
  {
    id: 15,
    content: (
      <SlideWrapper>
        <Tag>Тарифы</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Тариф Расширенный</h2>
        <Card highlight>
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl font-black text-cyan-400">250 000 ₽</div>
            <div className="text-white/60">Для салонов до <span className="text-white font-semibold">3 мастеров</span></div>
            <div className="w-full border-t border-white/10 pt-4">
              <p className="text-white/60 text-sm mb-3">Все техники базового +</p>
              <BulletList
                items={[
                  "регуляция ВНС",
                  "работа с ВНЧС",
                  "доступ к чату специалистов",
                  "участие в вебинарах",
                ]}
              />
            </div>
          </div>
        </Card>
      </SlideWrapper>
    ),
  },
  // 16 — Полный тариф
  {
    id: 16,
    content: (
      <SlideWrapper>
        <Tag>Тарифы</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Тариф Полный</h2>
        <Card>
          <div className="flex flex-col items-center gap-4">
            <div className="text-white/60">Для салонов <span className="text-white font-semibold">от 3 специалистов</span></div>
            <div className="w-full border-t border-white/10 pt-4">
              <p className="text-white/60 text-sm mb-3">Все техники расширенного +</p>
              <BulletList
                items={[
                  "краниосакральные техники",
                  "курс по онлайн рекламе",
                  "доступ ко всем онлайн курсам",
                ]}
              />
            </div>
          </div>
        </Card>
      </SlideWrapper>
    ),
  },
  // 17 — Доп. преимущества
  {
    id: 17,
    content: (
      <SlideWrapper>
        <Tag>Бонусы</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Дополнительные преимущества</h2>
        <p className="text-white/60 text-lg">Все участники получают:</p>
        <CheckList
          items={[
            "доступ к онлайн курсам",
            "доступ к профессиональному чату",
            "вебинары",
            "поддержку специалистов",
            "внедрение услуг под конкретных мастеров",
          ]}
        />
      </SlideWrapper>
    ),
  },
  // 18 — Подбор услуг
  {
    id: 18,
    content: (
      <SlideWrapper>
        <Tag>Индивидуальный подход</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Подбор услуг под мастеров</h2>
        <p className="text-white/60 text-lg">Во время обучения анализируется:</p>
        <BulletList items={["уровень мастера", "навыки", "сильные стороны"]} />
        <div className="bg-cyan-500/15 border border-cyan-400/50 rounded-2xl px-8 py-5 mt-2">
          <p className="text-white text-lg">После чего формируются</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">уникальные услуги салона</p>
        </div>
      </SlideWrapper>
    ),
  },
  // 19 — Эксперт
  {
    id: 19,
    content: (
      <SlideWrapper>
        <Tag>Эксперт</Tag>
        <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center">
          <Icon name="User" size={36} className="text-cyan-400" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white">Сергей Водопьянов</h2>
        <p className="text-white/60 text-lg">Основатель МассоПро</p>
        <BulletList
          items={[
            "практикующий специалист",
            "опыт более 17 лет",
            "член Ассоциации мануальных терапевтов и остеопатов",
            "рейтинг 5.0 в Яндекс Картах",
            "автор профессиональных онлайн курсов",
          ]}
        />
        <div className="bg-white/8 border border-white/15 rounded-2xl px-6 py-4 mt-2">
          <p className="text-white/80">Каждый участник салона получает <span className="text-cyan-400 font-semibold">доступ к этим курсам</span></p>
        </div>
      </SlideWrapper>
    ),
  },
  // 20 — Почему выбирают
  {
    id: 20,
    content: (
      <SlideWrapper>
        <Tag>Преимущества</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">Почему выбирают МассоПро</h2>
        <CheckList
          items={[
            "системный подход",
            "сильные техники",
            "реальные результаты",
            "рост среднего чека",
            "возврат клиентов на курс",
          ]}
        />
      </SlideWrapper>
    ),
  },
  // 21 — Главная идея
  {
    id: 21,
    content: (
      <SlideWrapper>
        <Tag>Главная идея</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white/70 leading-tight">
          МассоПро — это не просто обучение.
        </h2>
        <p className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl">
          Это внедрение{" "}
          <span className="text-cyan-400">прибыльной системы</span>{" "}
          массажных услуг в салоне.
        </p>
      </SlideWrapper>
    ),
  },
  // 22 — Финал
  {
    id: 22,
    content: (
      <SlideWrapper>
        <Tag>Финал</Tag>
        <h2 className="text-3xl md:text-5xl font-black text-white">
          Получите консультацию по внедрению МассоПро
        </h2>
        <p className="text-white/60 text-lg max-w-xl">
          Ответим в течение 24 часов и подберём оптимальный формат для вашего салона
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <ConsultButton />
          <a
            href="mailto:info@massopro.ru"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-8 py-4 rounded-xl border border-white/20 transition-all font-semibold"
          >
            <Icon name="Mail" size={18} />
            info@massopro.ru
          </a>
        </div>
      </SlideWrapper>
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
      }, 280);
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
      if (e.key === "Escape") window.location.href = "/";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const slide = slides[current];
  const progress = ((current + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080d1a] via-[#0c1424] to-[#060e18] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/8 shrink-0">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <Icon name="ArrowLeft" size={15} />
          На сайт
        </button>
        <div className="text-white/30 text-sm font-medium hidden sm:block">МассоПро — Презентация</div>
        <div className="text-white/40 text-sm tabular-nums">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/8 shrink-0">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-12 py-8 overflow-hidden">
        <div
          className="w-full transition-all duration-280"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === "next" ? "32px" : "-32px"})`
              : "translateX(0)",
          }}
        >
          {slide.content}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-t border-white/8 shrink-0">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm"
        >
          <Icon name="ChevronLeft" size={18} />
          <span className="hidden sm:inline">Назад</span>
        </button>

        {/* Dots — show max 10 for small screens */}
        <div className="flex gap-1.5 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-5 h-2 bg-cyan-400"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm"
        >
          <span className="hidden sm:inline">Далее</span>
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>
    </div>
  );
}
