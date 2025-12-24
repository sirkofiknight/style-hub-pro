import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Ruler, Calendar, CreditCard, Clock, CheckCircle, ArrowRight, Plus } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const recentOrders = [
  { id: "ORD-2024-001", garment: "Custom Suit", status: "stitching", date: "Dec 20, 2024", amount: "$850" },
  { id: "ORD-2024-002", garment: "Wedding Dress", status: "fitting", date: "Dec 18, 2024", amount: "$1,200" },
  { id: "ORD-2024-003", garment: "Formal Shirt", status: "completed", date: "Dec 15, 2024", amount: "$180" },
];

const upcomingAppointments = [
  { type: "Fitting", date: "Dec 26, 2024", time: "10:00 AM", garment: "Custom Suit" },
  { type: "Measurement", date: "Dec 28, 2024", time: "2:00 PM", garment: "New Order" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  cutting: "bg-blue-100 text-blue-800",
  stitching: "bg-purple-100 text-purple-800",
  fitting: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">Here's what's happening with your orders today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Orders"
              value="3"
              change="+1 this week"
              changeType="positive"
              icon={ShoppingBag}
            />
            <StatCard
              title="Saved Measurements"
              value="5"
              icon={Ruler}
            />
            <StatCard
              title="Upcoming Appointments"
              value="2"
              icon={Calendar}
            />
            <StatCard
              title="Total Spent"
              value="$4,230"
              change="+$850 this month"
              changeType="neutral"
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
                {recentOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{order.garment}</p>
                        <p className="text-sm text-muted-foreground">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusColors[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                    </div>
                  </div>
                ))}
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
                {upcomingAppointments.map((apt, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-border hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{apt.type}</p>
                        <p className="text-xs text-muted-foreground">{apt.garment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                      <Clock className="w-4 h-4" />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="mt-8 bg-card rounded-xl border border-border p-6">
            <h2 className="font-display text-xl font-semibold mb-6">Order Progress: Custom Suit (ORD-2024-001)</h2>
            <div className="flex items-center justify-between">
              {["Ordered", "Cutting", "Stitching", "Fitting", "Completed"].map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index <= 2 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {index <= 2 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${index <= 2 ? "font-medium" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                  {index < 4 && (
                    <div className={`h-0.5 w-full mt-5 absolute left-1/2 ${
                      index < 2 ? "bg-accent" : "bg-border"
                    }`} style={{ width: "calc(100% - 40px)", top: "20px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
