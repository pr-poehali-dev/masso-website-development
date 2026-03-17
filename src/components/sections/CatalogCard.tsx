import Icon from "@/components/ui/icon";

export interface CatalogSalon {
  id: number;
  name: string;
  city: string;
  techniques: string | null;
  rating: number;
  is_published: boolean;
}

export function CatalogCard({ salon, index }: { salon: CatalogSalon; index: number }) {
  const services = salon.techniques
    ? salon.techniques.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="relative gradient-card rounded-3xl p-6 glow-card flex flex-col gap-4 overflow-hidden"
      style={{
        border: "1px solid hsla(185, 85%, 45%, 0.18)",
        background: "linear-gradient(135deg, hsl(220,25%,10%) 0%, hsl(220,25%,7%) 100%)",
        animationDelay: `${index * 120}ms`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(185,85%,45%) 0%, transparent 70%)", transform: "translate(30%,-30%)" }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shrink-0 glow-cyan">
          <Icon name="Leaf" size={20} style={{ color: "hsl(220, 30%, 6%)" }} />
        </div>
        {salon.rating > 0 && (
          <div className="flex items-center gap-1 text-xs font-body font-semibold" style={{ color: "hsl(185,85%,55%)" }}>
            <Icon name="Star" size={12} style={{ color: "hsl(45,90%,55%)", fill: "hsl(45,90%,55%)" }} />
            {salon.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-1">{salon.name}</h3>
        <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: "hsl(185,85%,55%)" }}>
          <Icon name="MapPin" size={12} />
          <span>{salon.city || "Город не указан"}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {services.length > 0 ? (
          services.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="text-[11px] font-body px-2.5 py-1 rounded-full"
              style={{
                background: "hsla(185,85%,45%,0.12)",
                border: "1px solid hsla(185,85%,45%,0.25)",
                color: "hsl(185,85%,70%)",
              }}
            >
              {s}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">Услуги уточняются</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-body font-semibold" style={{ color: "hsl(185,85%,45%)" }}>
        <Icon name="ShieldCheck" size={12} />
        Сертифицировано МассоПРО
      </div>
    </div>
  );
}
