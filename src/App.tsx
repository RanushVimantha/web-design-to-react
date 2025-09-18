import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Index />} />
          {/* Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Add other custom routes here */}
          {/* 404 fallback */}
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
