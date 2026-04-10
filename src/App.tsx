
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Presentation from "./pages/Presentation";
import NotFound from "./pages/NotFound";
import NotFoundPage from "./pages/NotFoundPage";
import Tarify from "./pages/Tarify";
import Partnery from "./pages/Partnery";
import Kontakty from "./pages/Kontakty";
import Audit from "./pages/Audit";
import Privacy from "./pages/Privacy";
import Offer from "./pages/Offer";
import BasicPackage from "./pages/BasicPackage";
import ExtendedPackage from "./pages/ExtendedPackage";
import FullPackage from "./pages/FullPackage";

// Salon cabinet imports
import SalonLogin from "./pages/salon/SalonLogin";
import SalonLayout from "./components/salon/SalonLayout";
import SalonDashboard from "./pages/salon/SalonDashboard";
import SalonAnalytics from "./pages/salon/SalonAnalytics";
import SalonTools from "./pages/salon/SalonTools";
import SalonSpecialists from "./pages/salon/SalonSpecialists";
import SalonTraining from "./pages/salon/SalonTraining";
import SalonKnowledge from "./pages/salon/SalonKnowledge";
import SalonRating from "./pages/salon/SalonRating";
import SalonProfile from "./pages/salon/SalonProfile";
import SalonWidgets from "./pages/salon/SalonWidgets";
import SalonPublicPage from "./pages/SalonPublicPage";

// Admin panel imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSalons from "./pages/admin/AdminSalons";
import AdminSalonDetail from "./pages/admin/AdminSalonDetail";
import AdminSpecialists from "./pages/admin/AdminSpecialists";
import AdminAccess from "./pages/admin/AdminAccess";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminTools from "./pages/admin/AdminTools";
import AdminContent from "./pages/admin/AdminContent";
import AdminCatalog from "./pages/admin/AdminCatalog";
import AdminSettings from "./pages/admin/AdminSettings";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/tarify" element={<Tarify />} />
          <Route path="/partnery" element={<Partnery />} />
          <Route path="/kontakty" element={<Kontakty />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/basic-package" element={<BasicPackage />} />
          <Route path="/extended-package" element={<ExtendedPackage />} />
          <Route path="/full-package" element={<FullPackage />} />

          {/* Salon cabinet routes */}
          <Route path="/cabinet/login" element={<SalonLogin />} />
          <Route path="/cabinet" element={<SalonLayout />}>
            <Route index element={<SalonDashboard />} />
            <Route path="analytics" element={<SalonAnalytics />} />
            <Route path="tools" element={<SalonTools />} />
            <Route path="specialists" element={<SalonSpecialists />} />
            <Route path="training" element={<SalonTraining />} />
            <Route path="knowledge" element={<SalonKnowledge />} />
            <Route path="rating" element={<SalonRating />} />
            <Route path="profile" element={<SalonProfile />} />
            <Route path="widgets" element={<SalonWidgets />} />
          </Route>

          {/* Admin panel routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="salons" element={<AdminSalons />} />
            <Route path="salons/:id" element={<AdminSalonDetail />} />
            <Route path="specialists" element={<AdminSpecialists />} />
            <Route path="access" element={<AdminAccess />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="tools" element={<AdminTools />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public salon page */}
          <Route path="/catalog/:id" element={<SalonPublicPage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;