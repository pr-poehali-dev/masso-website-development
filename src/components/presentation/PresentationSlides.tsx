import Icon from "@/components/ui/icon";
import {
  SlideWrapper,
  Tag,
  H2,
  BigNumber,
  CheckList,
  BulletList,
  Card,
  ConsultButton,
} from "./PresentationUi";

export interface Slide {
  id: number;
  content: React.ReactNode;
}

export const slides: Slide[] = [
  // 1 — Титул
  {
    id: 1,
    content: (
      <SlideWrapper>
        <Tag>Слайд 1 из 22</Tag>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
          Массо<span className="text-cyan-400">Про</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl">
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
        <H2>Почему массаж плохо продаётся в салонах</H2>
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
        <H2>МассоПро внедряет системный массажный сервис</H2>
        <p className="text-white/60 text-sm md:text-base">Салон получает:</p>
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
        <H2>Профессиональный протокол работы</H2>
        <div className="flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-3 w-full">
          {[
            { n: "1", t: "Диагностика клиента" },
            { n: "2", t: "Сбор анамнеза" },
            { n: "3", t: "Определение проблемы" },
            { n: "4", t: "Программа восстановления" },
            { n: "5", t: "Работа по протоколу" },
          ].map((s) => (
            <div key={s.n} className="bg-white/8 border border-white/15 rounded-xl p-3 md:p-4 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
              <div className="text-2xl md:text-3xl font-black text-cyan-400 shrink-0 w-8 md:w-auto">{s.n}</div>
              <div className="text-white/80 text-sm leading-snug">{s.t}</div>
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
        <H2>Почему клиенты возвращаются</H2>
        <p className="text-white/60 text-sm md:text-base">После первого сеанса клиент:</p>
        <BulletList
          items={[
            "чувствует реальный результат",
            "понимает причину проблемы",
            "получает программу восстановления",
          ]}
        />
        <p className="text-white/70 text-sm md:text-base">Поэтому проходит <span className="text-white font-semibold">курс процедур</span>. Средний курс:</p>
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
        <H2>Финансовая модель салона</H2>
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
        <H2>Доход одного массажиста</H2>
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
        <H2>Если салон получает 50%</H2>
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
        <H2>3 мастера в салоне</H2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/60 text-sm md:text-base lg:text-lg">160 000 × 3 =</p>
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
        <H2>Если мастер принимает 3 клиента в день</H2>
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
        <H2>Если мастеров 3</H2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/60 text-sm md:text-base lg:text-lg">240 000 × 3 =</p>
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
        <H2>Окупаемость внедрения</H2>
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
        <H2>Все тарифы включают обучение</H2>
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
        <H2>Тариф Базовый</H2>
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
        <H2>Тариф Расширенный</H2>
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
        <H2>Тариф Полный</H2>
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
        <H2>Дополнительные преимущества</H2>
        <p className="text-white/60 text-sm md:text-base">Все участники получают:</p>
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
        <H2>Подбор услуг под мастеров</H2>
        <p className="text-white/60 text-sm md:text-base">Во время обучения анализируется:</p>
        <BulletList items={["уровень мастера", "навыки", "сильные стороны"]} />
        <div className="bg-cyan-500/15 border border-cyan-400/50 rounded-2xl px-8 py-5 mt-2">
          <p className="text-white text-sm md:text-base">После чего формируются</p>
          <p className="text-xl md:text-2xl font-bold text-cyan-400 mt-1">уникальные услуги салона</p>
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
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-cyan-400/60 overflow-hidden shrink-0">
          <img
            src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/292aeb82-ac83-4cf8-8afb-e138f14f0180.png"
            alt="Сергей Водопьянов"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <H2>Сергей Водопьянов</H2>
        <p className="text-white/60 text-sm md:text-base">Основатель МассоПро</p>
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
        <H2>Почему выбирают МассоПро</H2>
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
        <H2>МассоПро — это не просто обучение.</H2>
        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-2xl">
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
        <H2>Получите консультацию по внедрению МассоПро</H2>
        <p className="text-white/60 text-sm md:text-base max-w-xl">
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
