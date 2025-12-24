import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Palette, Plus, AlertTriangle } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Fabric {
  id: string;
  name: string;
  color: string | null;
  material_type: string | null;
  quantity_yards: number;
  min_quantity_yards: number;
  price_per_yard: number | null;
  supplier: string | null;
  sku: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminFabrics = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newFabric, setNewFabric] = useState({
    name: '',
    color: '',
    material_type: '',
    quantity_yards: '',
    min_quantity_yards: '5',
    price_per_yard: '',
    supplier: '',
    sku: '',
  });

  const fetchFabrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fabrics')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setFabrics(data || []);
    } catch (error) {
      console.error('Error fetching fabrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFabric = async () => {
    if (!newFabric.name || !newFabric.quantity_yards) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('fabrics').insert({
        name: newFabric.name,
        color: newFabric.color || null,
        material_type: newFabric.material_type || null,
        quantity_yards: parseFloat(newFabric.quantity_yards),
        min_quantity_yards: parseFloat(newFabric.min_quantity_yards) || 5,
        price_per_yard: newFabric.price_per_yard ? parseFloat(newFabric.price_per_yard) : null,
        supplier: newFabric.supplier || null,
        sku: newFabric.sku || null,
      });

      if (error) throw error;

      toast.success('Fabric added successfully');
      setDialogOpen(false);
      setNewFabric({
        name: '',
        color: '',
        material_type: '',
        quantity_yards: '',
        min_quantity_yards: '5',
        price_per_yard: '',
        supplier: '',
        sku: '',
      });
      fetchFabrics();
    } catch (error) {
      console.error('Error adding fabric:', error);
      toast.error('Failed to add fabric');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!adminLoading && !isAdmin && user) {
      navigate('/dashboard');
      return;
    }

    if (isAdmin) {
      fetchFabrics();
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

  const filteredFabrics = fabrics.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.material_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockFabrics = fabrics.filter(f => f.quantity_yards < f.min_quantity_yards);

  const userName = profile 
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin User'
    : 'Admin User';

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Fabric Inventory</h1>
              <p className="text-muted-foreground">Manage fabric stock and supplies</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Fabric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Fabric</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={newFabric.name}
                      onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
                      placeholder="e.g., Italian Wool"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Input
                        value={newFabric.color}
                        onChange={(e) => setNewFabric({ ...newFabric, color: e.target.value })}
                        placeholder="e.g., Navy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Material Type</Label>
                      <Input
                        value={newFabric.material_type}
                        onChange={(e) => setNewFabric({ ...newFabric, material_type: e.target.value })}
                        placeholder="e.g., Wool"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity (yards) *</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newFabric.quantity_yards}
                        onChange={(e) => setNewFabric({ ...newFabric, quantity_yards: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Min Quantity (yards)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newFabric.min_quantity_yards}
                        onChange={(e) => setNewFabric({ ...newFabric, min_quantity_yards: e.target.value })}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price per Yard</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newFabric.price_per_yard}
                        onChange={(e) => setNewFabric({ ...newFabric, price_per_yard: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={newFabric.sku}
                        onChange={(e) => setNewFabric({ ...newFabric, sku: e.target.value })}
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Input
                      value={newFabric.supplier}
                      onChange={(e) => setNewFabric({ ...newFabric, supplier: e.target.value })}
                      placeholder="Supplier name"
                    />
                  </div>
                  <Button onClick={handleAddFabric} disabled={submitting} className="w-full">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Fabric'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Low Stock Alert */}
          {lowStockFabrics.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">Low Stock Alert</h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {lowStockFabrics.length} fabric(s) are below minimum stock levels
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Fabrics</p>
              <p className="text-2xl font-bold">{fabrics.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockFabrics.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Yards</p>
              <p className="text-2xl font-bold">
                {fabrics.reduce((sum, f) => sum + f.quantity_yards, 0).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <Input
                placeholder="Search fabrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFabrics.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No fabrics found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Color</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Material</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Quantity</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Price/Yard</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Supplier</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFabrics.map((fabric) => (
                      <tr key={fabric.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-medium">{fabric.name}</td>
                        <td className="p-4 text-muted-foreground">{fabric.color || '-'}</td>
                        <td className="p-4 text-muted-foreground">{fabric.material_type || '-'}</td>
                        <td className="p-4">
                          <span className={fabric.quantity_yards < fabric.min_quantity_yards ? 'text-orange-600 font-semibold' : ''}>
                            {fabric.quantity_yards} yds
                          </span>
                        </td>
                        <td className="p-4">{formatCurrency(fabric.price_per_yard)}</td>
                        <td className="p-4 text-muted-foreground">{fabric.supplier || '-'}</td>
                        <td className="p-4">
                          {fabric.quantity_yards < fabric.min_quantity_yards ? (
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              In Stock
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFabrics;
