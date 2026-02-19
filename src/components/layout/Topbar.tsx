import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-card">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rovers, zones, tasks..."
            className="h-10 w-72 rounded-xl border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Connection status */}
        <div className="mr-2 hidden items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
          <span className="text-xs font-medium text-success">Connected</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </Button>

        {/* Profile */}
        <Button variant="ghost" className="gap-2 rounded-xl px-3" onClick={() => navigate("/profile")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium md:block">
            {profile?.full_name || "Farm Owner"}
          </span>
        </Button>
      </div>
    </header>
  );
}
