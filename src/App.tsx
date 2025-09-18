import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";  // new login page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* your existing homepage */}
          <Route path="/" element={<Index />} />
          {/* new login route */}
          <Route path="/login" element={<Login />} />
          {/* add other custom routes here */}
          {/* fallback 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* global notifications */}
        <Sonner />
        <Toaster />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
