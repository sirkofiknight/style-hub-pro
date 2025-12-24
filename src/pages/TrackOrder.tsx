import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Package, Clock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import OrderStatusTimeline from "@/components/orders/OrderStatusTimeline";

type OrderStatus = "pending" | "cutting" | "stitching" | "fitting" | "completed" | "delivered" | "cancelled";

interface TrackedOrder {
  orderNumber: string;
  garmentType: string;
  garmentDescription: string | null;
  status: OrderStatus;
  createdAt: string;
  dueDate: string | null;
}

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setSearched(true);

    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("track-order", {
        body: { orderNumber: orderNumber.trim() },
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        if (data.found === false) {
          setError("Order not found. Please check your order number and try again.");
        } else {
          setError(data.error);
        }
        return;
      }

      if (data.found && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      setError("Unable to track order. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusMessage = (status: OrderStatus): string => {
    const messages: Record<OrderStatus, string> = {
      pending: "Your order has been received and is awaiting processing.",
      cutting: "Our tailors are carefully cutting the fabric for your garment.",
      stitching: "Your garment is being expertly stitched together.",
      fitting: "Your garment is ready for fitting. Please schedule an appointment.",
      completed: "Your order is complete and ready for pickup or delivery.",
      delivered: "Your order has been delivered. Thank you for choosing Atelier!",
      cancelled: "This order has been cancelled.",
    };
    return messages[status];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Package className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Order Tracking</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Track Your <span className="text-gradient-gold">Order</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Enter your order number to check the current status of your custom garment.
              </p>
            </div>

            {/* Search Form */}
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="orderNumber" className="sr-only">
                      Order Number
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="orderNumber"
                        placeholder="Enter order number (e.g., ORD-2024-0001)"
                        className="pl-12 h-14 text-lg"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="gold" size="xl" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Track
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Error State */}
              {error && searched && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center animate-fade-in">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                  <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <p className="text-sm text-muted-foreground">
                    Need help?{" "}
                    <Link to="/contact" className="text-accent hover:underline">
                      Contact our support team
                    </Link>
                  </p>
                </div>
              )}

              {/* Order Found */}
              {order && (
                <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
                  {/* Order Header */}
                  <div className="bg-accent/10 p-6 border-b border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                        <h2 className="font-display text-2xl font-bold">{order.orderNumber}</h2>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">Placed On</p>
                        <p className="font-semibold">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Order Details */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Garment Type</span>
                              <span className="font-medium">{order.garmentType}</span>
                            </div>
                            {order.garmentDescription && (
                              <div>
                                <span className="text-muted-foreground block mb-2">Description</span>
                                <p className="text-sm bg-secondary/50 p-3 rounded-lg">
                                  {order.garmentDescription}
                                </p>
                              </div>
                            )}
                            {order.dueDate && (
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Expected By
                                </span>
                                <span className="font-medium text-accent">{formatDate(order.dueDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Message */}
                        <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                          <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                          <p className="font-medium">{getStatusMessage(order.status)}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Production Progress</h3>
                        <OrderStatusTimeline status={order.status} />
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-secondary/20 p-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <p className="text-sm text-muted-foreground text-center sm:text-left">
                        Have questions about your order?
                      </p>
                      <div className="flex gap-3">
                        <Link to="/contact">
                          <Button variant="outline">Contact Us</Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="gold">Sign In for More Details</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Initial State */}
              {!searched && !order && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Enter Your Order Number</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your order number can be found in your confirmation email or receipt. 
                    It typically looks like "ORD-2024-0001".
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-8">
                If you can't find your order or have questions about your garment, our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Support
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="gold" size="lg">
                    Create an Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;