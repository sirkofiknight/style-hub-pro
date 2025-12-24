import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const UserMessages = () => {
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
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Chat with our tailoring team</p>
          </div>

          <div className="bg-card rounded-xl border border-border h-[calc(100vh-280px)] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Start a conversation with our team about your orders, measurements, or any questions you have.
                </p>
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1"
                />
                <Button variant="gold">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserMessages;
