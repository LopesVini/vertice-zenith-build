import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import Index from "./pages/Index";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Projetos from "./pages/Projetos";
import Processo from "./pages/Processo";
import Orcamento from "./pages/Orcamento";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import ClientLogin from "./pages/ClientLogin";
import PortalLayout from "./components/portal/PortalLayout";
import ProjectDashboard from "./pages/portal/ProjectDashboard";
import BimPlaceholder from "./pages/portal/BimPlaceholder";
import ProjectUpdates from "./pages/portal/ProjectUpdates";
import HqLayout from "./components/hq/HqLayout";
import HqDashboard from "./pages/hq/HqDashboard";
import HqProjects from "./pages/hq/HqProjects";
import HqClients from "./pages/hq/HqClients";

const queryClient = new QueryClient();

// Componente seguro para rolar para o topo
const RouteChangeHandler = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Apenas forçar a rolagem pro topo
    window.scrollTo(0, 0);

    // Atualizar o ScrollTrigger para garantir posições corretas
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vertice-theme">
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteChangeHandler />
          <ErrorBoundary>
            <Routes>
              {/* Rota Institucional */}
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/processo" element={<Processo />} />
              <Route path="/orcamento" element={<Orcamento />} />
              <Route path="/contato" element={<Contato />} />
              
              {/* Área do Cliente (SaaS) */}
              <Route path="/login" element={<ClientLogin />} />
              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<ProjectDashboard />} />
                <Route path="bim" element={<BimPlaceholder />} />
                <Route path="updates" element={<ProjectUpdates />} />
              </Route>

              {/* Área Administrativa (HQ) */}
              <Route path="/hq" element={<HqLayout />}>
                <Route index element={<HqDashboard />} />
                <Route path="projects" element={<HqProjects />} />
                <Route path="clients" element={<HqClients />} />
              </Route>

              {/* Catch-all - Erro 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
