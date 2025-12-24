import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomersTable } from '@/components/admin/CustomersTable';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Customer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  order_count?: number;
}

const AdminCustomers = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch order counts for each customer
      const customersWithOrders = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          return {
            ...profile,
            order_count: count || 0,
          };
        })
      );

      setCustomers(customersWithOrders);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      fetchCustomers();
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  // Real-time subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to profiles changes
    const profilesChannel = supabase
      .channel('admin-customers-profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload) => {
          console.log('Profile change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newCustomer = payload.new as Customer;
            // Fetch order count for new customer
            const { count } = await supabase
              .from('orders')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', newCustomer.id);
            
            setCustomers(prev => [{
              ...newCustomer,
              order_count: count || 0
            }, ...prev]);
            toast.info(`New customer registered: ${newCustomer.first_name || newCustomer.email || 'New User'}`);
          } else if (payload.eventType === 'UPDATE') {
            const updatedCustomer = payload.new as Customer;
            setCustomers(prev => prev.map(c => 
              c.id === updatedCustomer.id 
                ? { ...c, ...updatedCustomer }
                : c
            ));
          } else if (payload.eventType === 'DELETE') {
            setCustomers(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to orders changes to update order counts
    const ordersChannel = supabase
      .channel('admin-customers-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          const newRecord = payload.new as { user_id?: string } | null;
          const oldRecord = payload.old as { user_id?: string } | null;
          const userId = newRecord?.user_id || oldRecord?.user_id;
          if (!userId) return;

          // Update order count for the affected customer
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

          setCustomers(prev => prev.map(c => 
            c.id === userId 
              ? { ...c, order_count: count || 0 }
              : c
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [isAdmin]);

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
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const filteredCustomers = customers.filter(customer => {
    const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(' ').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || 
           customer.email?.toLowerCase().includes(search) ||
           customer.phone?.toLowerCase().includes(search);
  });

  const userName = profile 
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin User'
    : 'Admin User';

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="admin" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName={userName}
          userEmail={profile?.email || user?.email || 'admin@atelier.com'} 
          userType="admin" 
        />
        
        <main className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold mb-2">Customers</h1>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full animate-pulse">
                Live
              </span>
            </div>
            <p className="text-muted-foreground">View and manage customer accounts ({customers.length} total)</p>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <CustomersTable 
              customers={filteredCustomers} 
              loading={loading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCustomers;
