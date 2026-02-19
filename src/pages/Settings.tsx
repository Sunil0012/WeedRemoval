import { Layout } from "@/components/layout/Layout";
import { Bot, User, MapPin, Shield, Bell, Gauge, Ruler } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure rover behavior, preferences, and safety controls
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rover Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-card-foreground">
              Rover Configuration
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Max Speed Limit
              </label>
              <p className="mb-3 text-xs text-muted-foreground">
                Maximum traversal speed in km/h
              </p>
              <Slider defaultValue={[5]} max={15} step={1} className="w-full" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>1 km/h</span>
                <span>15 km/h</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">
                Detection Confidence Threshold
              </label>
              <p className="mb-3 text-xs text-muted-foreground">
                Minimum AI confidence to classify as weed
              </p>
              <Slider defaultValue={[75]} max={100} step={5} className="w-full" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">
                Tool Sensitivity
              </label>
              <p className="mb-3 text-xs text-muted-foreground">
                Responsiveness of weed removal tools
              </p>
              <Slider defaultValue={[60]} max={100} step={5} className="w-full" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            <h2 className="font-display text-lg font-semibold text-card-foreground">
              Safety Controls
            </h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Laser Safety Lock
                </p>
                <p className="text-xs text-muted-foreground">
                  Require confirmation before laser activation
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Auto-Stop on Obstacle
                </p>
                <p className="text-xs text-muted-foreground">
                  Immediately halt when obstacle detected
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Geofence Enforcement
                </p>
                <p className="text-xs text-muted-foreground">
                  Prevent rover from leaving designated zones
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">
                Obstacle Stop Distance
              </label>
              <p className="mb-3 text-xs text-muted-foreground">
                Minimum distance before emergency stop (cm)
              </p>
              <Slider defaultValue={[30]} max={100} step={5} className="w-full" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>10 cm</span>
                <span>100 cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-semibold text-card-foreground">
              Notification Preferences
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Low battery alerts", desc: "When rover battery drops below 25%", default: true },
              { label: "Obstacle detection", desc: "Alert when obstacles are detected", default: true },
              { label: "Tool malfunction", desc: "Immediate notification on tool errors", default: true },
              { label: "Zone completed", desc: "When a zone finishes processing", default: true },
              { label: "Rover offline", desc: "When a rover loses connection", default: true },
              { label: "Daily summary", desc: "End-of-day performance report", default: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <Switch defaultChecked={pref.default} />
              </div>
            ))}
          </div>
        </div>

        {/* User Preferences */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-info" />
            <h2 className="font-display text-lg font-semibold text-card-foreground">
              User Preferences
            </h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Unit System
                </p>
                <p className="text-xs text-muted-foreground">
                  Measurement units for distances and areas
                </p>
              </div>
              <div className="flex gap-1 rounded-lg bg-background p-1">
                <button className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Metric
                </button>
                <button className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  Imperial
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="mb-1 text-sm font-medium text-card-foreground">
                Farm Location
              </p>
              <p className="text-xs text-muted-foreground">
                Used for weather data and satellite imagery
              </p>
              <div className="mt-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-info" />
                <span className="text-sm text-card-foreground">
                  Green Valley Farm, CA
                </span>
                <button className="ml-auto text-xs font-medium text-primary hover:underline">
                  Change
                </button>
              </div>
            </div>

            <Button className="w-full rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
