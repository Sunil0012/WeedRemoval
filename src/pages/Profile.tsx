import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Phone, Building2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setFarmName(profile.farm_name || "");
      setLocation(profile.location || "");
      setContactPhone(profile.contact_phone || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        farm_name: farmName,
        location,
        contact_phone: contactPhone,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      await refreshProfile();
    }
    setSaving(false);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your farm owner profile</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-card-foreground">
                {fullName || "Farm Owner"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 rounded-xl" placeholder="Your name" />
              </div>
            </div>

            <div>
              <Label htmlFor="farmName">Farm Name</Label>
              <div className="relative mt-1.5">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="pl-10 rounded-xl" placeholder="Green Valley Farm" />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10 rounded-xl" placeholder="City, State" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Contact Phone</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="pl-10 rounded-xl" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full gap-2 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
