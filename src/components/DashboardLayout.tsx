import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const { theme, toggle } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card px-4 sticky top-0 z-40">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h1 className="text-lg font-semibold font-display truncate">{title}</h1>
              {subtitle && <span className="text-sm text-muted-foreground hidden sm:inline">— {subtitle}</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
          <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
            © {new Date().getFullYear()} HireSight
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
