import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { AdminStats } from '@/components/admin/AdminStats';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus } from '@/types/orders';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;
      
      // Cast the status to the correct type
      const typedOrders = (ordersData || []).map(order => ({
        ...order,
        status: order.status as OrderStatus,
      }));
      setOrders(typedOrders);

      // Fetch customer count
      const { count: customersCount, error: customersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (customersError) throw customersError;
      setCustomerCount(customersCount || 0);

      // Calculate monthly revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyOrders, error: revenueError } = await supabase
        .from('orders')
        .select('amount')
        .gte('created_at', startOfMonth.toISOString())
        .in('status', ['completed', 'delivered']);

      if (revenueError) throw revenueError;
      
      const revenue = (monthlyOrders || []).reduce((sum, order) => sum + (order.amount || 0), 0);
      setMonthlyRevenue(revenue);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      fetchDashboardData();
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  // Real-time subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to orders changes
    const ordersChannel = supabase
      .channel('admin-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Orders change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newOrder = { ...payload.new, status: payload.new.status as OrderStatus } as Order;
            setOrders(prev => [newOrder, ...prev].slice(0, 10));
            toast.info(`New order received: ${payload.new.order_number}`);
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = { ...payload.new, status: payload.new.status as OrderStatus } as Order;
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
          
          // Recalculate monthly revenue on order changes
          fetchMonthlyRevenue();
        }
      )
      .subscribe();

    // Subscribe to profiles (customers) changes
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profiles change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setCustomerCount(prev => prev + 1);
            toast.info(`New customer registered: ${payload.new.first_name || 'New User'}`);
          } else if (payload.eventType === 'DELETE') {
            setCustomerCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [isAdmin]);

  const fetchMonthlyRevenue = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: monthlyOrders } = await supabase
      .from('orders')
      .select('amount')
      .gte('created_at', startOfMonth.toISOString())
      .in('status', ['completed', 'delivered']);

    const revenue = (monthlyOrders || []).reduce((sum, order) => sum + (order.amount || 0), 0);
    setMonthlyRevenue(revenue);
  };

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

  const activeOrders = orders.filter(o => !['completed', 'delivered', 'cancelled'].includes(o.status));
  const pendingOrders = orders.filter(o => o.status === 'pending');

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
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold mb-2">Dashboard Overview</h1>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full animate-pulse">
                Live
              </span>
            </div>
            <p className="text-muted-foreground">Welcome back! Here's what's happening in your business today.</p>
          </div>

          {/* Stats Grid */}
          <AdminStats
            totalCustomers={customerCount}
            activeOrders={activeOrders.length}
            monthlyRevenue={monthlyRevenue}
            pendingOrders={pendingOrders.length}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <OrdersTable 
                orders={orders.slice(0, 5)} 
                loading={loading} 
                onOrderUpdated={fetchDashboardData} 
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-gold rounded-xl p-6 text-accent-foreground">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="font-display text-lg font-semibold">This Month</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-accent-foreground/80">Total Orders</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-foreground/80">Active Orders</span>
                    <span className="font-semibold">{activeOrders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-foreground/80">Customers</span>
                    <span className="font-semibold">{customerCount}</span>
                  </div>
                </div>
              </div>

              {/* Pending Orders Alert */}
              {pendingOrders.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h2 className="font-display text-lg font-semibold">Pending Orders</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {pendingOrders.slice(0, 3).map((order) => (
                      <div 
                        key={order.id}
                        className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                      >
                        <p className="text-sm font-medium">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer_name} - {order.garment_type}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/admin/orders" className="flex items-center gap-2">
                      Manage Orders
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
