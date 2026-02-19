import { Button } from "@/components/ui/button";
import { StopCircle, Play, Home, AlertTriangle } from "lucide-react";

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 font-display font-semibold text-card-foreground">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="destructive"
          className="h-auto flex-col gap-2 rounded-xl py-4"
        >
          <StopCircle className="h-5 w-5" />
          <span className="text-xs font-semibold">STOP ALL</span>
        </Button>
        <Button
          className="h-auto flex-col gap-2 rounded-xl bg-success py-4 text-success-foreground hover:bg-success/90"
        >
          <Play className="h-5 w-5" />
          <span className="text-xs font-semibold">Resume All</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 rounded-xl py-4"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-semibold">Return Base</span>
        </Button>
        <Button
          className="h-auto flex-col gap-2 rounded-xl bg-warning py-4 text-warning-foreground hover:bg-warning/90"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-xs font-semibold">Alert Mode</span>
        </Button>
      </div>
    </div>
  );
}
