import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Ruler, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Palette,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Users,
  Receipt,
  BarChart3,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userType: "user" | "admin";
}

const userLinks = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/measurements", icon: Ruler, label: "Measurements" },
  { path: "/dashboard/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { path: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  { path: "/dashboard/designs", icon: Palette, label: "Design Gallery" },
  { path: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
];

const adminLinks = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/customers", icon: Users, label: "Customers" },
  { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/admin/measurements", icon: Ruler, label: "Measurements" },
  { path: "/admin/payments", icon: CreditCard, label: "Payments" },
  { path: "/admin/expenses", icon: Receipt, label: "Expenses" },
  { path: "/admin/fabrics", icon: Palette, label: "Fabrics" },
  { path: "/admin/appointments", icon: Calendar, label: "Appointments" },
  { path: "/admin/staff", icon: UserCog, label: "Staff" },
  { path: "/admin/reports", icon: BarChart3, label: "Reports" },
];

const DashboardSidebar = ({ userType }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const links = userType === "admin" ? adminLinks : userLinks;

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold shrink-0">
            <Scissors className="w-5 h-5 text-accent-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-xl font-semibold text-foreground">
              Atelier<span className="text-accent">.</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive(link.path)
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className={cn(
                  "w-5 h-5 shrink-0",
                  isActive(link.path) ? "text-accent" : "group-hover:text-foreground"
                )} />
                {!collapsed && (
                  <span className="font-medium text-sm">{link.label}</span>
                )}
                {isActive(link.path) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to={`${userType === "admin" ? "/admin" : "/dashboard"}/notifications`}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          )}
        >
          <Bell className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Notifications</span>}
        </Link>
        <Link
          to={`${userType === "admin" ? "/admin" : "/dashboard"}/settings`}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
        <Link
          to="/login"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
