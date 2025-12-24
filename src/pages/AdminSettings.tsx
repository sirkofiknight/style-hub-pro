import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Save, Building, Bell, Lock, Palette } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Atelier Tailoring',
    email: 'hello@atelier.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Avenue, Design District, NY 10001',
    currency: 'USD',
    taxRate: '8.5',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    lowStockAlerts: true,
    appointmentReminders: true,
    paymentAlerts: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!adminLoading && !isAdmin && user) {
      navigate('/dashboard');
      return;
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

  const handleSaveBusinessSettings = () => {
    toast.success('Business settings saved successfully');
  };

  const handleSaveNotificationSettings = () => {
    toast.success('Notification settings saved successfully');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

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
            <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your business and application settings</p>
          </div>

          <Tabs defaultValue="business" className="space-y-6">
            <TabsList>
              <TabsTrigger value="business" className="gap-2">
                <Building className="w-4 h-4" />
                Business
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h2 className="font-display text-xl font-semibold">Business Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessSettings.businessName}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessSettings.email}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={businessSettings.phone}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={businessSettings.currency}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, currency: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={businessSettings.address}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={businessSettings.taxRate}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, taxRate: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBusinessSettings} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h2 className="font-display text-xl font-semibold">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailNotifications: checked 
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified when orders are placed or updated</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        orderUpdates: checked 
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when fabric inventory is low</p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStockAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        lowStockAlerts: checked 
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified before upcoming appointments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        appointmentReminders: checked 
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when payments are received</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        paymentAlerts: checked 
                      })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotificationSettings} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h2 className="font-display text-xl font-semibold">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Sign Out</p>
                        <p className="text-sm text-muted-foreground">Sign out of your account</p>
                      </div>
                      <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
                    </div>
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

export default AdminSettings;