import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MeasurementField, MeasurementData } from "@/types/measurements";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MeasurementStepProps {
  title: string;
  description: string;
  fields: MeasurementField[];
  data: MeasurementData;
  onChange: (key: keyof MeasurementData, value: number | null) => void;
  unit: string;
}

const MeasurementStep = ({ title, description, fields, data, onChange, unit }: MeasurementStepProps) => {
  const handleChange = (key: keyof MeasurementData, value: string) => {
    if (value === "") {
      onChange(key, null);
    } else {
      const numValue = parseFloat(value);
      onChange(key, isNaN(numValue) ? null : numValue);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={field.key} className="font-medium">
                {field.label}
              </Label>
              {field.guide && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{field.guide}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{field.description}</p>
            <div className="relative">
              <Input
                id={field.key}
                type="number"
                step="0.25"
                placeholder={field.placeholder}
                value={data[field.key] === null ? "" : String(data[field.key])}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="pr-12 h-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementStep;
