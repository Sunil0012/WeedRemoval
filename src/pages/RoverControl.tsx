import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Bot, Battery, MapPin, Scissors, Hand, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  StopCircle, Play, Home, Wifi, WifiOff, ChevronLeft, Camera, Settings, Shield
} from "lucide-react";
import { motion } from "framer-motion";

type ToolType = "cutter" | "plucking" | "laser" | "none";

export default function RoverControl() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rover, setRover] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [controlMode, setControlMode] = useState<"autonomous" | "semi" | "manual">("autonomous");
  const [selectedTool, setSelectedTool] = useState<ToolType>("none");
  const [speed, setSpeed] = useState([5]);

  useEffect(() => {
    if (!id) return;
    const fetchRover = async () => {
      const { data } = await supabase.from("rovers").select("*").eq("id", id).single();
      if (data) {
        setRover(data);
        setSelectedTool(data.active_tool as ToolType);
        setSpeed([data.speed_limit || 5]);
      }
      setLoading(false);
    };
    fetchRover();
  }, [id]);

  const updateRover = async (updates: Record<string, any>) => {
    if (!id) return;
    await supabase.from("rovers").update(updates).eq("id", id);
    setRover((prev: any) => ({ ...prev, ...updates }));
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-64"><Bot className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!rover) {
    return <Layout><div className="text-center py-16"><p className="text-muted-foreground">Rover not found</p></div></Layout>;
  }

  const tools: { key: ToolType; icon: any; label: string; color: string }[] = [
    { key: "cutter", icon: Scissors, label: "Cutter", color: "bg-success/10 text-success border-success/30" },
    { key: "plucking", icon: Hand, label: "Plucking", color: "bg-warning/10 text-warning border-warning/30" },
    { key: "laser", icon: Zap, label: "Laser", color: "bg-destructive/10 text-destructive border-destructive/30" },
  ];

  return (
    <Layout>
      <button onClick={() => navigate("/rovers")} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Rovers
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{rover.name}</h1>
            <p className="text-sm text-muted-foreground">{rover.rover_id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
          rover.status === "working" ? "bg-info/10 text-info" :
          rover.status === "online" ? "bg-success/10 text-success" :
          rover.status === "charging" ? "bg-warning/10 text-warning" :
          "bg-muted text-muted-foreground"
        }`}>
          {rover.status === "offline" ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          {rover.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status cards */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground flex items-center gap-2"><Battery className="h-4 w-4" /> Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Battery</span><span className="font-semibold text-card-foreground">{rover.battery}%</span></div>
              <div className="h-2 rounded-full bg-secondary"><div className={`h-full rounded-full ${rover.battery > 50 ? 'bg-success' : rover.battery > 20 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${rover.battery}%` }} /></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Zone</span><span className="font-semibold text-card-foreground">{rover.current_zone || "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Weeds Removed</span><span className="font-semibold text-card-foreground">{rover.weeds_removed}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Area</span><span className="font-semibold text-card-foreground">{rover.area || "—"}</span></div>
            </div>
          </div>

          {/* Camera placeholder */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground flex items-center gap-2"><Camera className="h-4 w-4" /> Live Feed</h3>
            <div className="flex h-40 items-center justify-center rounded-xl bg-secondary">
              <div className="text-center">
                <Camera className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-xs text-muted-foreground">Camera feed unavailable</p>
                <p className="text-[10px] text-muted-foreground/60">Connect rover for live view</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Control Mode */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground flex items-center gap-2"><Settings className="h-4 w-4" /> Control Mode</h3>
            <div className="flex gap-2">
              {(["autonomous", "semi", "manual"] as const).map((mode) => (
                <button key={mode} onClick={() => setControlMode(mode)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize transition-all ${
                    controlMode === mode ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >{mode === "semi" ? "Semi-Auto" : mode}</button>
              ))}
            </div>
          </div>

          {/* Direction pad (manual mode) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground">Direction Control</h3>
            <div className="grid grid-cols-3 gap-2 mx-auto max-w-[200px]">
              <div />
              <Button variant="outline" size="icon" className="rounded-xl h-14 w-full" disabled={controlMode === "autonomous"}><ArrowUp className="h-5 w-5" /></Button>
              <div />
              <Button variant="outline" size="icon" className="rounded-xl h-14 w-full" disabled={controlMode === "autonomous"}><ArrowLeft className="h-5 w-5" /></Button>
              <Button variant="destructive" size="icon" className="rounded-xl h-14 w-full"><StopCircle className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-xl h-14 w-full" disabled={controlMode === "autonomous"}><ArrowRight className="h-5 w-5" /></Button>
              <div />
              <Button variant="outline" size="icon" className="rounded-xl h-14 w-full" disabled={controlMode === "autonomous"}><ArrowDown className="h-5 w-5" /></Button>
              <div />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">Speed: {speed[0]} km/h</label>
              <Slider value={speed} onValueChange={setSpeed} max={15} step={1} className="mt-2" />
            </div>
          </div>

          {/* Emergency */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="destructive" className="h-14 rounded-xl gap-2 text-sm font-bold"><StopCircle className="h-5 w-5" />EMERGENCY STOP</Button>
            <Button className="h-14 rounded-xl gap-2 bg-success text-success-foreground hover:bg-success/90 text-sm font-bold"><Home className="h-5 w-5" />Return Base</Button>
          </div>
        </div>

        {/* Tools & Safety */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground flex items-center gap-2"><Scissors className="h-4 w-4" /> Tool Selection</h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button key={tool.key} onClick={() => { setSelectedTool(tool.key); updateRover({ active_tool: tool.key }); }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-all ${
                    selectedTool === tool.key ? tool.color + " border-2" : "border-border hover:bg-secondary/50"
                  }`}>
                  <tool.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{tool.label}</span>
                  {selectedTool === tool.key && <span className="ml-auto text-xs font-semibold">Active</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-display font-semibold text-card-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> Safety</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Laser Lock</span>
                <Switch checked={rover.laser_lock} onCheckedChange={(v) => updateRover({ laser_lock: v })} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Geofence</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Obstacle Stop</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
