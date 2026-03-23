import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, LayoutDashboard } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 text-[8rem] font-bold font-display leading-none text-secondary/20 select-none">
          404
        </div>
        <h1 className="text-2xl font-bold font-display mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The route <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{location.pathname}</code> doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <Home className="w-4 h-4" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
