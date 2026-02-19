import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RoverCard } from "@/components/dashboard/RoverCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Bot, Leaf, MapPin, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const rovers = [
  {
    name: "Rover Alpha",
    id: "RV-001-A",
    status: "working" as const,
    battery: 78,
    currentZone: "Zone A-3",
    weedsRemoved: 1247,
    activeTool: "cutter" as const,
    area: "North Field — 4.2 acres",
  },
  {
    name: "Rover Beta",
    id: "RV-002-B",
    status: "charging" as const,
    battery: 23,
    currentZone: "Base Station",
    weedsRemoved: 892,
    activeTool: "none" as const,
    area: "East Field — 3.8 acres",
  },
  {
    name: "Rover Gamma",
    id: "RV-003-G",
    status: "online" as const,
    battery: 95,
    currentZone: "Zone B-1",
    weedsRemoved: 2034,
    activeTool: "laser" as const,
    area: "South Field — 5.1 acres",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your rovers and field operations in real-time
        </p>
      </div>

      {/* Stats Row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <StatsCard
            title="Active Rovers"
            value="3"
            change="All operational"
            changeType="positive"
            icon={Bot}
            iconColor="bg-primary/10 text-primary"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Weeds Removed"
            value="4,173"
            change="+12% from yesterday"
            changeType="positive"
            icon={Leaf}
            iconColor="bg-success/10 text-success"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Area Covered"
            value="13.1 ac"
            change="67% of total fields"
            changeType="neutral"
            icon={MapPin}
            iconColor="bg-info/10 text-info"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Efficiency"
            value="94%"
            change="+3% this week"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-accent/10 text-accent"
          />
        </motion.div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left — Rovers */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Your Rovers
            </h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View All →
            </button>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3"
          >
            {rovers.map((rover) => (
              <motion.div key={rover.id} variants={item}>
                <RoverCard {...rover} />
              </motion.div>
            ))}
          </motion.div>

          {/* Map preview */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-display font-semibold text-card-foreground">
                  Field Overview
                </h3>
              </div>
              <button className="text-xs font-medium text-primary hover:underline">
                Open Full Map →
              </button>
            </div>
            <div className="relative h-48 overflow-hidden rounded-xl bg-secondary">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Interactive map view
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    GPS integration ready
                  </p>
                </div>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              {/* Mock rover dots */}
              <div className="absolute top-1/3 left-1/4 h-3 w-3 rounded-full bg-success animate-pulse-dot" />
              <div className="absolute top-1/2 right-1/3 h-3 w-3 rounded-full bg-warning animate-pulse-dot" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/3 left-1/2 h-3 w-3 rounded-full bg-info animate-pulse-dot" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <ActivityFeed />
        </div>
      </div>
    </Layout>
  );
}
