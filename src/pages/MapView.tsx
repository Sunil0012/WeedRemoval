import { Layout } from "@/components/layout/Layout";
import { MapPin, Layers, Plus, Square, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const statusBadge: Record<string, { label: string; class: string }> = {
  completed: { label: "Completed", class: "bg-success/10 text-success" },
  in_progress: { label: "In Progress", class: "bg-info/10 text-info" },
  pending: { label: "Pending", class: "bg-muted text-muted-foreground" },
  restricted: { label: "Restricted", class: "bg-destructive/10 text-destructive" },
};

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { user } = useAuth();
  const [zones, setZones] = useState<any[]>([]);
  const [rovers, setRovers] = useState<any[]>([]);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [zonesRes, roversRes] = await Promise.all([
        supabase.from("field_zones").select("*").eq("user_id", user.id),
        supabase.from("rovers").select("*").eq("user_id", user.id),
      ]);
      setZones(zonesRes.data || []);
      setRovers(roversRes.data || []);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 13);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Add rover markers
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add zone circles
    zones.forEach((zone) => {
      if (zone.latitude && zone.longitude) {
        const color = zone.status === "completed" ? "#22c55e" : zone.status === "in_progress" ? "#3b82f6" : zone.status === "restricted" ? "#ef4444" : "#94a3b8";
        L.circle([zone.latitude, zone.longitude], {
          radius: zone.radius || 100,
          color,
          fillColor: color,
          fillOpacity: 0.15,
        }).addTo(map).bindPopup(`<b>${zone.name}</b><br/>Status: ${zone.status}`);
      }
    });

    // Add rover markers
    rovers.forEach((rover, i) => {
      // Place rovers at slight offsets from center if no GPS data
      const lat = 37.7749 + (i * 0.005);
      const lng = -122.4194 + (i * 0.003);
      const color = rover.status === "working" ? "#3b82f6" : rover.status === "online" ? "#22c55e" : rover.status === "charging" ? "#f59e0b" : "#94a3b8";

      const icon = L.divIcon({
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg></div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([lat, lng], { icon }).addTo(map).bindPopup(`<b>${rover.name}</b><br/>${rover.rover_id}<br/>Battery: ${rover.battery}%<br/>Status: ${rover.status}`);
    });
  }, [zones, rovers]);

  const toggleMapType = () => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    if (mapType === "street") {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri",
      }).addTo(map);
      setMapType("satellite");
    } else {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      setMapType("street");
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Map View</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time GPS tracking and field zones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={toggleMapType}>
            <Layers className="h-4 w-4" />
            {mapType === "street" ? "Satellite" : "Street"}
          </Button>
          <Button className="gap-2 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" />
            New Zone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <div ref={mapRef} className="h-[500px] rounded-2xl border border-border shadow-card overflow-hidden z-0" />
        </div>

        {/* Zone panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display font-semibold text-card-foreground">Field Zones</h3>
            <div className="space-y-2">
              {zones.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No zones created yet</p>
              )}
              {zones.map((zone) => {
                const badge = statusBadge[zone.status] || statusBadge.pending;
                return (
                  <div key={zone.id} className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Square className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-card-foreground">{zone.name}</span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.class}`}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rovers on map */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-sm font-semibold text-card-foreground">Active Rovers</h3>
            <div className="space-y-2">
              {rovers.filter(r => r.status !== "offline").map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    r.status === "working" ? "bg-info" : r.status === "online" ? "bg-success" : "bg-warning"
                  } animate-pulse`} />
                  <span className="text-xs text-card-foreground">{r.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{r.battery}%</span>
                </div>
              ))}
              {rovers.filter(r => r.status !== "offline").length === 0 && (
                <p className="text-xs text-muted-foreground text-center">No active rovers</p>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-sm font-semibold text-card-foreground">Legend</h3>
            <div className="space-y-2">
              {[
                { color: "bg-success", label: "Completed" },
                { color: "bg-info", label: "In Progress" },
                { color: "bg-muted-foreground", label: "Pending" },
                { color: "bg-destructive", label: "Restricted" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
