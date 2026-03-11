import Icon from "@/components/ui/icon";

export function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 md:gap-6 text-center">
      {children}
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-400/40 rounded-full px-3 py-0.5 md:px-4 md:py-1">
      {children}
    </span>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
      {children}
    </h2>
  );
}

export function BigNumber({ value, label }: { value: string; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-cyan-400 leading-none">{value}</div>
      {label && <div className="text-white/60 text-sm mt-2">{label}</div>}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 md:gap-3 text-left w-full max-w-md mx-auto">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-white/90 text-sm md:text-base">
          <Icon name="Check" size={16} className="text-cyan-400 mt-0.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 md:gap-3 text-left w-full max-w-md mx-auto">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-white/80 text-sm md:text-base">
          <span className="text-cyan-400 mt-1 shrink-0">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Card({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
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

export function ConsultButton() {
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
