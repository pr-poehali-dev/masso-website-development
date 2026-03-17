
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Presentation from "./pages/Presentation";
import NotFound from "./pages/NotFound";
import DokDialog from "./pages/DokDialog";
import Tarify from "./pages/Tarify";
import Partnery from "./pages/Partnery";
import Kontakty from "./pages/Kontakty";
import Privacy from "./pages/Privacy";
import Offer from "./pages/Offer";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/doc-dialog" element={<DokDialog />} />
          <Route path="/tarify" element={<Tarify />} />
          <Route path="/partnery" element={<Partnery />} />
          <Route path="/kontakty" element={<Kontakty />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/offer" element={<Offer />} />

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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
