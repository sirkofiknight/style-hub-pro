import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const appointmentTypes = [
  { value: "consultation", label: "Consultation", description: "Discuss your style preferences and requirements" },
  { value: "measurement", label: "Measurement", description: "Get professionally measured for your garment" },
  { value: "fitting", label: "Fitting", description: "Try on your garment for adjustments" },
  { value: "pickup", label: "Pickup", description: "Collect your completed garment" },
  { value: "other", label: "Other", description: "Other appointment types" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const UserBookAppointment = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    appointmentType: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointmentType) {
      toast.error("Please select an appointment type");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!formData.time) {
      toast.error("Please select a time");
      return;
    }

    if (!user) return;

    setSubmitting(true);

    const customerName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || 'Customer';

    const { error } = await supabase.from('appointments').insert({
      user_id: user.id,
      customer_name: customerName,
      customer_email: user.email,
      appointment_type: formData.appointmentType as 'consultation' | 'measurement' | 'fitting' | 'pickup' | 'other',
      appointment_date: format(date, 'yyyy-MM-dd'),
      appointment_time: formData.time,
      notes: formData.notes || null,
      status: 'pending' as const,
    });

    if (error) {
      toast.error("Failed to book appointment. Please try again.");
      console.error(error);
    } else {
      toast.success("Appointment booked successfully!");
      navigate("/dashboard/appointments");
    }

    setSubmitting(false);
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.first_name || "User";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userType="user" />
      
      <div className="ml-64">
        <DashboardHeader 
          userName={userName} 
          userEmail={user.email || ""} 
          userType="user" 
        />
        
        <main className="p-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard/appointments")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>

          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">Book Appointment</h1>
                <p className="text-muted-foreground">Schedule a fitting or consultation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="space-y-3">
                  <Label>Appointment Type *</Label>
                  <div className="grid gap-3">
                    {appointmentTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={() => setFormData(prev => ({ ...prev, appointmentType: type.value }))}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          formData.appointmentType === type.value
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{type.label}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            formData.appointmentType === type.value
                              ? "border-accent"
                              : "border-muted-foreground/30"
                          )}>
                            {formData.appointmentType === type.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < tomorrow || date.getDay() === 0}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">Closed on Sundays</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time">
                          {formData.time ? (
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatTime(formData.time)}
                            </span>
                          ) : (
                            "Select time"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or information we should know..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/appointments")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserBookAppointment;
