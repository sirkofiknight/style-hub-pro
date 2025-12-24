import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Plus, Clock, MapPin } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  appointment_type: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-gray-100 text-gray-800",
};

const UserAppointments = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (!error && data) {
        setAppointments(data);
      }
      setDataLoading(false);
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.first_name || "User";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter(a => a.appointment_date >= today && a.status !== 'cancelled');
  const pastAppointments = appointments.filter(a => a.appointment_date < today || a.status === 'cancelled');

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Appointments</h1>
              <p className="text-muted-foreground">Manage your fittings and consultations</p>
            </div>
            <Link to="/dashboard/appointments/book">
              <Button variant="gold">
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>

          {dataLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-card rounded-xl border border-border text-center py-16">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No appointments</h3>
              <p className="text-muted-foreground mb-6">Book your first appointment for a fitting or consultation</p>
              <Link to="/dashboard/appointments/book">
                <Button variant="gold">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingAppointments.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold mb-4">Upcoming</h2>
                  <div className="grid gap-4">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="bg-card rounded-xl border border-border p-6 hover:border-accent/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg capitalize">{apt.appointment_type}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatTime(apt.appointment_time)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={statusColors[apt.status] || "bg-gray-100 text-gray-800"}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('_', ' ')}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">{formatDate(apt.appointment_date)}</p>
                          </div>
                        </div>
                        {apt.notes && (
                          <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">{apt.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastAppointments.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold mb-4 text-muted-foreground">Past Appointments</h2>
                  <div className="grid gap-4 opacity-75">
                    {pastAppointments.map((apt) => (
                      <div key={apt.id} className="bg-card rounded-xl border border-border p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg capitalize">{apt.appointment_type}</h3>
                              <p className="text-sm text-muted-foreground">{formatDate(apt.appointment_date)}</p>
                            </div>
                          </div>
                          <Badge className={statusColors[apt.status] || "bg-gray-100 text-gray-800"}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserAppointments;
