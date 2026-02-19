import { Clock, AlertTriangle, CheckCircle2, Bot, Leaf } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "success" | "warning" | "info" | "error";
  message: string;
  time: string;
  rover?: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "success",
    message: "Zone A-3 completed — 142 weeds removed",
    time: "5 min ago",
    rover: "Rover Alpha",
  },
  {
    id: "2",
    type: "warning",
    message: "Low battery warning — returning to base",
    time: "12 min ago",
    rover: "Rover Beta",
  },
  {
    id: "3",
    type: "info",
    message: "New zone B-1 assigned and started",
    time: "25 min ago",
    rover: "Rover Alpha",
  },
  {
    id: "4",
    type: "success",
    message: "Obstacle avoided near fence line",
    time: "32 min ago",
    rover: "Rover Gamma",
  },
  {
    id: "5",
    type: "error",
    message: "Tool malfunction detected — cutter blade",
    time: "1 hr ago",
    rover: "Rover Beta",
  },
  {
    id: "6",
    type: "success",
    message: "Morning patrol completed — 2.3 acres covered",
    time: "2 hrs ago",
    rover: "Rover Alpha",
  },
];

const typeConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  info: { icon: Bot, color: "text-info", bg: "bg-info/10" },
  error: {
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-card-foreground">
            Recent Activity
          </h3>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-1">
        {activities.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-secondary/50"
            >
              <div className={`mt-0.5 rounded-lg p-1.5 ${config.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">
                  {activity.message}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {activity.rover && (
                    <span className="text-[11px] font-medium text-primary">
                      {activity.rover}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
