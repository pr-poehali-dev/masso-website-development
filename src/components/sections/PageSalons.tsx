import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { AnimatedSection, CTAButton, Page } from "@/components/ui/shared";
import { SalonsCalculator } from "./SalonsCalculator";
import { SalonsPackages, SalonsCase, SalonsCta } from "./SalonsPackages";
import { CatalogCard, CatalogSalon } from "./CatalogCard";

// ─── PageSalons ───────────────────────────────────────────────────────────────

export function PageSalons({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const goCta = () => {
    onNavigate("home");
    setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Партнёрство</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              Для <span className="gradient-text">салонов</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              МассоПРО помогает внедрять массажные услуги, обучать мастеров и повышать статус салонов по всей России.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <SalonsPackages onCta={goCta} />

      <SalonsCalculator onCta={goCta} />

      <SalonsCase />

      <SalonsCta onCta={goCta} />
    </div>
  );
}

// ─── PageCatalog ──────────────────────────────────────────────────────────────

const CATALOG_URL = "https://functions.poehali.dev/caf17fe7-0696-4bc2-b522-0aec0aae8cbf";

export function PageCatalog({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [salons, setSalons] = useState<CatalogSalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogSalon[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((d) => setSalons(d.salons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    setNotFound(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      fetch(`${CATALOG_URL}?q=${encodeURIComponent(val.trim())}`)
        .then((r) => r.json())
        .then((d) => {
          const res = d.salons || [];
          setSearchResults(res);
          setNotFound(res.length === 0);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 400);
  };

  const displayed = searchResults !== null ? searchResults : salons;

  return (
    <div>
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-10 md:mb-14">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 glow-cyan animate-float">
                <Icon name="LayoutGrid" size={36} style={{ color: "hsl(220, 30%, 6%)" }} />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4">
                Каталог <span className="gradient-text">студий</span>
              </h1>
              <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Проверьте, соответствует ли ваш салон стандартам МассоПРО, или найдите сертифицированную студию рядом
              </p>
            </div>

            <div className="max-w-xl mx-auto mb-12 md:mb-16">
              <div
                className="relative flex items-center rounded-2xl overflow-hidden"
                style={{ border: "1px solid hsla(185,85%,45%,0.35)", background: "hsl(220,25%,9%)" }}
              >
                <div className="pl-4 pr-2 shrink-0">
                  <Icon name={searching ? "Loader" : "Search"} size={18} style={{ color: "hsl(185,85%,55%)" }} className={searching ? "animate-spin" : ""} />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Введите название или город салона..."
                  className="flex-1 bg-transparent font-body text-foreground text-sm py-4 pr-4 outline-none placeholder:text-muted-foreground/50"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); setSearchResults(null); setNotFound(false); }}
                    className="pr-4 pl-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
              {notFound && (
                <p className="text-center text-sm font-body mt-3" style={{ color: "hsl(0,70%,65%)" }}>
                  Салон не найден в базе МассоПРО. Возможно, он ещё не прошёл сертификацию.
                </p>
              )}
            </div>

            {!query && (
              <p className="text-center text-xs font-body text-muted-foreground mb-6 tracking-widest uppercase">
                Последние добавленные студии
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="gradient-card rounded-3xl p-6 animate-pulse h-48" style={{ border: "1px solid hsla(185,85%,45%,0.1)" }}>
                    <div className="w-12 h-12 rounded-2xl bg-foreground/10 mb-4" />
                    <div className="h-4 bg-foreground/10 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-foreground/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayed.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {displayed.map((s, i) => (
                  <CatalogCard key={s.id} salon={s} index={i} />
                ))}
              </div>
            ) : null}

            {!query && (
              <div className="text-center mt-14 md:mt-20">
                <p className="font-body text-foreground font-semibold text-sm sm:text-base mb-3">
                  Мы подключаем ограниченное количество салонов — 3–5 студий на город
                </p>
                <CTAButton onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
                  Оставить заявку
                </CTAButton>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
