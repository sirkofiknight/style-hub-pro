import { Ruler, Palette, Clock, Award, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Ruler,
    title: "Precise Measurements",
    description: "Digital measurement system ensuring perfect fit every time with guided step-by-step process.",
  },
  {
    icon: Palette,
    title: "Custom Designs",
    description: "Browse our gallery or upload your own designs. Our tailors bring any vision to life.",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Track your order from fabric selection to final stitch with live status updates.",
  },
  {
    icon: Award,
    title: "Master Craftsmen",
    description: "Each garment is handcrafted by experienced tailors with decades of expertise.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee with free alterations within 30 days of delivery.",
  },
  {
    icon: Headphones,
    title: "Personal Consultant",
    description: "Dedicated style consultant to guide you through fabric, style, and design choices.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Tailoring Excellence, <span className="text-gradient-gold">Redefined</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We combine traditional craftsmanship with modern technology to deliver an unparalleled tailoring experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-elegant-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:shadow-gold transition-all duration-300">
                <feature.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
