import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Ruler, 
  Edit, 
  Trash2, 
  MoreVertical,
  Star,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface Measurement {
  id: string;
  profile_name: string;
  measurement_type: string;
  measurement_unit: string;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const Measurements = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  const fetchMeasurements = async () => {
    try {
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMeasurements(data || []);
    } catch (error: any) {
      console.error("Error fetching measurements:", error);
      toast.error("Failed to load measurements");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("measurements")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setMeasurements((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Measurement deleted successfully");
    } catch (error: any) {
      console.error("Error deleting measurement:", error);
      toast.error("Failed to delete measurement");
    } finally {
      setDeleteId(null);
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from("measurements")
        .update({ is_default: false })
        .eq("user_id", user?.id);

      // Then set the new default
      const { error } = await supabase
        .from("measurements")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;

      setMeasurements((prev) =>
        prev.map((m) => ({
          ...m,
          is_default: m.id === id,
        }))
      );
      toast.success("Default measurement updated");
    } catch (error: any) {
      console.error("Error setting default:", error);
      toast.error("Failed to update default measurement");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="user" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName={user?.user_metadata?.first_name || "User"} 
          userEmail={user?.email || ""} 
          userType="user" 
        />
        
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">My Measurements</h1>
              <p className="text-muted-foreground mt-1">
                Manage your saved measurement profiles
              </p>
            </div>
            <Link to="/dashboard/measurements/new">
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Measurements
              </Button>
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : measurements.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">No Measurements Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Add your first measurement profile to get started with custom tailoring
              </p>
              <Link to="/dashboard/measurements/new">
                <Button variant="gold" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Measurement
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {measurements.map((measurement) => (
                <div
                  key={measurement.id}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-elegant transition-shadow relative group"
                >
                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setAsDefault(measurement.id)}>
                        <Star className="w-4 h-4 mr-2" />
                        Set as Default
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(measurement.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Icon & Name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Ruler className="w-6 h-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold truncate">
                          {measurement.profile_name}
                        </h3>
                        {measurement.is_default && (
                          <Badge variant="secondary" className="shrink-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {measurement.measurement_type} • {measurement.measurement_unit}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Chest</p>
                      <p className="font-semibold">
                        {measurement.chest || "—"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Waist</p>
                      <p className="font-semibold">
                        {measurement.waist || "—"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Hips</p>
                      <p className="font-semibold">
                        {measurement.hips || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Updated {formatDate(measurement.updated_at)}</span>
                    <Button variant="ghost" size="sm" className="text-accent">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Measurement?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this measurement profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Measurements;
