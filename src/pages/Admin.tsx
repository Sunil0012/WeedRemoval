import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Bot, AlertTriangle, Activity, Shield, Trash2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  farm_name: string | null;
  location: string | null;
  created_at: string;
}

interface RoverInfo {
  id: string;
  name: string;
  rover_id: string;
  status: string;
  battery: number;
  user_id: string;
}

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [rovers, setRovers] = useState<RoverInfo[]>([]);
  const [tab, setTab] = useState<"users" | "rovers" | "monitoring">("users");

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [usersRes, roversRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("rovers").select("*"),
      ]);
      setUsers(usersRes.data || []);
      setRovers(roversRes.data || []);
    };
    fetchData();
  }, [isAdmin]);

  if (loading) return <Layout><div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div></Layout>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const onlineRovers = rovers.filter((r) => r.status !== "offline").length;
  const lowBatteryRovers = rovers.filter((r) => r.battery < 25).length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Admin Panel
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage users, rovers, and system health</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={users.length} icon={Users} iconColor="bg-primary/10 text-primary" />
        <StatsCard title="Total Rovers" value={rovers.length} icon={Bot} iconColor="bg-info/10 text-info" />
        <StatsCard title="Rovers Online" value={onlineRovers} icon={Activity} iconColor="bg-success/10 text-success" />
        <StatsCard title="Low Battery" value={lowBatteryRovers} change="Need attention" changeType={lowBatteryRovers > 0 ? "negative" : "neutral"} icon={AlertTriangle} iconColor="bg-warning/10 text-warning" />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {(["users", "rovers", "monitoring"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Users tab */}
      {tab === "users" && (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Farm</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium text-card-foreground">{u.full_name || "—"}</td>
                  <td className="px-4 py-3 text-card-foreground">{u.farm_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.location || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rovers tab */}
      {tab === "rovers" && (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Battery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rovers.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium text-card-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.rover_id}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === "online" ? "bg-success/10 text-success" :
                    r.status === "working" ? "bg-info/10 text-info" :
                    r.status === "charging" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-card-foreground">{r.battery}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Monitoring tab */}
      {tab === "monitoring" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-success/10 p-3">
                <span className="text-sm text-card-foreground">Database</span>
                <span className="text-xs font-medium text-success">Operational</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-success/10 p-3">
                <span className="text-sm text-card-foreground">Authentication</span>
                <span className="text-xs font-medium text-success">Operational</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-success/10 p-3">
                <span className="text-sm text-card-foreground">Real-time Sync</span>
                <span className="text-xs font-medium text-success">Operational</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground">Rover Fleet Overview</h3>
            <div className="space-y-3">
              {rovers.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{r.battery}%</span>
                    <span className={`h-2 w-2 rounded-full ${
                      r.status === "offline" ? "bg-muted-foreground" : "bg-success animate-pulse"
                    }`} />
                  </div>
                </div>
              ))}
              {rovers.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No rovers registered</p>}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
