import { Users, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

interface AdminStatsProps {
  totalCustomers: number;
  activeOrders: number;
  monthlyRevenue: number;
  pendingOrders: number;
}

export const AdminStats = ({ 
  totalCustomers, 
  activeOrders, 
  monthlyRevenue, 
  pendingOrders 
}: AdminStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Customers"
        value={totalCustomers.toString()}
        change="Registered users"
        changeType="neutral"
        icon={Users}
      />
      <StatCard
        title="Active Orders"
        value={activeOrders.toString()}
        change={`${pendingOrders} pending`}
        changeType="neutral"
        icon={ShoppingBag}
      />
      <StatCard
        title="Monthly Revenue"
        value={formatCurrency(monthlyRevenue)}
        change="This month"
        changeType="positive"
        icon={DollarSign}
        iconColor="bg-gradient-gold"
      />
      <StatCard
        title="Pending Orders"
        value={pendingOrders.toString()}
        change="Awaiting action"
        changeType="neutral"
        icon={Calendar}
      />
    </div>
  );
};
