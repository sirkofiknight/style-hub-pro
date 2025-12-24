import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Fabric {
  id: string;
  name: string;
  color: string | null;
  material_type: string | null;
  price_per_yard: number | null;
}

interface Measurement {
  id: string;
  profile_name: string;
  measurement_type: string;
}

const garmentTypes = [
  "Suit (2-piece)",
  "Suit (3-piece)",
  "Blazer",
  "Dress Shirt",
  "Trousers",
  "Waistcoat",
  "Overcoat",
  "Tuxedo",
  "Traditional Attire",
  "Other",
];

const UserNewOrder = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    garmentType: "",
    fabricId: "",
    measurementId: "",
    description: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [fabricsRes, measurementsRes] = await Promise.all([
        supabase
          .from('fabrics')
          .select('id, name, color, material_type, price_per_yard')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('measurements')
          .select('id, profile_name, measurement_type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (fabricsRes.data) setFabrics(fabricsRes.data);
      if (measurementsRes.data) setMeasurements(measurementsRes.data);
      setDataLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.garmentType) {
      toast.error("Please select a garment type");
      return;
    }

    if (!user) return;

    setSubmitting(true);

    const selectedFabric = fabrics.find(f => f.id === formData.fabricId);
    const fabricDetails = selectedFabric 
      ? `${selectedFabric.name}${selectedFabric.color ? ` - ${selectedFabric.color}` : ''}${selectedFabric.material_type ? ` (${selectedFabric.material_type})` : ''}`
      : null;

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      customer_name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || 'Customer',
      customer_email: user.email,
      garment_type: formData.garmentType,
      garment_description: formData.description || null,
      fabric_details: fabricDetails,
      measurement_id: formData.measurementId || null,
      notes: formData.notes || null,
      status: 'pending' as const,
      amount: 0,
    });

    if (error) {
      toast.error("Failed to create order. Please try again.");
      console.error(error);
    } else {
      toast.success("Order placed successfully!");
      navigate("/dashboard/orders");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.first_name || "User";

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="user" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName={userName} 
          userEmail={user.email || ""} 
          userType="user" 
        />
        
        <main className="p-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard/orders")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">New Order</h1>
                <p className="text-muted-foreground">Create a custom garment order</p>
              </div>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="garmentType">Garment Type *</Label>
                    <Select
                      value={formData.garmentType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, garmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select garment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {garmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fabric">Fabric</Label>
                    <Select
                      value={formData.fabricId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, fabricId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {fabrics.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No fabrics available
                          </SelectItem>
                        ) : (
                          fabrics.map((fabric) => (
                            <SelectItem key={fabric.id} value={fabric.id}>
                              {fabric.name}
                              {fabric.color && ` - ${fabric.color}`}
                              {fabric.material_type && ` (${fabric.material_type})`}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measurement">Measurement Profile</Label>
                    <Select
                      value={formData.measurementId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, measurementId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select measurement profile (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {measurements.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No measurements saved - add one first
                          </SelectItem>
                        ) : (
                          measurements.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.profile_name} ({m.measurement_type})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {measurements.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-accent"
                          onClick={() => navigate("/measurements/new")}
                          type="button"
                        >
                          Add your measurements
                        </Button>
                        {" "}to get a perfect fit
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Garment Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your ideal garment (style, details, preferences...)"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests or instructions..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/orders")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserNewOrder;
