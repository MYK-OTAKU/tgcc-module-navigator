import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModuleProvider } from "./contexts/ModuleContext";
import Navigation from "./components/Navigation";
import ModulesPage from "./pages/ModulesPage";
import AddModulePage from "./pages/AddModulePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ModuleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<ModulesPage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/add" element={<AddModulePage />} />
              <Route path="/add-module" element={<AddModulePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ModuleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
