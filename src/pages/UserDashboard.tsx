import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Ruler, Calendar, CreditCard, Clock, CheckCircle, ArrowRight, Plus } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  cutting: "bg-blue-100 text-blue-800",
  stitching: "bg-purple-100 text-purple-800",
  fitting: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
};

interface Order {
  id: string;
  order_number: string;
  garment_type: string;
  status: string;
  created_at: string;
  amount: number;
}

interface Appointment {
  id: string;
  appointment_type: string;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    activeOrders: 0,
    savedMeasurements: 0,
    upcomingAppointments: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setDataLoading(true);

      try {
        // Fetch active orders count
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('status', 'in', '(completed,delivered,cancelled)');

        // Fetch saved measurements count
        const { count: measurementsCount } = await supabase
          .from('measurements')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch upcoming appointments count
        const today = new Date().toISOString().split('T')[0];
        const { count: appointmentsCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('appointment_date', today)
          .in('status', ['pending', 'confirmed']);

        // Fetch total spent
        const { data: ordersData } = await supabase
          .from('orders')
          .select('amount')
          .eq('user_id', user.id)
          .in('status', ['completed', 'delivered']);

        const totalSpent = ordersData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

        // Fetch recent orders
        const { data: recentOrdersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        // Fetch upcoming appointments
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .gte('appointment_date', today)
          .in('status', ['pending', 'confirmed'])
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true })
          .limit(3);

        setStats({
          activeOrders: ordersCount || 0,
          savedMeasurements: measurementsCount || 0,
          upcomingAppointments: appointmentsCount || 0,
          totalSpent,
        });

        setRecentOrders(recentOrdersData || []);
        setUpcomingAppointments(appointmentsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
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
      month: 'short', 
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">Here's what's happening with your orders today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Orders"
              value={dataLoading ? "-" : stats.activeOrders.toString()}
              icon={ShoppingBag}
            />
            <StatCard
              title="Saved Measurements"
              value={dataLoading ? "-" : stats.savedMeasurements.toString()}
              icon={Ruler}
            />
            <StatCard
              title="Upcoming Appointments"
              value={dataLoading ? "-" : stats.upcomingAppointments.toString()}
              icon={Calendar}
            />
            <StatCard
              title="Total Spent"
              value={dataLoading ? "-" : formatCurrency(stats.totalSpent)}
              icon={CreditCard}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/dashboard/orders/new">
              <Button variant="gold" className="w-full h-14 justify-between group">
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Place New Order
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard/measurements/new">
              <Button variant="outline" className="w-full h-14 justify-between group">
                <span className="flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Add Measurements
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard/appointments/book">
              <Button variant="outline" className="w-full h-14 justify-between group">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
                <Link to="/dashboard/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet</p>
                    <p className="text-sm">Place your first order to get started</p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{order.garment_type}</p>
                          <p className="text-sm text-muted-foreground">{order.order_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">Upcoming</h2>
                <Link to="/dashboard/appointments" className="text-sm text-accent hover:underline">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming appointments</p>
                    <p className="text-sm">Book an appointment to get started</p>
                  </div>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <div 
                      key={apt.id}
                      className="p-4 rounded-lg border border-border hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{apt.appointment_type}</p>
                          <p className="text-xs text-muted-foreground">{apt.notes || 'No details'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(apt.appointment_date)} at {formatTime(apt.appointment_time)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Link to="/dashboard/appointments/book">
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Timeline - only show if there are active orders */}
          {recentOrders.length > 0 && recentOrders[0].status !== 'completed' && recentOrders[0].status !== 'delivered' && (
            <div className="mt-8 bg-card rounded-xl border border-border p-6">
              <h2 className="font-display text-xl font-semibold mb-6">
                Order Progress: {recentOrders[0].garment_type} ({recentOrders[0].order_number})
              </h2>
              <div className="flex items-center justify-between">
                {["pending", "cutting", "stitching", "fitting", "completed"].map((step, index) => {
                  const statusOrder = ["pending", "cutting", "stitching", "fitting", "completed"];
                  const currentIndex = statusOrder.indexOf(recentOrders[0].status);
                  const isCompleted = index <= currentIndex;
                  
                  return (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted 
                          ? "bg-accent text-accent-foreground" 
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm capitalize ${isCompleted ? "font-medium" : "text-muted-foreground"}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
