import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Ruler, 
  Move,
  FileText,
  Scissors
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MeasurementStep from "@/components/measurements/MeasurementStep";
import MeasurementProgress from "@/components/measurements/MeasurementProgress";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  MeasurementData,
  initialMeasurementData,
  upperBodyFields,
  lowerBodyFields,
  additionalFields,
} from "@/types/measurements";

const steps = [
  { id: 1, name: "Profile", icon: <User className="w-5 h-5" /> },
  { id: 2, name: "Upper Body", icon: <Ruler className="w-5 h-5" /> },
  { id: 3, name: "Lower Body", icon: <Move className="w-5 h-5" /> },
  { id: 4, name: "Additional", icon: <FileText className="w-5 h-5" /> },
  { id: 5, name: "Review", icon: <Check className="w-5 h-5" /> },
];

const measurementTypes = [
  { value: "general", label: "General", description: "Standard measurements for most garments" },
  { value: "formal", label: "Formal Wear", description: "Precise measurements for suits and formal attire" },
  { value: "casual", label: "Casual Wear", description: "Relaxed fit measurements" },
  { value: "traditional", label: "Traditional", description: "Measurements for traditional garments" },
];

const MeasurementForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<MeasurementData>(initialMeasurementData);

  const updateData = (key: keyof MeasurementData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !data.profile_name.trim()) {
      toast.error("Please enter a profile name");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to save measurements");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("measurements").insert({
        user_id: user.id,
        profile_name: data.profile_name,
        measurement_type: data.measurement_type,
        measurement_unit: data.measurement_unit,
        neck: data.neck,
        shoulder_width: data.shoulder_width,
        chest: data.chest,
        waist: data.waist,
        sleeve_length: data.sleeve_length,
        arm_hole: data.arm_hole,
        wrist: data.wrist,
        shirt_length: data.shirt_length,
        back_width: data.back_width,
        hips: data.hips,
        thigh: data.thigh,
        inseam: data.inseam,
        outseam: data.outseam,
        trouser_length: data.trouser_length,
        knee: data.knee,
        calf: data.calf,
        ankle: data.ankle,
        height: data.height,
        weight: data.weight,
        notes: data.notes,
        is_default: data.is_default,
      });

      if (error) throw error;

      toast.success("Measurements saved successfully!");
      navigate("/dashboard/measurements");
    } catch (error: any) {
      console.error("Error saving measurements:", error);
      toast.error(error.message || "Failed to save measurements");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">Measurement Profile</h2>
              <p className="text-muted-foreground">
                Create a profile to save and organize your measurements
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile_name">Profile Name *</Label>
                <Input
                  id="profile_name"
                  placeholder="e.g., Work Suits, Casual Shirts, Wedding"
                  value={data.profile_name}
                  onChange={(e) => updateData("profile_name", e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label>Measurement Type</Label>
                <RadioGroup
                  value={data.measurement_type}
                  onValueChange={(value) => updateData("measurement_type", value)}
                  className="space-y-3"
                >
                  {measurementTypes.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                      <Label htmlFor={type.value} className="cursor-pointer flex-1">
                        <span className="font-medium">{type.label}</span>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {type.description}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Measurement Unit</Label>
                <RadioGroup
                  value={data.measurement_unit}
                  onValueChange={(value) => updateData("measurement_unit", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inches" id="inches" />
                    <Label htmlFor="inches">Inches</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="centimeters" id="centimeters" />
                    <Label htmlFor="centimeters">Centimeters</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <MeasurementStep
            title="Upper Body Measurements"
            description="Measure your upper body for shirts, suits, and jackets"
            fields={upperBodyFields}
            data={data}
            onChange={updateData}
            unit={data.measurement_unit === "inches" ? "in" : "cm"}
          />
        );

      case 3:
        return (
          <MeasurementStep
            title="Lower Body Measurements"
            description="Measure your lower body for trousers, pants, and skirts"
            fields={lowerBodyFields}
            data={data}
            onChange={updateData}
            unit={data.measurement_unit === "inches" ? "in" : "cm"}
          />
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">Additional Information</h2>
              <p className="text-muted-foreground">
                Add any extra details to help our tailors
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {additionalFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                    <div className="relative">
                      <Input
                        id={field.key}
                        type="number"
                        step="0.5"
                        placeholder={field.placeholder}
                        value={data[field.key] === null ? "" : String(data[field.key])}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateData(
                            field.key,
                            value === "" ? null : parseFloat(value) || null
                          );
                        }}
                        className="pr-12 h-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {field.key === "height" ? (data.measurement_unit === "inches" ? "in" : "cm") : "lbs"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements, preferences, or details for our tailors..."
                  value={data.notes}
                  onChange={(e) => updateData("notes", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={data.is_default}
                  onCheckedChange={(checked) => updateData("is_default", !!checked)}
                />
                <Label htmlFor="is_default" className="cursor-pointer">
                  Set as my default measurement profile
                </Label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Review Your Measurements</h2>
              <p className="text-muted-foreground">
                Please review your measurements before saving
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Profile Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Profile Name:</span>
                    <p className="font-medium">{data.profile_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{data.measurement_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unit:</span>
                    <p className="font-medium capitalize">{data.measurement_unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Default:</span>
                    <p className="font-medium">{data.is_default ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              {/* Upper Body */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Upper Body</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {upperBodyFields.map((field) => (
                    <div key={field.key}>
                      <span className="text-muted-foreground">{field.label}:</span>
                      <p className="font-medium">
                        {data[field.key] !== null
                          ? `${data[field.key]} ${data.measurement_unit === "inches" ? "in" : "cm"}`
                          : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower Body */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Lower Body</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {lowerBodyFields.map((field) => (
                    <div key={field.key}>
                      <span className="text-muted-foreground">{field.label}:</span>
                      <p className="font-medium">
                        {data[field.key] !== null
                          ? `${data[field.key]} ${data.measurement_unit === "inches" ? "in" : "cm"}`
                          : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional */}
              {(data.height || data.weight || data.notes) && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold mb-4">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {data.height && (
                      <div>
                        <span className="text-muted-foreground">Height:</span>
                        <p className="font-medium">
                          {data.height} {data.measurement_unit === "inches" ? "in" : "cm"}
                        </p>
                      </div>
                    )}
                    {data.weight && (
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <p className="font-medium">{data.weight} lbs</p>
                      </div>
                    )}
                  </div>
                  {data.notes && (
                    <div className="mt-4">
                      <span className="text-muted-foreground text-sm">Notes:</span>
                      <p className="mt-1">{data.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="user" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName={user?.user_metadata?.first_name || "User"} 
          userEmail={user?.email || ""} 
          userType="user" 
        />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard/measurements")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Measurements
              </Button>
              <h1 className="font-display text-3xl font-bold">Add New Measurements</h1>
              <p className="text-muted-foreground mt-2">
                Follow the guided steps to record your body measurements accurately
              </p>
            </div>

            {/* Progress */}
            <div className="mb-12">
              <MeasurementProgress steps={steps} currentStep={currentStep} />
            </div>

            {/* Step Content */}
            <div className="bg-card rounded-2xl border border-border p-8 mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button variant="gold" onClick={nextStep} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="gold"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Measurements
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MeasurementForm;
