import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ruler, Scissors, Shirt, Crown, Heart, Sparkles, ArrowRight, Check } from "lucide-react";

const services = [
  {
    icon: Shirt,
    title: "Custom Suits",
    description: "Impeccably tailored suits crafted from premium fabrics, designed to your exact measurements and style preferences.",
    features: ["Premium fabric selection", "Multiple fittings included", "Personalized styling consultation", "Lifetime alterations"],
    price: "From $899",
  },
  {
    icon: Heart,
    title: "Wedding Attire",
    description: "Make your special day unforgettable with bespoke wedding garments for brides, grooms, and the entire wedding party.",
    features: ["Bridal gowns & suits", "Bridesmaid & groomsmen attire", "Rush orders available", "On-site fitting service"],
    price: "From $1,299",
  },
  {
    icon: Scissors,
    title: "Alterations",
    description: "Expert alterations to ensure your existing garments fit perfectly. From simple hems to complex restructuring.",
    features: ["Same-day service available", "All garment types", "Preserve original design", "Competitive pricing"],
    price: "From $25",
  },
  {
    icon: Crown,
    title: "Bespoke Dresses",
    description: "Elegant dresses designed and crafted exclusively for you, perfect for any occasion from galas to casual events.",
    features: ["Custom design consultation", "Fabric sourcing worldwide", "Multiple style options", "Perfect fit guarantee"],
    price: "From $599",
  },
  {
    icon: Sparkles,
    title: "Traditional Wear",
    description: "Authentic traditional garments crafted with respect for cultural heritage and modern tailoring excellence.",
    features: ["Cultural authenticity", "Hand embroidery options", "Family heritage pieces", "Ceremonial attire"],
    price: "From $499",
  },
  {
    icon: Ruler,
    title: "Corporate Uniforms",
    description: "Professional uniforms designed to represent your brand with consistency, comfort, and style.",
    features: ["Brand integration", "Bulk order discounts", "Size range flexibility", "Durable construction"],
    price: "Custom quote",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose/20 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Services</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Crafting Excellence, <span className="text-gradient-gold">One Stitch at a Time</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                From bespoke suits to wedding attire, we offer comprehensive tailoring services 
                that combine traditional craftsmanship with modern precision.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-elegant-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:shadow-gold transition-all duration-300">
                    <service.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <span className="font-display text-lg font-semibold text-accent">{service.price}</span>
                    <Link to="/register">
                      <Button variant="ghost" size="sm" className="gap-1 group/btn">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Experience <span className="text-accent">Bespoke Excellence?</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
              Book a consultation with our expert tailors and begin your journey to perfectly fitted garments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="xl">
                  Book Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;