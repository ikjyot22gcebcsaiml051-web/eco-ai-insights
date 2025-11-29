import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Models from "./pages/Models";
import ModelDetail from "./pages/ModelDetail";
import Compare from "./pages/Compare";
import Graphs from "./pages/Graphs";
import Recommendation from "./pages/Recommendation";
import LiveTracker from "./pages/LiveTracker";
import About from "./pages/About";
import PromptEstimator from "./pages/PromptEstimator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/models" element={<Models />} />
          <Route path="/models/:modelId" element={<ModelDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/live-tracker" element={<LiveTracker />} />
          <Route path="/prompt-estimator" element={<PromptEstimator />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
