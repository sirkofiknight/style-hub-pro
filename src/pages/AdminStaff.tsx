import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Users, Plus } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  specialty: string | null;
  hire_date: string | null;
  hourly_rate: number | null;
  is_active: boolean;
  created_at: string;
}

const staffRoles = ['Tailor', 'Assistant', 'Manager', 'Receptionist', 'Cutter', 'Designer'];

const AdminStaff = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'Tailor',
    specialty: '',
    hire_date: '',
    hourly_rate: '',
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.first_name || !newStaff.last_name) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('staff').insert({
        first_name: newStaff.first_name,
        last_name: newStaff.last_name,
        email: newStaff.email || null,
        phone: newStaff.phone || null,
        role: newStaff.role,
        specialty: newStaff.specialty || null,
        hire_date: newStaff.hire_date || null,
        hourly_rate: newStaff.hourly_rate ? parseFloat(newStaff.hourly_rate) : null,
      });

      if (error) throw error;

      toast.success('Staff member added successfully');
      setDialogOpen(false);
      setNewStaff({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'Tailor',
        specialty: '',
        hire_date: '',
        hourly_rate: '',
      });
      fetchStaff();
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Failed to add staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStaffStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Staff member ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchStaff();
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast.error('Failed to update staff status');
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
      fetchStaff();
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

  const filteredStaff = staff.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStaff = staff.filter(s => s.is_active);

  const userName = profile 
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin User'
    : 'Admin User';

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
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
              <h1 className="font-display text-3xl font-bold mb-2">Staff Management</h1>
              <p className="text-muted-foreground">Manage your team members</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Staff Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={newStaff.first_name}
                        onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={newStaff.last_name}
                        onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        placeholder="Email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {staffRoles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Specialty</Label>
                    <Input
                      value={newStaff.specialty}
                      onChange={(e) => setNewStaff({ ...newStaff, specialty: e.target.value })}
                      placeholder="e.g., Suits, Dresses"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hire Date</Label>
                      <Input
                        type="date"
                        value={newStaff.hire_date}
                        onChange={(e) => setNewStaff({ ...newStaff, hire_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hourly Rate</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newStaff.hourly_rate}
                        onChange={(e) => setNewStaff({ ...newStaff, hourly_rate: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddStaff} disabled={submitting} className="w-full">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Staff Member'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Staff</p>
              <p className="text-2xl font-bold">{staff.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeStaff.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Tailors</p>
              <p className="text-2xl font-bold">
                {staff.filter(s => s.role.toLowerCase() === 'tailor' && s.is_active).length}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No staff members found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Contact</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Role</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Specialty</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Rate</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-accent text-accent-foreground">
                                {getInitials(member.first_name, member.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {member.first_name} {member.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <p className="text-muted-foreground">{member.email || '-'}</p>
                            <p className="text-muted-foreground">{member.phone || '-'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{member.role}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{member.specialty || '-'}</td>
                        <td className="p-4">{formatCurrency(member.hourly_rate)}/hr</td>
                        <td className="p-4">
                          <Badge className={member.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleStaffStatus(member.id, member.is_active)}
                          >
                            {member.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
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

export default AdminStaff;
