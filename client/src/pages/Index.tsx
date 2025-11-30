import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import { Sparkles, TrendingUp, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useEvents";
import eventTech from "@/assets/event-tech.jpg";
import eventMusic from "@/assets/event-music.jpg";
import eventBusiness from "@/assets/event-business.jpg";

const Index = () => {
  const { data: events, isLoading, error } = useEvents({ sortBy: 'date', sortOrder: 'asc' });
  
  // Mock data - fallback when API is not connected
  const featuredEvents = [
    {
      id: "1",
      title: "Tech Innovation Summit 2025",
      description: "Join industry leaders discussing the future of AI, blockchain, and quantum computing in this groundbreaking summit.",
      location: "San Francisco, CA",
      date: "2025-03-15T09:00:00",
      availableSeats: 150,
      totalSeats: 500,
      price: 299,
      image: eventTech,
      gradient: "bg-gradient-blue",
    },
    {
      id: "2",
      title: "Summer Music Festival",
      description: "Experience three days of incredible live music from top artists across multiple genres under the stars.",
      location: "Austin, TX",
      date: "2025-06-20T18:00:00",
      availableSeats: 45,
      totalSeats: 1000,
      price: 199,
      image: eventMusic,
      gradient: "bg-gradient-pink",
    },
    {
      id: "3",
      title: "Business Networking Gala",
      description: "Connect with entrepreneurs, investors, and business leaders in an elegant evening of networking and insights.",
      location: "New York, NY",
      date: "2025-04-10T19:00:00",
      availableSeats: 200,
      totalSeats: 300,
      price: 149,
      image: eventBusiness,
      gradient: "bg-gradient-secondary",
    },
  ];

  // Use API data if available, otherwise use mock data
  const displayEvents = events && events.length > 0 
    ? events.slice(0, 3).map(event => ({
        ...event,
        image: event.image || eventTech,
        gradient: "bg-gradient-primary"
      }))
    : featuredEvents;

  const features = [
    {
      icon: Sparkles,
      title: "Curated Events",
      description: "Hand-picked experiences from the best organizers worldwide",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Updates",
      description: "Live seat availability and instant booking confirmations",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and encrypted payment processing for peace of mind",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">EventHub</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern way to discover and book amazing events
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-glow transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these incredible upcoming experiences
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-center">
                Failed to load events. Using sample data.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </>
            ) : (
              displayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard {...event} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Create Your Event?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of organizers who trust EventHub to bring their events to life
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-glow hover:shadow-xl transition-all"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2025 EventHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;