import { Loader2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Customer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  order_count?: number;
}

interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
}

export const CustomersTable = ({ customers, loading }: CustomersTableProps) => {
  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getFullName = (firstName: string | null, lastName: string | null) => {
    return [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Customer</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Email</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Phone</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Orders</th>
            <th className="text-left text-sm font-medium text-muted-foreground p-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={customer.avatar_url || undefined} />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {getInitials(customer.first_name, customer.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {getFullName(customer.first_name, customer.last_name)}
                  </span>
                </div>
              </td>
              <td className="p-4 text-muted-foreground">{customer.email || '-'}</td>
              <td className="p-4 text-muted-foreground">{customer.phone || '-'}</td>
              <td className="p-4 font-medium">{customer.order_count || 0}</td>
              <td className="p-4 text-muted-foreground">{formatDate(customer.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
