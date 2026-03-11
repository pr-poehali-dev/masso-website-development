import { useState, useEffect, useCallback, useRef } from "react";
import { slides } from "@/components/presentation/PresentationSlides";
import { TopBar, BottomNav } from "@/components/presentation/PresentationNav";

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const slide = slides[current];
  const progress = ((current + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080d1a] via-[#0c1424] to-[#060e18] flex flex-col">
      <TopBar current={current} total={slides.length} progress={progress} />

      <div
        className="flex-1 flex items-center justify-center px-4 md:px-12 py-6 md:py-8 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

      <BottomNav
        current={current}
        slides={slides}
        onPrev={prev}
        onNext={next}
        onGoTo={goTo}
      />
    </div>
  );
}
