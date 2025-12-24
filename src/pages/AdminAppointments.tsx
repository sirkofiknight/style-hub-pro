import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Calendar, Plus } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
type AppointmentType = 'measurement' | 'fitting' | 'consultation' | 'pickup' | 'other';

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  appointment_type: AppointmentType;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

const typeLabels: Record<AppointmentType, string> = {
  measurement: 'Measurement',
  fitting: 'Fitting',
  consultation: 'Consultation',
  pickup: 'Pickup',
  other: 'Other',
};

const AdminAppointments = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newAppointment, setNewAppointment] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    appointment_type: 'consultation' as AppointmentType,
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    duration_minutes: '60',
    notes: '',
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      
      const typedAppointments = (data || []).map(apt => ({
        ...apt,
        status: apt.status as AppointmentStatus,
        appointment_type: apt.appointment_type as AppointmentType,
      }));
      setAppointments(typedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.customer_name || !newAppointment.appointment_date || !newAppointment.appointment_time) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        customer_name: newAppointment.customer_name,
        customer_phone: newAppointment.customer_phone || null,
        customer_email: newAppointment.customer_email || null,
        appointment_type: newAppointment.appointment_type,
        appointment_date: newAppointment.appointment_date,
        appointment_time: newAppointment.appointment_time,
        duration_minutes: parseInt(newAppointment.duration_minutes) || 60,
        notes: newAppointment.notes || null,
      });

      if (error) throw error;

      toast.success('Appointment scheduled successfully');
      setDialogOpen(false);
      setNewAppointment({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        appointment_type: 'consultation',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00',
        duration_minutes: '60',
        notes: '',
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Failed to schedule appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!adminLoading && !isAdmin && user) {
      navigate('/dashboard');
      return;
    }

    if (isAdmin) {
      fetchAppointments();
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(a => 
    a.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayAppointments = appointments.filter(a => 
    a.appointment_date === new Date().toISOString().split('T')[0]
  );

  const userName = profile 
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin User'
    : 'Admin User';

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="admin" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName={userName}
          userEmail={profile?.email || user?.email || ''} 
          userType="admin" 
        />
        
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Appointments</h1>
              <p className="text-muted-foreground">Manage customer appointments</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={newAppointment.customer_name}
                      onChange={(e) => setNewAppointment({ ...newAppointment, customer_name: e.target.value })}
                      placeholder="Customer name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={newAppointment.customer_phone}
                        onChange={(e) => setNewAppointment({ ...newAppointment, customer_phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={newAppointment.customer_email}
                        onChange={(e) => setNewAppointment({ ...newAppointment, customer_email: e.target.value })}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Appointment Type</Label>
                    <select
                      value={newAppointment.appointment_type}
                      onChange={(e) => setNewAppointment({ ...newAppointment, appointment_type: e.target.value as AppointmentType })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={newAppointment.appointment_date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time *</Label>
                      <Input
                        type="time"
                        value={newAppointment.appointment_time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={newAppointment.duration_minutes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, duration_minutes: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      placeholder="Additional notes"
                    />
                  </div>
                  <Button onClick={handleAddAppointment} disabled={submitting} className="w-full">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule Appointment'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Today</p>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Time</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Customer</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium">
                          {formatTime(appointment.appointment_time)}
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{appointment.customer_name}</p>
                            {appointment.customer_phone && (
                              <p className="text-xs text-muted-foreground">{appointment.customer_phone}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{typeLabels[appointment.appointment_type]}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={statusColors[appointment.status]}>
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {appointment.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAppointments;
