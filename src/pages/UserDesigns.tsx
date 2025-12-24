import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Heart, ExternalLink } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const designs = [
  { id: 1, name: "Classic Suit", category: "Formal", image: "/placeholder.svg" },
  { id: 2, name: "Wedding Dress", category: "Bridal", image: "/placeholder.svg" },
  { id: 3, name: "Evening Gown", category: "Formal", image: "/placeholder.svg" },
  { id: 4, name: "Casual Blazer", category: "Casual", image: "/placeholder.svg" },
  { id: 5, name: "Traditional Kaftan", category: "Traditional", image: "/placeholder.svg" },
  { id: 6, name: "Business Shirt", category: "Formal", image: "/placeholder.svg" },
];

const UserDesigns = () => {
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
            <h1 className="font-display text-3xl font-bold mb-2">Design Gallery</h1>
            <p className="text-muted-foreground">Browse our collection of custom designs for inspiration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div 
                key={design.id} 
                className="bg-card rounded-xl border border-border overflow-hidden group hover:border-accent/30 transition-colors"
              >
                <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                  <img 
                    src={design.image} 
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">{design.category}</span>
                  <h3 className="font-semibold text-lg mt-1">{design.name}</h3>
                  <div className="mt-4 flex gap-2">
                    <Button variant="gold" size="sm" className="flex-1">
                      Order This
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Want to see more designs?</p>
            <Button variant="outline" onClick={() => navigate('/designs')}>
              <Palette className="w-4 h-4 mr-2" />
              View Full Gallery
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDesigns;
