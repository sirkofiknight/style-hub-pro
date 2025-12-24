import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  ArrowRight,
  MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const recentOrders = [
  { id: "ORD-2024-001", customer: "Alexandra Chen", garment: "Custom Suit", status: "stitching", amount: "$850", tailor: "John M." },
  { id: "ORD-2024-002", customer: "Michael Ross", garment: "Wedding Dress", status: "cutting", amount: "$1,200", tailor: "Sarah K." },
  { id: "ORD-2024-003", customer: "Emma Wilson", garment: "Formal Shirt", status: "pending", amount: "$180", tailor: "Unassigned" },
  { id: "ORD-2024-004", customer: "James Brown", garment: "Kaftan", status: "completed", amount: "$320", tailor: "John M." },
  { id: "ORD-2024-005", customer: "Lisa Anderson", garment: "Evening Gown", status: "fitting", amount: "$950", tailor: "Sarah K." },
];

const lowStockFabrics = [
  { name: "Italian Wool (Navy)", quantity: "8 yards", threshold: "10 yards" },
  { name: "Silk Blend (Ivory)", quantity: "5 yards", threshold: "8 yards" },
  { name: "Cotton Twill (White)", quantity: "12 yards", threshold: "15 yards" },
];

const todayAppointments = [
  { time: "10:00 AM", customer: "Alexandra Chen", type: "Fitting", status: "confirmed" },
  { time: "11:30 AM", customer: "David Miller", type: "Measurement", status: "confirmed" },
  { time: "2:00 PM", customer: "Emma Wilson", type: "Consultation", status: "pending" },
  { time: "4:00 PM", customer: "Robert Taylor", type: "Pickup", status: "confirmed" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cutting: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  stitching: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  fitting: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  delivered: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="admin" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName="Admin User" 
          userEmail="admin@atelier.com" 
          userType="admin" 
        />
        
        <main className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening in your business today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Customers"
              value="1,247"
              change="+12% from last month"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Active Orders"
              value="38"
              change="5 urgent"
              changeType="neutral"
              icon={ShoppingBag}
            />
            <StatCard
              title="Monthly Revenue"
              value="$48,520"
              change="+23% from last month"
              changeType="positive"
              icon={DollarSign}
              iconColor="bg-gradient-gold"
            />
            <StatCard
              title="Today's Appointments"
              value="8"
              change="2 pending confirmation"
              changeType="neutral"
              icon={Calendar}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Order ID</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Customer</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Garment</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-mono text-sm">{order.id}</td>
                        <td className="p-4 font-medium">{order.customer}</td>
                        <td className="p-4 text-muted-foreground">{order.garment}</td>
                        <td className="p-4">
                          <Badge className={statusColors[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold">{order.amount}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Today's Appointments */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-semibold">Today's Schedule</h2>
                  <Link to="/admin/appointments" className="text-sm text-accent hover:underline">
                    View all
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {todayAppointments.map((apt, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-accent">{apt.time}</div>
                        <div>
                          <p className="text-sm font-medium">{apt.customer}</p>
                          <p className="text-xs text-muted-foreground">{apt.type}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColors[apt.status]}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h2 className="font-display text-lg font-semibold">Low Stock Alert</h2>
                </div>
                
                <div className="space-y-3">
                  {lowStockFabrics.map((fabric, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                    >
                      <p className="text-sm font-medium">{fabric.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fabric.quantity} remaining (min: {fabric.threshold})
                      </p>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Link to="/admin/fabrics" className="flex items-center gap-2">
                    Manage Inventory
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-gold rounded-xl p-6 text-accent-foreground">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="font-display text-lg font-semibold">This Month</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-accent-foreground/80">Orders Completed</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-foreground/80">New Customers</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-foreground/80">Revenue Growth</span>
                    <span className="font-semibold">+23%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
