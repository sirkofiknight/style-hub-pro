export type OrderStatus = 'pending' | 'cutting' | 'stitching' | 'fitting' | 'completed' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  garment_type: string;
  garment_description: string | null;
  status: OrderStatus;
  amount: number;
  measurement_id: string | null;
  assigned_tailor: string | null;
  fabric_details: string | null;
  notes: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  cutting: 'Cutting',
  stitching: 'Stitching',
  fitting: 'Fitting',
  completed: 'Completed',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
