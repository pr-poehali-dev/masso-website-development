import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const CATALOG_URL = 'https://functions.poehali.dev/caf17fe7-0696-4bc2-b522-0aec0aae8cbf';

interface SalonPublic {
  id: number;
  name: string;
  city: string;
  techniques: string | null;
  rating: number;
  is_published: boolean;
  website?: string | null;
}

function StarRow({ rating }: { rating: number }) {
  const filled = Math.floor(rating);
  const half = rating - filled >= 0.25;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const isFilled = i < filled;
        const isHalf = !isFilled && i === filled && half;
        return (
          <Icon
            key={i}
            name={isFilled ? 'Star' : isHalf ? 'StarHalf' : 'Star'}
            size={20}
            style={{ color: isFilled || isHalf ? '#f59e0b' : 'hsla(185,85%,45%,0.2)', fill: isFilled || isHalf ? '#f59e0b' : 'transparent' }}
          />
        );
      })}
    </div>
  );
}

function ensureHttp(url: string) {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

export default function SalonPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<SalonPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${CATALOG_URL}?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        const s = d.salon || (d.salons && d.salons.find((x: SalonPublic) => String(x.id) === String(id)));
        if (s) setSalon(s);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border py-4 px-4 sm:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="Waves" size={16} style={{ color: 'hsl(220, 30%, 6%)' }} />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Массо<span className="gradient-text">ПРО</span>
            </span>
          </a>
          <a
            href="/#catalog"
            className="text-sm font-body text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Icon name="LayoutGrid" size={15} />
            Все студии
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-16 max-w-2xl">
        {loading && (
          <div className="flex justify-center py-24">
            <Icon name="Loader2" size={36} className="animate-spin" style={{ color: 'hsl(185,85%,55%)' }} />
          </div>
        )}

        {notFound && !loading && (
          <div className="text-center py-24">
            <Icon name="SearchX" size={48} className="mx-auto mb-4" style={{ color: 'hsla(185,85%,45%,0.4)' }} />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Студия не найдена</h2>
            <p className="text-muted-foreground text-sm mb-6">Возможно, салон ещё не прошёл сертификацию МассоПРО</p>
            <a href="/#catalog" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'hsl(185,85%,55%)' }}>
              <Icon name="ArrowLeft" size={15} />
              Вернуться в каталог
            </a>
          </div>
        )}

        {salon && !loading && (
          <div className="space-y-6">
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                border: '1px solid hsla(185, 85%, 45%, 0.25)',
                background: 'linear-gradient(135deg, hsl(220,25%,10%) 0%, hsl(220,25%,7%) 100%)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, hsl(185,85%,45%) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }}
              />

              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shrink-0 glow-cyan">
                    <Icon name="Leaf" size={26} style={{ color: 'hsl(220, 30%, 6%)' }} />
                  </div>
                  {salon.rating > 0 && (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-lg font-bold" style={{ color: 'hsl(185,85%,55%)' }}>
                        <Icon name="Star" size={18} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                        {salon.rating.toFixed(1)}
                        <span className="text-sm font-normal" style={{ color: 'hsl(185,85%,45%)' }}>/ 5.0</span>
                      </div>
                      <StarRow rating={salon.rating} />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">{salon.name}</h1>
                  {salon.city && (
                    <div className="flex items-center gap-1.5 text-sm font-body" style={{ color: 'hsl(185,85%,55%)' }}>
                      <Icon name="MapPin" size={14} />
                      <span>{salon.city}</span>
                    </div>
                  )}
                </div>

                {salon.techniques && (
                  <div className="flex flex-wrap gap-2">
                    {salon.techniques.split(',').map((t) => t.trim()).filter(Boolean).map((t, i) => (
                      <span
                        key={i}
                        className="text-xs font-body px-3 py-1.5 rounded-full"
                        style={{
                          background: 'hsla(185,85%,45%,0.12)',
                          border: '1px solid hsla(185,85%,45%,0.25)',
                          color: 'hsl(185,85%,70%)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'hsla(185,85%,45%,0.15)' }}>
                  <div className="flex items-center gap-2 text-sm font-body font-semibold" style={{ color: 'hsl(185,85%,45%)' }}>
                    <Icon name="ShieldCheck" size={16} />
                    Сертифицировано МассоПРО
                  </div>
                  {salon.website && (
                    <a
                      href={ensureHttp(salon.website)}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-1.5 text-sm font-body font-medium hover:underline"
                      style={{ color: 'hsl(185,85%,60%)' }}
                    >
                      <Icon name="ExternalLink" size={13} />
                      Сайт студии
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/#catalog"
                className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon name="ArrowLeft" size={14} />
                Все сертифицированные студии МассоПРО
              </a>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs font-body text-muted-foreground">© 2026 МассоПРО. Профессиональный стандарт массажа.</p>
      </footer>
    </div>
  );
}
