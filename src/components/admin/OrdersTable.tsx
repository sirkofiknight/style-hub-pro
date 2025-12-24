import { useState } from 'react';
import { MoreVertical, Loader2, ChevronDown, ChevronUp, Clock, User, Phone, Mail } from 'lucide-react';
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
import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline';

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
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
            <th className="text-left text-sm font-medium text-muted-foreground p-4 w-8"></th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Order ID</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Customer</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Garment</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Progress</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Amount</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            
            return (
              <OrderRow
                key={order.id}
                order={order}
                isExpanded={isExpanded}
                updating={updating}
                statusColors={statusColors}
                onToggleExpand={() => setExpandedOrder(isExpanded ? null : order.id)}
                onUpdateStatus={updateOrderStatus}
                formatAmount={formatAmount}
                formatDate={formatDate}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  updating: string | null;
  statusColors: Record<OrderStatus, string>;
  onToggleExpand: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  formatAmount: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

const OrderRow = ({
  order,
  isExpanded,
  updating,
  statusColors,
  onToggleExpand,
  onUpdateStatus,
  formatAmount,
  formatDate,
}: OrderRowProps) => {
  return (
    <>
      <tr 
        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
        onClick={onToggleExpand}
      >
        <td className="p-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </td>
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
          <OrderStatusTimeline status={order.status} compact />
        </td>
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
        <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                  onClick={() => onUpdateStatus(order.id, status)}
                  disabled={order.status === status}
                >
                  <Badge className={`${statusColors[status]} mr-2`}>
                    {ORDER_STATUS_LABELS[status]}
                  </Badge>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="text-red-600"
                disabled={order.status === 'cancelled'}
              >
                Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Expanded Row */}
      {isExpanded && (
        <tr className="bg-secondary/20">
          <td colSpan={8} className="p-0">
            <div className="p-6 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    Customer Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{order.customer_name}</span>
                    </div>
                    {order.customer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{order.customer_email}</span>
                      </div>
                    )}
                    {order.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{order.customer_phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <h5 className="font-medium text-sm text-muted-foreground">Order Info</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      {order.due_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.due_date)}
                          </span>
                        </div>
                      )}
                      {order.assigned_tailor && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tailor</span>
                          <span>{order.assigned_tailor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Order Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Garment Type</span>
                      <span className="font-medium">{order.garment_type}</span>
                    </div>
                    {order.garment_description && (
                      <div>
                        <span className="text-muted-foreground block mb-1">Description</span>
                        <p className="text-sm bg-secondary/50 p-2 rounded">{order.garment_description}</p>
                      </div>
                    )}
                    {order.fabric_details && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fabric</span>
                        <span>{order.fabric_details}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-accent">{formatAmount(order.amount)}</span>
                    </div>
                    {order.notes && (
                      <div>
                        <span className="text-muted-foreground block mb-1">Notes</span>
                        <p className="text-sm bg-secondary/50 p-2 rounded">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline with Update Buttons */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Production Progress</h4>
                  <OrderStatusTimeline status={order.status} />
                  
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">Quick Status Update</p>
                      <div className="flex flex-wrap gap-2">
                        {statusOrder.map((status) => {
                          const currentIndex = statusOrder.indexOf(order.status);
                          const statusIndex = statusOrder.indexOf(status);
                          const isNext = statusIndex === currentIndex + 1;
                          
                          if (statusIndex <= currentIndex) return null;
                          
                          return (
                            <Button
                              key={status}
                              size="sm"
                              variant={isNext ? "gold" : "outline"}
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(order.id, status);
                              }}
                              disabled={updating === order.id}
                              className="text-xs"
                            >
                              {updating === order.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                ORDER_STATUS_LABELS[status]
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};