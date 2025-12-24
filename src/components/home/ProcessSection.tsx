import { UserPlus, Ruler, Scissors, Package, Check } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up and complete your profile with basic information.",
  },
  {
    icon: Ruler,
    step: "02",
    title: "Submit Measurements",
    description: "Use our guided system or book an in-person measurement session.",
  },
  {
    icon: Scissors,
    step: "03",
    title: "Choose Design",
    description: "Browse our gallery or upload your custom design preferences.",
  },
  {
    icon: Package,
    step: "04",
    title: "Track & Receive",
    description: "Monitor progress in real-time and receive your perfect garment.",
  },
];

const ProcessSection = () => {
  return (
    <section className="py-24 bg-secondary/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Simple <span className="text-gradient-gold">4-Step</span> Process
          </h2>
          <p className="text-muted-foreground text-lg">
            From your first visit to final delivery, we've streamlined every step for your convenience.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center group">
                {/* Step Number */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-elegant group-hover:shadow-gold transition-all duration-300">
                  <step.icon className="w-8 h-8 text-accent" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-gold text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>

                {/* Checkmark for completed feel */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-10 -right-4 w-8 h-8 rounded-full bg-accent/10 items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
