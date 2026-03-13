import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { PageHome, PageHow, PageSalons, PageCatalog, PageAbout, PageContacts, PagePrivacy, PageOffer } from "@/components/sections/Pages";
import { Page } from "@/components/ui/shared";

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages: Record<Page, React.ReactNode> = {
    home: <PageHome onNavigate={navigate} />,
    how: <PageHow onNavigate={navigate} />,
    salons: <PageSalons onNavigate={navigate} />,
    catalog: <PageCatalog onNavigate={navigate} />,
    about: <PageAbout onNavigate={navigate} />,
    contacts: <PageContacts onNavigate={navigate} />,
    privacy: <PagePrivacy />,
    offer: <PageOffer />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        mobileOpen={mobileOpen}
        scrolled={scrolled}
        onNavigate={navigate}
        onToggleMobile={() => setMobileOpen(o => !o)}
      />
      <main>{pages[currentPage]}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}