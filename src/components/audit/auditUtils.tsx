import { useEffect, useRef, useState } from "react";

export const ACCENT = "hsl(185, 85%, 45%)";
export const ACCENT_GLOW = "hsla(185, 85%, 45%, 0.12)";
export const ACCENT_BORDER = "hsla(185, 85%, 45%, 0.28)";
export const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

export const cardStyle: React.CSSProperties = {
  background: "hsl(220, 25%, 9%)",
  border: "1px solid hsl(220, 20%, 16%)",
  borderRadius: 20,
  padding: "28px 24px",
};

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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
