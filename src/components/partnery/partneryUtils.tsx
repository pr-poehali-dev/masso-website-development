import { useEffect, useRef, useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
export const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

export const STEPS = [
  {
    num: "01",
    title: "Регистрируетесь как партнёр",
    text: "Получаете личный кабинет и уникальный промокод, который даёт скидку на подписку платформы Dok Диалог для салона.",
  },
  {
    num: "02",
    title: "Рекомендуете платформу салонам",
    text: "Рассказываете владельцам салонов и студий, как онлайн-обучение мастеров повышает качество услуг и доход бизнеса.",
  },
  {
    num: "03",
    title: "Салон вводит ваш промокод",
    text: "При оформлении подписки на любой тариф Dok Диалог салон вводит ваш промокод и получает скидку на обучение специалистов.",
  },
  {
    num: "04",
    title: "Вы получаете 10% комиссии",
    text: "С каждой оплаты, совершённой по вашему промокоду, на ваш счёт начисляется 10% комиссионных. Ежемесячно, автоматически.",
  },
];

export const BENEFITS = [
  {
    icon: "💰",
    title: "Пассивный доход",
    text: "Комиссия начисляется ежемесячно, пока салон остаётся подписчиком. Рекомендовали один раз — получаете регулярно.",
  },
  {
    icon: "🎯",
    title: "Промокод со скидкой",
    text: "Ваш промокод даёт салону реальную выгоду — это облегчает разговор и повышает конверсию в подписку.",
  },
  {
    icon: "📊",
    title: "Прозрачная аналитика",
    text: "В личном кабинете видите все активации промокода, начисленные комиссии и историю выплат в режиме реального времени.",
  },
  {
    icon: "🤝",
    title: "Поддержка партнёров",
    text: "Персональный менеджер, обучающие материалы и готовые скрипты для переговоров с владельцами салонов.",
  },
  {
    icon: "⚡",
    title: "Быстрый старт",
    text: "Регистрация занимает 5 минут. Промокод активен сразу — можно начинать рекомендовать в тот же день.",
  },
  {
    icon: "🔄",
    title: "Без ограничений",
    text: "Количество привлечённых салонов не ограничено. Чем больше активных салонов — тем выше ежемесячный доход.",
  },
];

export const CALC_PLANS = [
  { name: "Базовый", price: 150000 },
  { name: "Расширенный", price: 250000 },
  { name: "Полный", price: 400000 },
];

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
