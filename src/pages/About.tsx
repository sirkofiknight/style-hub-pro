import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Users, Clock, Heart, ArrowRight } from "lucide-react";

const stats = [
  { value: "15+", label: "Years of Excellence", icon: Clock },
  { value: "5000+", label: "Happy Clients", icon: Users },
  { value: "50+", label: "Master Tailors", icon: Award },
  { value: "98%", label: "Satisfaction Rate", icon: Heart },
];

const team = [
  {
    name: "Kofi Agyeman",
    role: "Master Tailor & Founder",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&h=300&fit=crop&crop=face",
    bio: "With over 25 years of experience in bespoke tailoring, Kofi founded Atelier with a vision to blend Ghanaian craftsmanship with modern elegance.",
  },
  {
    name: "Abena Owusu",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face",
    bio: "Abena brings contemporary flair to traditional Ghanaian fabrics, leading our design team with creativity and cultural authenticity.",
  },
  {
    name: "Yaw Boateng",
    role: "Client Relations Director",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    bio: "Yaw ensures every client receives personalized attention and exceptional service throughout their tailoring journey.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose/20 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Story</span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                  A Legacy of <span className="text-gradient-gold">Craftsmanship</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Founded in 2010, Atelier began with a simple mission: to celebrate Ghanaian 
                  craftsmanship while bringing bespoke tailoring into the modern age. We combine 
                  time-honored techniques passed down through generations with cutting-edge 
                  technology to deliver garments that are truly one-of-a-kind.
                </p>
                <p className="text-muted-foreground text-lg">
                  Today, we are proud to serve clients across Ghana and beyond, from first-time 
                  suit buyers to fashion industry veterans who appreciate the difference that 
                  true African craftsmanship makes.
                </p>
              </div>
              
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
                    alt="Tailoring craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-elegant-lg border border-border">
                  <div className="font-display text-3xl font-bold text-accent">15+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-primary-foreground/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Values</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                What We <span className="text-gradient-gold">Stand For</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality Without Compromise",
                  description: "We source only the finest materials and employ master craftsmen who take pride in every stitch. Quality is not negotiable.",
                },
                {
                  title: "Personal Connection",
                  description: "Every client is unique, and so is every garment we create. We take time to understand your style, needs, and vision.",
                },
                {
                  title: "Innovation in Tradition",
                  description: "While we honor traditional techniques, we embrace technology to enhance precision, efficiency, and the overall experience.",
                },
              ].map((value) => (
                <div key={value.title} className="p-8 rounded-2xl bg-card border border-border text-center">
                  <h3 className="font-display text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Team</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                Meet the <span className="text-gradient-gold">Masters</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Our team of skilled artisans and dedicated professionals work together to bring your vision to life.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant-lg transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold">{member.name}</h3>
                    <p className="text-accent text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
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
              Ready to Start Your <span className="text-accent">Tailoring Journey?</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of satisfied clients who have discovered the difference of bespoke tailoring.
            </p>
            <Link to="/register">
              <Button variant="gold" size="xl">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;