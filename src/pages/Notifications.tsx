import { Layout } from "@/components/layout/Layout";
import { Bell, AlertTriangle, CheckCircle2, Info, Bot, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Notification {
  id: string;
  type: "warning" | "error" | "success" | "info";
  title: string;
  message: string;
  time: string;
  rover?: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "warning",
    title: "Low Battery Warning",
    message: "Rover Beta battery at 23%. Returning to base station for charging.",
    time: "5 min ago",
    rover: "Rover Beta",
    read: false,
  },
  {
    id: "n2",
    type: "error",
    title: "Tool Malfunction Detected",
    message: "Cutter blade sensor reporting abnormal vibration. Manual inspection recommended.",
    time: "1 hr ago",
    rover: "Rover Beta",
    read: false,
  },
  {
    id: "n3",
    type: "success",
    title: "Zone Completed",
    message: "Zone A-3 has been fully processed. 142 weeds removed, 4.2 acres covered.",
    time: "2 hrs ago",
    rover: "Rover Alpha",
    read: false,
  },
  {
    id: "n4",
    type: "info",
    title: "Firmware Update Available",
    message: "Version 2.4.1 is available for Rover Gamma. Includes improved obstacle detection.",
    time: "4 hrs ago",
    rover: "Rover Gamma",
    read: true,
  },
  {
    id: "n5",
    type: "warning",
    title: "Geofence Alert",
    message: "Rover Alpha approached boundary of restricted zone C-2. Auto-corrected path.",
    time: "6 hrs ago",
    rover: "Rover Alpha",
    read: true,
  },
];

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  error: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  info: { icon: Info, color: "text-info", bg: "bg-info/10", border: "border-info/20" },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Alerts & Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {notifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={notification.id}
              variants={item}
              layout
              className={`relative rounded-2xl border bg-card p-4 shadow-card transition-all ${
                notification.read
                  ? "border-border opacity-70"
                  : `${config.border} border-l-4`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-xl p-2.5 ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        {notification.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={() => dismiss(notification.id)}
                      className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    {notification.rover && (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Bot className="h-3 w-3" />
                        {notification.rover}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Layout>
  );
}
