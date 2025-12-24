import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard = ({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-elegant transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-display">{value}</p>
          {change && (
            <p className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-green-600",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconColor || "bg-accent/10"
        )}>
          <Icon className={cn("w-6 h-6", iconColor ? "text-accent-foreground" : "text-accent")} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
