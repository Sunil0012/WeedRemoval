import { motion } from "framer-motion";
import {
  Battery,
  Wifi,
  WifiOff,
  Bot,
  MapPin,
  Scissors,
  Hand,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type RoverStatus = "online" | "offline" | "working" | "charging";

interface RoverCardProps {
  name: string;
  id: string;
  status: RoverStatus;
  battery: number;
  currentZone: string;
  weedsRemoved: number;
  activeTool: "cutter" | "plucking" | "laser" | "none";
  area: string;
}

const statusConfig: Record<
  RoverStatus,
  { label: string; color: string; dotColor: string }
> = {
  online: {
    label: "Online",
    color: "bg-success/10 text-success",
    dotColor: "bg-success",
  },
  offline: {
    label: "Offline",
    color: "bg-muted text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  working: {
    label: "Working",
    color: "bg-info/10 text-info",
    dotColor: "bg-info",
  },
  charging: {
    label: "Charging",
    color: "bg-warning/10 text-warning",
    dotColor: "bg-warning",
  },
};

const toolIcons = {
  cutter: { icon: Scissors, label: "Cutter" },
  plucking: { icon: Hand, label: "Plucking Hand" },
  laser: { icon: Zap, label: "Laser" },
  none: { icon: Bot, label: "None" },
};

export function RoverCard({
  name,
  id,
  status,
  battery,
  currentZone,
  weedsRemoved,
  activeTool,
  area,
}: RoverCardProps) {
  const config = statusConfig[status];
  const ToolIcon = toolIcons[activeTool].icon;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-card-foreground">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">{id}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${config.dotColor} ${
              status === "working" ? "animate-pulse-dot" : ""
            }`}
          />
          {config.label}
        </span>
      </div>

      {/* Stats grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Battery
              className={`h-3.5 w-3.5 ${
                battery > 50
                  ? "text-success"
                  : battery > 20
                  ? "text-warning"
                  : "text-destructive"
              }`}
            />
            <span className="text-xs text-muted-foreground">Battery</span>
          </div>
          <p className="mt-0.5 font-display text-sm font-bold text-card-foreground">
            {battery}%
          </p>
        </div>
        <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-info" />
            <span className="text-xs text-muted-foreground">Zone</span>
          </div>
          <p className="mt-0.5 text-sm font-bold text-card-foreground truncate">
            {currentZone}
          </p>
        </div>
        <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <ToolIcon className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs text-muted-foreground">Tool</span>
          </div>
          <p className="mt-0.5 text-sm font-bold text-card-foreground">
            {toolIcons[activeTool].label}
          </p>
        </div>
        <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            {status !== "offline" ? (
              <Wifi className="h-3.5 w-3.5 text-success" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">Weeds</span>
          </div>
          <p className="mt-0.5 font-display text-sm font-bold text-card-foreground">
            {weedsRemoved}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{area}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg text-xs font-medium text-primary hover:bg-primary/10"
        >
          View Details →
        </Button>
      </div>
    </motion.div>
  );
}
