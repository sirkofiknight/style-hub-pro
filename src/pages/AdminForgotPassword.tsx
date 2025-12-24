import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    
    if (error) {
      toast.error(error.message || "Failed to send reset email");
      setIsLoading(false);
      return;
    }
    
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-600/5 via-transparent to-transparent" />
        
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20">
            <Shield className="w-12 h-12 text-slate-900" />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-bold text-white">
              Password Recovery
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Securely reset your admin credentials to regain access to the control center.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <span className="font-display text-2xl font-bold text-white">
              Admin Portal
            </span>
          </div>

          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-white">
                  Check Your Email
                </h2>
                <p className="text-slate-400">
                  If an admin account exists with <span className="text-amber-400">{email}</span>, 
                  you'll receive a password reset link shortly.
                </p>
              </div>
              <div className="pt-4">
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Admin Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-bold text-white">
                  Forgot Password?
                </h2>
                <p className="text-slate-400">
                  Enter your admin email address and we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-800">
                <Link 
                  to="/admin/login" 
                  className="flex items-center justify-center gap-2 text-slate-400 hover:text-amber-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Admin Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
