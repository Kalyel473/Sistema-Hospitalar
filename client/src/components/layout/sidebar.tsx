import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import UserAvatar from "./user-avatar";
import {
  LayoutDashboard,
  FileText,
  FileClock,
  ArrowLeft,
  Plus,
  BarChart3,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className={cn("flex flex-col w-64 bg-background border-r border-primary/20 h-screen fixed", className)}>
      <div className="p-5 border-b border-primary/20">
        <h1 className="font-sans text-xl font-bold text-foreground">HospitalSys</h1>
        <p className="text-muted-foreground text-xs">Sistema de Gerenciamento</p>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link 
          href="/"
          className={cn(
            "flex items-center px-4 py-3 text-sm rounded-md group transition-colors duration-200",
            location === "/" 
              ? "bg-primary/20 text-foreground" 
              : "text-muted-foreground hover:bg-primary/10"
          )}
        >
          <LayoutDashboard className={cn(
            "h-5 w-5 mr-3",
            location === "/" ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
          Dashboard
        </Link>

        <Link 
          href="/equipment-receiving"
          className={cn(
            "flex items-center px-4 py-3 text-sm rounded-md group transition-colors duration-200",
            location === "/equipment-receiving" 
              ? "bg-primary/20 text-foreground" 
              : "text-muted-foreground hover:bg-primary/10"
          )}
        >
          <FileText className={cn(
            "h-5 w-5 mr-3",
            location === "/equipment-receiving" ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
          Recebimento
        </Link>

        <Link 
          href="/cleaning-status"
          className={cn(
            "flex items-center px-4 py-3 text-sm rounded-md group transition-colors duration-200",
            location === "/cleaning-status" 
              ? "bg-primary/20 text-foreground" 
              : "text-muted-foreground hover:bg-primary/10"
          )}
        >
          <FileClock className={cn(
            "h-5 w-5 mr-3",
            location === "/cleaning-status" ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
          Status de Limpeza
        </Link>

        <Link 
          href="/equipment-return"
          className={cn(
            "flex items-center px-4 py-3 text-sm rounded-md group transition-colors duration-200",
            location === "/equipment-return" 
              ? "bg-primary/20 text-foreground" 
              : "text-muted-foreground hover:bg-primary/10"
          )}
        >
          <ArrowLeft className={cn(
            "h-5 w-5 mr-3",
            location === "/equipment-return" ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
          Devolução
        </Link>

        <Link 
          href="/equipment-management"
          className={cn(
            "flex items-center px-4 py-3 text-sm rounded-md group transition-colors duration-200",
            location === "/equipment-management" 
              ? "bg-primary/20 text-foreground" 
              : "text-muted-foreground hover:bg-primary/10"
          )}
        >
          <Plus className={cn(
            "h-5 w-5 mr-3",
            location === "/equipment-management" ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
          Cadastros
        </Link>

        <Link 
          href="/reports"
          className={cn(
            "flex items-center px-4 py-3 text-sm rounded-md group transition-colors duration-200",
            location === "/reports" 
              ? "bg-primary/20 text-foreground" 
              : "text-muted-foreground hover:bg-primary/10"
          )}
        >
          <BarChart3 className={cn(
            "h-5 w-5 mr-3",
            location === "/reports" ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
          Relatórios
        </Link>
      </nav>
      
      <div className="p-4 border-t border-primary/20">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} />
          <div>
            <p className="text-sm font-medium text-foreground">{user?.name || ""}</p>
            <p className="text-xs text-muted-foreground">{user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-foreground border border-primary/20 rounded-md hover:bg-primary/10 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </button>
      </div>
    </aside>
  );
}
