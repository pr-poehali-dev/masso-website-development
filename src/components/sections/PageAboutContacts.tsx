import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AnimatedSection, CTAButton, FeatureCard, Page } from "@/components/ui/shared";

// ─── PageAbout ────────────────────────────────────────────────────────────────

export function PageAbout({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">О нас</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              О <span className="gradient-text">проекте</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Создаём профессиональную систему массажа в России: обучение мастеров, внедрение стандартов и сертификация салонов.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-5 sm:p-8 md:p-12 lg:p-16 mb-4 md:mb-6 glow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                  <div className="flex-1">
                    <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-5">Миссия</div>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                      Профессиональный стандарт массажа — в каждом российском салоне
                    </h2>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      Мы верим, что профессиональный массаж должен быть доступен везде — не только в дорогих спа-отелях.
                      Наша миссия: создать сеть сертифицированных салонов с единым стандартом качества,
                      где клиент всегда знает, что получит отличный результат.
                    </p>
                  </div>
                  <div className="shrink-0 w-full md:w-64 lg:w-72">
                    <img
                      src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/65987bbc-3c36-4f09-8d46-76a2af03e82a.png"
                      alt="Обучение мастеров"
                      className="w-full rounded-2xl object-cover shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 md:mb-6">
              {[
                { icon: "Target", title: "Цель", desc: "Создать профессиональную экосистему массажа в российских салонах красоты и wellness-студиях" },
                { icon: "Eye", title: "Видение", desc: "Мир, где каждый клиент любого салона получает качественный профессиональный массаж" },
                { icon: "Heart", title: "Ценности", desc: "Качество, профессионализм, поддержка партнёров и непрерывное развитие мастеров" },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 150}>
                  <FeatureCard {...item} />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-4 sm:p-6 md:p-8 glow-card">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-5">Команда</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { name: "Сергей Водопьянов", role: "Основатель", exp: "15+ лет в индустрии красоты", link: "https://osteopatplus.ru/", photo: "https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/292aeb82-ac83-4cf8-8afb-e138f14f0180.png" },
                    { name: "Главный эксперт", role: "Главный эксперт", exp: "17+ лет опыта в массаже и остеопатии", link: "https://yandex.com/maps/org/osteopat_plyus/99582120415/reviews/", photo: "https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/f265dad9-4afb-4dbc-be0b-048ac63777ba.jpg" },
                    { name: "Анна Уварова", role: "Директор по развитию", exp: "Основатель проекта ПоДелам", link: "https://podelam.su/", photo: "https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/bucket/aa954072-1c0f-4efe-a908-a10f9ace5293.jpg" },
                  ].map((member, i) => (
                    <a key={i} href={member.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shrink-0 glow-cyan">
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <div className="text-foreground font-body font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{member.name}</div>
                        <div className="text-primary font-body text-xs mb-0.5">{member.role}</div>
                        <div className="text-muted-foreground font-body text-xs leading-relaxed">{member.exp}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-4 sm:p-6 md:p-8 glow-card mt-4 md:mt-6">
                <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-2">Отзывы</div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-6">Видеоотзывы специалистов после обучения</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {[
                    "o4aLwoPaNMNsPmRU517kdr",
                    "us9ULPt46B7G77bQYwBXXt",
                    "jWics1Kq1BrrtcFK25Vmgu",
                    "vk9wa3fBfxQZwMbRvN9YJG",
                    "sCFSxwbdZSjobWC3KKzDmj",
                    "7on4nVofXbcgkDmWbjaZvH",
                  ].map((id, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0f' }}>
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={`https://kinescope.io/embed/${id}`}
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; web-share"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 gradient-section">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Станьте частью Массо<span className="gradient-text">ПРО</span></h2>
            <CTAButton large onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Получить консультацию</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

// ─── PageContacts ─────────────────────────────────────────────────────────────

const SEND_CONTACT_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

export function PageContacts({ onNavigate }: { onNavigate?: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEND_CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Не удалось отправить. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-block text-primary text-xs font-body font-semibold uppercase tracking-widest mb-3">Связаться</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6">
              <span className="gradient-text">Контакты</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Ответим на все вопросы и поможем выбрать оптимальный формат сотрудничества для вашего салона.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <AnimatedSection>
              <div className="gradient-card rounded-3xl p-6 sm:p-8 h-full glow-card">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">Напишите нам</h2>
                  <a
                    href="/presentation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors rounded-xl px-4 py-2 text-primary text-xs font-body font-semibold"
                  >
                    <Icon name="Presentation" fallback="FileText" size={14} />
                    Посмотреть презентацию
                  </a>
                </div>

                {sent ? (
                  <div className="text-center py-10 md:py-12">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 glow-cyan">
                      <Icon name="Check" size={28} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Сообщение отправлено!</h3>
                    <p className="text-muted-foreground text-sm font-body">Мы ответим в течение 24 часов</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div>
                      <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Ваше имя</label>
                      <input
                        type="text"
                        placeholder="Александр"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Телефон или Email</label>
                      <input
                        type="text"
                        placeholder="+7 (999) 000-00-00"
                        value={form.contact}
                        onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2 block">Сообщение</label>
                      <textarea
                        rows={4}
                        placeholder="Расскажите о вашем салоне..."
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 shrink-0 accent-primary cursor-pointer"
                      />
                      <span className="text-muted-foreground text-xs font-body leading-relaxed">
                        Даю согласие с{" "}
                        <button type="button" onClick={() => onNavigate?.("privacy")} className="text-primary hover:underline">Политикой конфиденциальности</button>
                        {" "}и{" "}
                        <button type="button" onClick={() => onNavigate?.("offer")} className="text-primary hover:underline">Условиями оферты</button>
                      </span>
                    </label>
                    {error && <p className="text-red-400 text-xs font-body">{error}</p>}
                    <CTAButton large>{loading ? "Отправляем..." : "Отправить сообщение"}</CTAButton>
                  </form>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (902) 900-74-74", sub: "Пн–Пт, 9:00–18:00" },
                  { icon: "Mail", label: "Email", value: "massopro@mail.ru", sub: "Ответим в течение 24ч" },
                  { icon: "MessageCircle", label: "Telegram", value: "@SergeuVodopianov", sub: "Быстрый ответ" },

                ].map((contact, i) => (
                  <div key={i} className="gradient-card rounded-2xl p-4 sm:p-5 flex items-start gap-4 glow-card">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                      <Icon name={contact.icon} fallback="Mail" size={20} style={{ color: "hsl(220, 30%, 6%)" }} />
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-0.5">{contact.label}</div>
                      <div className="text-foreground font-body font-semibold text-sm">{contact.value}</div>
                      <div className="text-muted-foreground text-xs font-body">{contact.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}