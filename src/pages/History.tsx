import { Layout } from "@/components/layout/Layout";
import { Clock, Bot, MapPin, Leaf, Scissors, Hand, Zap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const sessions = [
  {
    id: "S-001",
    date: "2026-02-09",
    time: "06:00 - 10:30",
    rover: "Rover Alpha",
    zone: "Zone A-3",
    weedsRemoved: 342,
    tool: "Cutter",
    toolIcon: Scissors,
    area: "4.2 acres",
    status: "completed",
  },
  {
    id: "S-002",
    date: "2026-02-09",
    time: "07:15 - 11:45",
    rover: "Rover Gamma",
    zone: "Zone B-1",
    weedsRemoved: 287,
    tool: "Laser",
    toolIcon: Zap,
    area: "3.5 acres",
    status: "completed",
  },
  {
    id: "S-003",
    date: "2026-02-08",
    time: "06:30 - 09:00",
    rover: "Rover Beta",
    zone: "Zone A-2",
    weedsRemoved: 198,
    tool: "Plucking Hand",
    toolIcon: Hand,
    area: "2.1 acres",
    status: "completed",
  },
  {
    id: "S-004",
    date: "2026-02-08",
    time: "05:45 - 12:15",
    rover: "Rover Alpha",
    zone: "Zone A-1",
    weedsRemoved: 520,
    tool: "Cutter",
    toolIcon: Scissors,
    area: "5.8 acres",
    status: "completed",
  },
  {
    id: "S-005",
    date: "2026-02-07",
    time: "07:00 - 10:00",
    rover: "Rover Gamma",
    zone: "Zone C-1",
    weedsRemoved: 156,
    tool: "Laser",
    toolIcon: Zap,
    area: "2.8 acres",
    status: "interrupted",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export default function History() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          Session History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review past operations and rover performance logs
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {sessions.map((session) => {
          const ToolIcon = session.toolIcon;
          return (
            <motion.div
              key={session.id}
              variants={item}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 cursor-pointer"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-1 gap-2 sm:grid-cols-5 sm:items-center">
                <div className="sm:col-span-2">
                  <p className="font-semibold text-card-foreground">
                    {session.rover}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{session.date} · {session.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm sm:col-span-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-info" />
                    <span className="text-card-foreground">{session.zone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-success" />
                    <span className="font-medium text-card-foreground">
                      {session.weedsRemoved}
                    </span>
                  </div>
                  <div className="hidden items-center gap-1.5 md:flex">
                    <ToolIcon className="h-3.5 w-3.5 text-accent" />
                    <span className="text-card-foreground">{session.tool}</span>
                  </div>
                  <span className="hidden text-xs text-muted-foreground lg:block">
                    {session.area}
                  </span>
                  {session.status === "interrupted" && (
                    <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                      Interrupted
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </motion.div>
    </Layout>
  );
}
