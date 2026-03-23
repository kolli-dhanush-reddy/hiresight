import { Component, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mb-6">{(this.state.error as Error).message}</p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = "/dashboard"; }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CompanyIntelligence from "./pages/CompanyIntelligence";
import CompanyComparison from "./pages/CompanyComparison";
import SkillMapping from "./pages/SkillMapping";
import TrendsAndPredictions from "./pages/TrendsAndPredictions";
import RejectionAnalysis from "./pages/RejectionAnalysis";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/companies"  element={<ProtectedRoute><CompanyIntelligence /></ProtectedRoute>} />
            <Route path="/comparison" element={<ProtectedRoute><CompanyComparison /></ProtectedRoute>} />
            <Route path="/skills"     element={<ProtectedRoute><SkillMapping /></ProtectedRoute>} />
            <Route path="/trends"     element={<ProtectedRoute><TrendsAndPredictions /></ProtectedRoute>} />
            <Route path="/rejections" element={<ProtectedRoute><RejectionAnalysis /></ProtectedRoute>} />
            <Route path="/admin"      element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
