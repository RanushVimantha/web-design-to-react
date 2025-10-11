import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Tournaments from "./pages/Tournaments";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";
import Recruit from "./pages/Recruit";
import PlayerProfile from "./pages/PlayerProfile";
import Header from "./components/Header";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const AuthRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Auth />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Header onAuthIconClick={() => window.location.href = '/auth'} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthRedirect />} />
              <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/players/:id" element={<PlayerProfile />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/recruit" element={<Recruit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Sonner />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
