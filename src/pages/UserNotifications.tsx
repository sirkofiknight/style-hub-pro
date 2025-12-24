import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Package, Calendar, CreditCard, MessageSquare } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const UserNotifications = () => {
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated on your orders and appointments</p>
            </div>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="text-center py-16">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up! We'll notify you when something important happens.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserNotifications;
