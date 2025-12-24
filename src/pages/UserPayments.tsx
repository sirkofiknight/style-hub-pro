import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Receipt, CheckCircle, Clock, AlertCircle } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  transaction_reference: string | null;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
};

const statusIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  pending: Clock,
  failed: AlertCircle,
  refunded: Receipt,
};

const UserPayments = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (!error && data) {
        setPayments(data);
        const total = data
          .filter(p => p.payment_status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        setTotalPaid(total);
      }
      setDataLoading(false);
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.first_name || "User";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
            <h1 className="font-display text-3xl font-bold mb-2">Payment History</h1>
            <p className="text-muted-foreground">View your payment transactions and invoices</p>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-gold rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-accent-foreground">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border">
            {dataLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-16">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No payments yet</h3>
                <p className="text-muted-foreground">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {payments.map((payment) => {
                  const StatusIcon = statusIcons[payment.payment_status] || Receipt;
                  return (
                    <div key={payment.id} className="p-6 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                            <StatusIcon className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg capitalize">{payment.payment_method} Payment</h3>
                            <p className="text-sm text-muted-foreground">
                              {payment.transaction_reference || 'No reference'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(payment.payment_date)}</p>
                          </div>
                          <Badge className={statusColors[payment.payment_status] || "bg-gray-100 text-gray-800"}>
                            {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {payment.notes && (
                        <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">{payment.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPayments;
