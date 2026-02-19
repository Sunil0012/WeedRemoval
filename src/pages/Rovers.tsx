import { Layout } from "@/components/layout/Layout";
import { RoverCard } from "@/components/dashboard/RoverCard";
import { AddRoverDialog } from "@/components/AddRoverDialog";
import { Search, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Rovers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rovers, setRovers] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchRovers = async () => {
    if (!user) return;
    const { data } = await supabase.from("rovers").select("*").eq("user_id", user.id);
    setRovers(data || []);
  };

  useEffect(() => { fetchRovers(); }, [user]);

  const filtered = rovers.filter((r) => {
    if (filter !== "All" && r.status !== filter.toLowerCase()) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.rover_id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Rovers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and monitor all registered rovers</p>
        </div>
        <AddRoverDialog onAdded={fetchRovers} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rovers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Online", "Working", "Charging", "Offline"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((rover) => (
          <motion.div key={rover.id} variants={item} onClick={() => navigate(`/rovers/${rover.id}`)} className="cursor-pointer">
            <RoverCard
              name={rover.name}
              id={rover.rover_id}
              status={rover.status as any}
              battery={rover.battery}
              currentZone={rover.current_zone || "—"}
              weedsRemoved={rover.weeds_removed}
              activeTool={rover.active_tool as any}
              area={rover.area || "—"}
            />
          </motion.div>
        ))}

        {/* Add rover card */}
        <motion.div variants={item}>
          <AddRoverDialog onAdded={fetchRovers} />
        </motion.div>
      </motion.div>

      {filtered.length === 0 && rovers.length === 0 && (
        <div className="text-center py-16">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">No rovers registered yet</p>
          <p className="text-sm text-muted-foreground/60">Click "Add Rover" to register your first rover</p>
        </div>
      )}
    </Layout>
  );
}
