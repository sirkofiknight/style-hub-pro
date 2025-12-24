import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User, Lock, Bell, Palette, LogOut } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

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
            <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-6">Personal Information</h2>
                <div className="grid gap-6 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-secondary"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <Button variant="gold" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-6">Notification Preferences</h2>
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified when your order status changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-muted-foreground">Receive reminders before your appointments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Promotional Emails</p>
                      <p className="text-sm text-muted-foreground">Receive updates about new designs and offers</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-6">Security Settings</h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <Button variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">Sign out of your account</p>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
