import { Link, useLocation } from "react-router-dom";
import { Play, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="w-full px-4 flex items-center justify-between">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          <nav className="flex gap-2">
            <Button
              asChild
              variant={location.pathname === "/" || location.pathname === "/new" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "text-primary-foreground",
                location.pathname === "/" || location.pathname === "/new" 
                  ? "bg-primary-foreground/20" 
                  : "hover:bg-primary-foreground/10"
              )}
            >
              <Link to="/new">
                <Play className="w-4 h-4 mr-2" />
                Nueva Optimización
              </Link>
            </Button>
            <Button
              asChild
              variant={location.pathname === "/history" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "text-primary-foreground",
                location.pathname === "/history"
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
              )}
            >
              <Link to="/history">
                <History className="w-4 h-4 mr-2" />
                Ejecuciones Anteriores
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="w-full pl-4 pt-4 pb-4 pr-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;

