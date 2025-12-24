import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Plus, Clock, ChevronDown, ChevronUp } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import OrderStatusTimeline from "@/components/orders/OrderStatusTimeline";

type OrderStatus = "pending" | "cutting" | "stitching" | "fitting" | "completed" | "delivered" | "cancelled";

interface Order {
  id: string;
  order_number: string;
  garment_type: string;
  status: OrderStatus;
  created_at: string;
  amount: number;
  due_date: string | null;
  garment_description: string | null;
  fabric_details: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cutting: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  stitching: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  fitting: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  delivered: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const UserOrders = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setDataLoading(false);
    };

    if (user) {
      fetchOrders();
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your custom orders</p>
            </div>
            <Link to="/dashboard/orders/new">
              <Button variant="gold">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-xl border border-border">
            {dataLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Place your first custom order to get started</p>
                <Link to="/dashboard/orders/new">
                  <Button variant="gold">
                    <Plus className="w-4 h-4 mr-2" />
                    Place First Order
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  
                  return (
                    <div key={order.id} className="transition-colors">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="w-full p-6 text-left hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-6 h-6 text-accent" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-lg">{order.garment_type}</h3>
                              <p className="text-sm text-muted-foreground">{order.order_number}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                              <OrderStatusTimeline status={order.status} compact />
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(order.amount)}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                            </div>
                            <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <div className="text-muted-foreground">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {order.due_date && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Expected by {formatDate(order.due_date)}</span>
                          </div>
                        )}
                      </button>

                      {/* Expanded Timeline Section */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 bg-secondary/20 border-t border-border animate-fade-in">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Order Details */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg">Order Details</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Order Number</span>
                                  <span className="font-medium">{order.order_number}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Garment Type</span>
                                  <span className="font-medium">{order.garment_type}</span>
                                </div>
                                {order.garment_description && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Description</span>
                                    <span className="font-medium text-right max-w-[200px]">{order.garment_description}</span>
                                  </div>
                                )}
                                {order.fabric_details && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Fabric</span>
                                    <span className="font-medium">{order.fabric_details}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Amount</span>
                                  <span className="font-semibold text-accent">{formatCurrency(order.amount)}</span>
                                </div>
                                {order.due_date && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Due Date</span>
                                    <span className="font-medium">{formatDate(order.due_date)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Timeline */}
                            <div>
                              <h4 className="font-semibold text-lg mb-4">Production Progress</h4>
                              <OrderStatusTimeline status={order.status} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserOrders;
