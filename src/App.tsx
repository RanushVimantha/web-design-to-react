import { useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";

const queryClient = new QueryClient();

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          {/* Header accepts callback to open modal */}
          <Header onAuthIconClick={() => setShowAuthModal(true)} />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* other routes can remain here */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Pop-up modal for login/register */}
          <AuthModal
            open={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
          <Sonner />
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
