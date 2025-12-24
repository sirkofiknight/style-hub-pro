import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Calendar } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';

interface ReportData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalAppointments: number;
  completedAppointments: number;
}

const AdminReports = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    totalAppointments: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch payments (revenue)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_status');

      const totalRevenue = (payments || [])
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      // Fetch expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount');

      const totalExpenses = (expenses || []).reduce((sum, e) => sum + e.amount, 0);

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('status');

      const totalOrders = orders?.length || 0;
      const completedOrders = (orders || []).filter(o => 
        o.status === 'completed' || o.status === 'delivered'
      ).length;
      const pendingOrders = (orders || []).filter(o => o.status === 'pending').length;

      // Fetch customers
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New customers this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newCustomersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Fetch appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('status');

      const totalAppointments = appointments?.length || 0;
      const completedAppointments = (appointments || []).filter(a => a.status === 'completed').length;

      setReportData({
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalCustomers: totalCustomers || 0,
        newCustomersThisMonth: newCustomersThisMonth || 0,
        totalAppointments,
        completedAppointments,
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
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
      fetchReportData();
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

  const userName = profile 
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin User'
    : 'Admin User';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const orderCompletionRate = reportData.totalOrders > 0 
    ? Math.round((reportData.completedOrders / reportData.totalOrders) * 100) 
    : 0;

  const appointmentCompletionRate = reportData.totalAppointments > 0 
    ? Math.round((reportData.completedAppointments / reportData.totalAppointments) * 100) 
    : 0;

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
            <h1 className="font-display text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">Business performance overview</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Financial Overview */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.totalRevenue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.totalExpenses)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Net Profit</p>
                        <p className={`text-2xl font-bold ${reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(reportData.netProfit)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Overview */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">Orders Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{reportData.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.completedOrders}</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{reportData.pendingOrders}</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                    <p className="text-2xl font-bold">{orderCompletionRate}%</p>
                  </div>
                </div>
              </div>

              {/* Customers Overview */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">Customers Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{reportData.totalCustomers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">New This Month</p>
                    <p className="text-2xl font-bold text-green-600">+{reportData.newCustomersThisMonth}</p>
                  </div>
                </div>
              </div>

              {/* Appointments Overview */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">Appointments Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Appointments</p>
                        <p className="text-2xl font-bold">{reportData.totalAppointments}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.completedAppointments}</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                    <p className="text-2xl font-bold">{appointmentCompletionRate}%</p>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-gold rounded-xl p-8 text-accent-foreground">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-8 h-8" />
                  <h2 className="font-display text-2xl font-semibold">Business Summary</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-accent-foreground/80 text-sm">Revenue</p>
                    <p className="text-xl font-bold">{formatCurrency(reportData.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-accent-foreground/80 text-sm">Orders</p>
                    <p className="text-xl font-bold">{reportData.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-accent-foreground/80 text-sm">Customers</p>
                    <p className="text-xl font-bold">{reportData.totalCustomers}</p>
                  </div>
                  <div>
                    <p className="text-accent-foreground/80 text-sm">Appointments</p>
                    <p className="text-xl font-bold">{reportData.totalAppointments}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReports;
