import { Check, Scissors, Shirt, UserCheck, Package, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "cutting" | "stitching" | "fitting" | "completed" | "delivered" | "cancelled";

interface OrderStatusTimelineProps {
  status: OrderStatus;
  className?: string;
  compact?: boolean;
}

const stages: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: "pending", label: "Order Placed", icon: Check },
  { key: "cutting", label: "Cutting", icon: Scissors },
  { key: "stitching", label: "Stitching", icon: Shirt },
  { key: "fitting", label: "Fitting", icon: UserCheck },
  { key: "completed", label: "Completed", icon: Package },
  { key: "delivered", label: "Delivered", icon: Truck },
];

const getStageIndex = (status: OrderStatus): number => {
  if (status === "cancelled") return -1;
  return stages.findIndex((s) => s.key === status);
};

export const OrderStatusTimeline = ({ status, className, compact = false }: OrderStatusTimelineProps) => {
  const currentStageIndex = getStageIndex(status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className={cn("flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20", className)}>
        <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center shrink-0">
          <X className="w-5 h-5 text-destructive-foreground" />
        </div>
        <div>
          <p className="font-semibold text-destructive">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {stages.map((stage, index) => {
          const isCompleted = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div key={stage.key} className="flex items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground",
                  isCurrent && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-[10px] font-medium">{index + 1}</span>
                )}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    "w-4 h-0.5 transition-colors",
                    index < currentStageIndex ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {stages.map((stage, index) => {
        const isCompleted = index <= currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isLast = index === stages.length - 1;
        const Icon = stage.icon;

        return (
          <div key={stage.key} className="flex gap-4">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  isCompleted
                    ? "bg-accent text-accent-foreground shadow-gold"
                    : "bg-secondary text-muted-foreground border-2 border-border",
                  isCurrent && "ring-4 ring-accent/20"
                )}
              >
                {isCompleted ? (
                  <Icon className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5 opacity-50" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-12 transition-colors",
                    index < currentStageIndex ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-8", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-semibold transition-colors",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stage.label}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isCurrent ? (
                  <span className="text-accent font-medium">In Progress</span>
                ) : isCompleted ? (
                  "Completed"
                ) : (
                  "Pending"
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTimeline;