import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
  icon: React.ReactNode;
}

interface MeasurementProgressProps {
  steps: Step[];
  currentStep: number;
}

const MeasurementProgress = ({ steps, currentStep }: MeasurementProgressProps) => {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
        <div 
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isCompleted 
                    ? "bg-accent border-accent text-accent-foreground"
                    : isCurrent
                    ? "bg-background border-accent text-accent"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-xs font-medium hidden sm:block",
                  isCurrent ? "text-accent" : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeasurementProgress;
