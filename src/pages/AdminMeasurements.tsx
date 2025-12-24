import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Ruler } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';

interface MeasurementWithProfile {
  id: string;
  profile_name: string;
  measurement_type: string;
  measurement_unit: string;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

const AdminMeasurements = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [measurements, setMeasurements] = useState<MeasurementWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const { data: measurementsData, error } = await supabase
        .from('measurements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles for each measurement
      const measurementsWithProfiles = await Promise.all(
        (measurementsData || []).map(async (measurement) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', measurement.user_id)
            .maybeSingle();

          return {
            ...measurement,
            user_email: profileData?.email || '',
            user_name: [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' ') || 'Unknown',
          };
        })
      );

      setMeasurements(measurementsWithProfiles);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setLoading(false);
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
      fetchMeasurements();
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

  const filteredMeasurements = measurements.filter(m => 
    m.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userName = profile 
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin User'
    : 'Admin User';

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
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Customer Measurements</h1>
            <p className="text-muted-foreground">View all customer measurement profiles</p>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <Input
                placeholder="Search by customer or profile name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMeasurements.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <Ruler className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No measurements found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Customer</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Profile Name</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Chest</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Waist</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Hips</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Unit</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMeasurements.map((measurement) => (
                      <tr key={measurement.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{measurement.user_name}</p>
                            <p className="text-xs text-muted-foreground">{measurement.user_email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{measurement.profile_name}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {measurement.measurement_type}
                          </Badge>
                        </td>
                        <td className="p-4">{measurement.chest || '-'}</td>
                        <td className="p-4">{measurement.waist || '-'}</td>
                        <td className="p-4">{measurement.hips || '-'}</td>
                        <td className="p-4 text-muted-foreground">{measurement.measurement_unit}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(measurement.created_at).toLocaleDateString()}
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

export default AdminMeasurements;
