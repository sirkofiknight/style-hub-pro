import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["All", "Suits", "Dresses", "Shirts", "Traditional", "Wedding", "Casual"];

const designs = [
  {
    id: 1,
    name: "Classic Navy Suit",
    category: "Suits",
    price: "$850",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    featured: true,
  },
  {
    id: 2,
    name: "Ivory Wedding Gown",
    category: "Wedding",
    price: "$2,400",
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=500&fit=crop",
    featured: true,
  },
  {
    id: 3,
    name: "Silk Evening Dress",
    category: "Dresses",
    price: "$650",
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    featured: false,
  },
  {
    id: 4,
    name: "Bespoke Formal Shirt",
    category: "Shirts",
    price: "$180",
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    featured: false,
  },
  {
    id: 5,
    name: "Traditional Kaftan",
    category: "Traditional",
    price: "$320",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop",
    featured: true,
  },
  {
    id: 6,
    name: "Charcoal Business Suit",
    category: "Suits",
    price: "$920",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop",
    featured: false,
  },
  {
    id: 7,
    name: "Casual Linen Blazer",
    category: "Casual",
    price: "$280",
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
    featured: false,
  },
  {
    id: 8,
    name: "Bridesmaid Gown",
    category: "Wedding",
    price: "$450",
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop",
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
              Explore our collection of exquisite designs. Each piece can be customized to your exact specifications.
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
              We specialize in custom designs. Share your vision with us and we'll bring it to life.
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
