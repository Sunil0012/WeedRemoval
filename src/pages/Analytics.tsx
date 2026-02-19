import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Leaf, MapPin, Clock, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

const weeklyData = [
  { day: "Mon", weeds: 520, area: 3.2 },
  { day: "Tue", weeds: 680, area: 4.1 },
  { day: "Wed", weeds: 590, area: 3.8 },
  { day: "Thu", weeds: 720, area: 4.5 },
  { day: "Fri", weeds: 830, area: 5.0 },
  { day: "Sat", weeds: 450, area: 2.8 },
  { day: "Sun", weeds: 380, area: 2.3 },
];

const toolUsage = [
  { name: "Cutter", value: 45, color: "hsl(152, 55%, 28%)" },
  { name: "Plucking", value: 30, color: "hsl(38, 92%, 50%)" },
  { name: "Laser", value: 25, color: "hsl(210, 80%, 52%)" },
];

const batteryData = [
  { time: "6AM", alpha: 100, beta: 95, gamma: 100 },
  { time: "8AM", alpha: 88, beta: 78, gamma: 92 },
  { time: "10AM", alpha: 72, beta: 55, gamma: 80 },
  { time: "12PM", alpha: 58, beta: 30, gamma: 65 },
  { time: "2PM", alpha: 42, beta: 100, gamma: 48 },
  { time: "4PM", alpha: 78, beta: 85, gamma: 35 },
  { time: "6PM", alpha: 65, beta: 70, gamma: 100 },
];

const efficiencyData = [
  { week: "W1", efficiency: 82 },
  { week: "W2", efficiency: 85 },
  { week: "W3", efficiency: 88 },
  { week: "W4", efficiency: 91 },
  { week: "W5", efficiency: 89 },
  { week: "W6", efficiency: 94 },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance insights and weed removal statistics
          </p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Weeds Removed"
          value="4,173"
          change="+340 today"
          changeType="positive"
          icon={Leaf}
          iconColor="bg-success/10 text-success"
        />
        <StatsCard
          title="Total Area Covered"
          value="25.7 ac"
          change="This week"
          changeType="neutral"
          icon={MapPin}
          iconColor="bg-info/10 text-info"
        />
        <StatsCard
          title="Avg. Session Time"
          value="4.2 hrs"
          change="+0.3 hrs from last week"
          changeType="positive"
          icon={Clock}
          iconColor="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Avg. Efficiency"
          value="94%"
          change="+6% this month"
          changeType="positive"
          icon={Zap}
          iconColor="bg-primary/10 text-primary"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weeds removed bar chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display font-semibold text-card-foreground">
            Weeds Removed (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 12%, 89%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(80, 12%, 89%)",
                  boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="weeds" fill="hsl(152, 55%, 28%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tool usage pie chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display font-semibold text-card-foreground">
            Tool Usage Distribution
          </h3>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={280}>
              <PieChart>
                <Pie
                  data={toolUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {toolUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {toolUsage.map((tool) => (
                <div key={tool.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tool.color }}
                  />
                  <span className="text-sm text-card-foreground">{tool.name}</span>
                  <span className="ml-auto text-sm font-semibold text-card-foreground">
                    {tool.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Battery trends */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display font-semibold text-card-foreground">
            Battery Levels (Today)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={batteryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 12%, 89%)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(80, 12%, 89%)",
                  boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
                }}
              />
              <Line type="monotone" dataKey="alpha" stroke="hsl(152, 55%, 28%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="beta" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="gamma" stroke="hsl(210, 80%, 52%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex justify-center gap-4">
            {[
              { name: "Alpha", color: "bg-primary" },
              { name: "Beta", color: "bg-warning" },
              { name: "Gamma", color: "bg-info" },
            ].map((rover) => (
              <div key={rover.name} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${rover.color}`} />
                <span className="text-xs text-muted-foreground">{rover.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency trend */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display font-semibold text-card-foreground">
            Efficiency Trend (6 Weeks)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 12%, 89%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" domain={[70, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(80, 12%, 89%)",
                  boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="hsl(152, 55%, 28%)"
                fill="hsl(152, 55%, 28%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
