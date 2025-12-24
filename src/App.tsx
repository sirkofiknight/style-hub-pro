import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import Register from "./pages/Register";
import Designs from "./pages/Designs";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import UserDashboard from "./pages/UserDashboard";
import UserOrders from "./pages/UserOrders";
import UserAppointments from "./pages/UserAppointments";
import UserPayments from "./pages/UserPayments";
import UserDesigns from "./pages/UserDesigns";
import UserMessages from "./pages/UserMessages";
import UserNotifications from "./pages/UserNotifications";
import UserSettings from "./pages/UserSettings";
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
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";
import Measurements from "./pages/Measurements";
import MeasurementForm from "./pages/MeasurementForm";
import UserNewOrder from "./pages/UserNewOrder";
import UserBookAppointment from "./pages/UserBookAppointment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-order" element={<TrackOrder />} />
            
            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/measurements" element={<Measurements />} />
            <Route path="/dashboard/measurements/new" element={<MeasurementForm />} />
            <Route path="/dashboard/orders" element={<UserOrders />} />
            <Route path="/dashboard/orders/new" element={<UserNewOrder />} />
            <Route path="/dashboard/appointments" element={<UserAppointments />} />
            <Route path="/dashboard/appointments/book" element={<UserBookAppointment />} />
            <Route path="/dashboard/payments" element={<UserPayments />} />
            <Route path="/dashboard/designs" element={<UserDesigns />} />
            <Route path="/dashboard/messages" element={<UserMessages />} />
            <Route path="/dashboard/notifications" element={<UserNotifications />} />
            <Route path="/dashboard/settings" element={<UserSettings />} />
            
            {/* Admin Dashboard Routes */}
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
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
