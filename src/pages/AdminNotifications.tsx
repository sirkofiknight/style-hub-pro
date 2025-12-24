import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Bell, Check, Trash2 } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'Order #ORD-2024-0023 has been placed by John Smith',
    type: 'info',
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Low Stock Alert',
    message: 'Italian Silk fabric is running low (5 yards remaining)',
    type: 'warning',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'Payment of $450 received for Order #ORD-2024-0021',
    type: 'success',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minutes ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-6 hover:bg-secondary/30 transition-colors ${
                      !notification.read ? 'bg-accent/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.read ? 'bg-secondary' : 'bg-accent/10'
                        }`}>
                          <Bell className={`w-5 h-5 ${
                            notification.read ? 'text-muted-foreground' : 'text-accent'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            <Badge className={typeColors[notification.type]}>
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNotifications;