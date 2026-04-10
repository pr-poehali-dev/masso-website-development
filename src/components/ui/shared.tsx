import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

export type Page = "home" | "how" | "salons" | "catalog" | "about" | "audit" | "contacts" | "privacy" | "offer";

export const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "how", label: "Как это работает" },
  { id: "salons", label: "Для салонов" },
  { id: "catalog", label: "Каталог студий" },
  { id: "about", label: "О проекте" },
  { id: "audit", label: "Аудит салона" },
  { id: "contacts", label: "Контакты" },
];

export function useInView(threshold = 0.15) {
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

export function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

export function CTAButton({ children, onClick, large = false }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
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

export function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 font-body font-semibold text-primary border border-primary/60 rounded-full px-7 py-3 text-sm hover:bg-primary/10 transition-all duration-300 hover:border-primary"
    >
      {children}
    </button>
  );
}

export function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="gradient-card rounded-2xl px-2 sm:px-4 md:px-6 py-3 md:py-4 text-center glow-card">
      <div className="gradient-text font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{value}</div>
      <div className="text-muted-foreground text-[10px] sm:text-xs mt-1 font-body leading-tight">{label}</div>
    </div>
  );
}

export function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
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

export function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
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

export function ProblemCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-4 gradient-card rounded-xl p-5 glow-card">
      <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
        <Icon name={icon} fallback="AlertCircle" size={18} className="text-destructive" />
      </div>
      <p className="text-foreground/80 text-sm leading-relaxed pt-1">{text}</p>
    </div>
  );
}