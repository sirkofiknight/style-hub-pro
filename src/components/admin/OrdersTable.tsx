import { useState } from 'react';
import { MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/types/orders';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onOrderUpdated: () => void;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  cutting: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  stitching: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  fitting: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const statusOrder: OrderStatus[] = ['pending', 'cutting', 'stitching', 'fitting', 'completed', 'delivered'];

export const OrdersTable = ({ orders, loading, onOrderUpdated }: OrdersTableProps) => {
  const [updating, setUpdating] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`);
      onOrderUpdated();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Order ID</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Customer</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Garment</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Tailor</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="p-4 font-mono text-sm">{order.order_number}</td>
              <td className="p-4">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  {order.customer_email && (
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  )}
                </div>
              </td>
              <td className="p-4 text-muted-foreground">{order.garment_type}</td>
              <td className="p-4">
                <Badge className={statusColors[order.status]}>
                  {updating === order.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    ORDER_STATUS_LABELS[order.status]
                  )}
                </Badge>
              </td>
              <td className="p-4 font-semibold">{formatAmount(order.amount)}</td>
              <td className="p-4 text-muted-foreground">{order.assigned_tailor || 'Unassigned'}</td>
              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={updating === order.id}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground text-xs" disabled>
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {statusOrder.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        disabled={order.status === status}
                      >
                        <Badge className={`${statusColors[status]} mr-2`}>
                          {ORDER_STATUS_LABELS[status]}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="text-red-600"
                      disabled={order.status === 'cancelled'}
                    >
                      Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
