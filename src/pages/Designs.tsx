import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import generated African fashion images
import kenteRoyalImg from "@/assets/designs/kente-royal.jpg";
import agbadaGrandImg from "@/assets/designs/agbada-grand.jpg";
import kenteWeddingImg from "@/assets/designs/kente-wedding.jpg";
import africanSuitImg from "@/assets/designs/african-suit.jpg";
import kaftanEmbroideredImg from "@/assets/designs/kaftan-embroidered.jpg";
import smockFuguImg from "@/assets/designs/smock-fugu.jpg";
import senatorKaftanImg from "@/assets/designs/senator-kaftan.jpg";
import groomsmenKenteImg from "@/assets/designs/groomsmen-kente.jpg";
import ashantiKenteImg from "@/assets/designs/ashanti-kente.jpg";
import batakariImg from "@/assets/designs/batakari.jpg";

const categories = ["All", "Kente", "Agbada", "Kaftan", "Suits", "Wedding", "Smock"];

const designs = [
  {
    id: 1,
    name: "Royal Kente Cloth",
    category: "Kente",
    price: "GHS 2,800",
    rating: 4.9,
    reviews: 124,
    image: kenteRoyalImg,
    featured: true,
  },
  {
    id: 2,
    name: "Grand Agbada Set",
    category: "Agbada",
    price: "GHS 3,500",
    rating: 5.0,
    reviews: 89,
    image: agbadaGrandImg,
    featured: true,
  },
  {
    id: 3,
    name: "Kente Wedding Gown",
    category: "Wedding",
    price: "GHS 4,200",
    rating: 4.8,
    reviews: 67,
    image: kenteWeddingImg,
    featured: true,
  },
  {
    id: 4,
    name: "African Print Suit",
    category: "Suits",
    price: "GHS 2,200",
    rating: 4.7,
    reviews: 203,
    image: africanSuitImg,
    featured: false,
  },
  {
    id: 5,
    name: "Embroidered Kaftan",
    category: "Kaftan",
    price: "GHS 1,800",
    rating: 4.9,
    reviews: 156,
    image: kaftanEmbroideredImg,
    featured: true,
  },
  {
    id: 6,
    name: "Northern Smock (Fugu)",
    category: "Smock",
    price: "GHS 950",
    rating: 4.8,
    reviews: 98,
    image: smockFuguImg,
    featured: false,
  },
  {
    id: 7,
    name: "Senator Kaftan",
    category: "Kaftan",
    price: "GHS 1,500",
    rating: 4.6,
    reviews: 145,
    image: senatorKaftanImg,
    featured: false,
  },
  {
    id: 8,
    name: "Kente Groomsmen Set",
    category: "Wedding",
    price: "GHS 2,000",
    rating: 4.9,
    reviews: 78,
    image: groomsmenKenteImg,
    featured: false,
  },
  {
    id: 9,
    name: "Ashanti Kente Royal",
    category: "Kente",
    price: "GHS 3,200",
    rating: 5.0,
    reviews: 112,
    image: ashantiKenteImg,
    featured: true,
  },
  {
    id: 10,
    name: "Batakari Traditional",
    category: "Smock",
    price: "GHS 800",
    rating: 4.7,
    reviews: 89,
    image: batakariImg,
    featured: false,
  },
];

const Designs = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDesigns = designs.filter((design) => {
    const matchesCategory = activeCategory === "All" || design.category === activeCategory;
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Design <span className="text-gradient-gold">Gallery</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our collection of authentic Ghanaian designs. From royal kente to elegant agbada, each piece can be customized to your exact specifications.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search designs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "gold" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Designs Grid */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div 
                key={design.id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-elegant-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Featured Badge */}
                  {design.featured && (
                    <Badge className="absolute top-3 left-3 bg-gradient-gold text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  
                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
                    <Heart className="w-5 h-5 text-foreground" />
                  </button>

                  {/* Quick Action */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="gold" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-accent font-medium uppercase tracking-wider">{design.category}</p>
                      <h3 className="font-display text-lg font-semibold">{design.name}</h3>
                    </div>
                    <span className="font-display text-lg font-bold text-accent">{design.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{design.rating}</span>
                    <span className="text-sm text-muted-foreground">({design.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDesigns.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No designs found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mt-16">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              We specialize in custom Ghanaian designs. Share your vision with us and we will bring it to life with authentic craftsmanship.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="lg" className="group">
                Request Custom Design
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Designs;
