import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddRoverDialogProps {
  onAdded?: () => void;
}

export function AddRoverDialog({ onAdded }: AddRoverDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [roverId, setRoverId] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!user || !name || !roverId) return;
    setLoading(true);

    const { error } = await supabase.from("rovers").insert({
      user_id: user.id,
      name,
      rover_id: roverId,
      area,
      status: "offline",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rover registered successfully" });
      setName("");
      setRoverId("");
      setArea("");
      setOpen(false);
      onAdded?.();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Rover
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Bot className="h-5 w-5 text-primary" />
            Register New Rover
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="roverName">Rover Name</Label>
            <Input id="roverName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rover Alpha" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="roverId">Rover ID / QR Code</Label>
            <Input id="roverId" value={roverId} onChange={(e) => setRoverId(e.target.value)} placeholder="RV-001-A" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="area">Assigned Area</Label>
            <Input id="area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="North Field — 4.2 acres" className="mt-1.5 rounded-xl" />
          </div>
          <Button onClick={handleAdd} disabled={loading || !name || !roverId} className="w-full rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
            {loading ? "Registering..." : "Register Rover"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
