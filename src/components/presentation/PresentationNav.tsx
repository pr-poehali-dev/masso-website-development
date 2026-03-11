import Icon from "@/components/ui/icon";
import { Slide } from "./PresentationSlides";

interface TopBarProps {
  current: number;
  total: number;
  progress: number;
}

export function TopBar({ current, total, progress }: TopBarProps) {
  return (
    <>
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
          {current + 1} / {total}
        </div>
      </div>
      <div className="h-0.5 bg-white/8 shrink-0">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}

interface BottomNavProps {
  current: number;
  slides: Slide[];
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number, dir: "next" | "prev") => void;
}

export function BottomNav({ current, slides, onPrev, onNext, onGoTo }: BottomNavProps) {
  return (
    <div className="flex items-center justify-between px-3 md:px-8 py-3 md:py-4 border-t border-white/8 shrink-0 gap-3">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="flex items-center gap-1.5 px-4 py-3 md:px-5 md:py-3 rounded-xl bg-white/8 hover:bg-white/15 active:bg-white/20 text-white/70 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm font-medium min-w-[80px] justify-center"
      >
        <Icon name="ChevronLeft" size={18} />
        <span className="hidden sm:inline">Назад</span>
      </button>

      <div className="flex gap-1.5 items-center overflow-hidden">
        {slides.map((_, i) => {
          const dist = Math.abs(i - current);
          if (dist > 4) return null;
          return (
            <button
              key={i}
              onClick={() => onGoTo(i, i > current ? "next" : "prev")}
              className={`rounded-full transition-all shrink-0 ${
                i === current
                  ? "w-6 h-2.5 bg-cyan-400"
                  : dist === 1
                  ? "w-2 h-2 bg-white/30 hover:bg-white/50"
                  : "w-1.5 h-1.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={current === slides.length - 1}
        className="flex items-center gap-1.5 px-4 py-3 md:px-5 md:py-3 rounded-xl bg-cyan-500/80 hover:bg-cyan-400 active:bg-cyan-300 text-gray-900 font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm min-w-[80px] justify-center"
      >
        <span className="hidden sm:inline">Далее</span>
        <Icon name="ChevronRight" size={18} />
      </button>
    </div>
  );
}
