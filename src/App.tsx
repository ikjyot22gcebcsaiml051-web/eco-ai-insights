import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Models from "./pages/Models";
import ModelDetail from "./pages/ModelDetail";
import Compare from "./pages/Compare";
import Graphs from "./pages/Graphs";
import Recommendation from "./pages/Recommendation";
import UploadChat from "./pages/UploadChat";
import About from "./pages/About";
import PromptEstimator from "./pages/PromptEstimator";
import PromptRefiner from "./pages/PromptRefiner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/models" element={<ProtectedRoute><Models /></ProtectedRoute>} />
          <Route path="/models/:modelId" element={<ProtectedRoute><ModelDetail /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
          <Route path="/graphs" element={<ProtectedRoute><Graphs /></ProtectedRoute>} />
          <Route path="/recommendation" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
          <Route path="/upload-chat" element={<ProtectedRoute><UploadChat /></ProtectedRoute>} />
          <Route path="/prompt-estimator" element={<ProtectedRoute><PromptEstimator /></ProtectedRoute>} />
          <Route path="/prompt-refiner" element={<ProtectedRoute><PromptRefiner /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
