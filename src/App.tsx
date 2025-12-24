import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Designs from "./pages/Designs";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminMeasurements from "./pages/AdminMeasurements";
import AdminPayments from "./pages/AdminPayments";
import AdminExpenses from "./pages/AdminExpenses";
import AdminFabrics from "./pages/AdminFabrics";
import AdminAppointments from "./pages/AdminAppointments";
import AdminStaff from "./pages/AdminStaff";
import AdminReports from "./pages/AdminReports";
import Measurements from "./pages/Measurements";
import MeasurementForm from "./pages/MeasurementForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/measurements" element={<Measurements />} />
            <Route path="/dashboard/measurements/new" element={<MeasurementForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/measurements" element={<AdminMeasurements />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/expenses" element={<AdminExpenses />} />
            <Route path="/admin/fabrics" element={<AdminFabrics />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
