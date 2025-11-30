import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useEvents";
import useEvent from "@/hooks/useEvent";
import eventTech from "@/assets/event-tech.jpg";
import eventMusic from "@/assets/event-music.jpg";
import eventBusiness from "@/assets/event-business.jpg";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  
  const isIdSearch = Boolean(searchTerm && /^\s*\d+\s*$/.test(searchTerm));

  const { data: singleEvent, isLoading: isLoadingEvent, error: errorEvent } = useEvent(
    isIdSearch ? searchTerm.trim() : undefined
  );

  const { data: events, isLoading, error } = useEvents({ 
    // when searching by id we fetch a single event route (/events/:id)
    // so avoid calling the list endpoint with the numeric id as a search term
    search: isIdSearch ? undefined : searchTerm || undefined,
    sortBy: sortBy === 'date' ? 'date' : sortBy === 'price-low' || sortBy === 'price-high' ? 'price' : undefined,
    sortOrder: sortBy === 'price-high' ? 'desc' : 'asc'
  });

  // Mock data - fallback when API is not connected
  const allEvents = [
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
    {
      id: "4",
      title: "Digital Marketing Conference",
      description: "Learn the latest strategies in SEO, social media, and content marketing from industry experts.",
      location: "Miami, FL",
      date: "2025-05-05T10:00:00",
      availableSeats: 80,
      totalSeats: 250,
      price: 179,
      image: eventTech,
      gradient: "bg-gradient-primary",
    },
    {
      id: "5",
      title: "Jazz & Blues Night",
      description: "An intimate evening with renowned jazz and blues musicians in a historic venue.",
      location: "New Orleans, LA",
      date: "2025-04-22T20:00:00",
      availableSeats: 120,
      totalSeats: 200,
      price: 89,
      image: eventMusic,
      gradient: "bg-gradient-blue",
    },
    {
      id: "6",
      title: "Startup Pitch Competition",
      description: "Watch innovative startups pitch their ideas to top investors and win funding opportunities.",
      location: "Boston, MA",
      date: "2025-05-18T14:00:00",
      availableSeats: 180,
      totalSeats: 350,
      price: 99,
      image: eventBusiness,
      gradient: "bg-gradient-pink",
    },
  ];

  // Filter events based on location
  const filteredEvents = useMemo(() => {
    // If searching specifically by id and we have a result, show only that
    if (isIdSearch) {
      if (singleEvent) {
        const e = {
          ...singleEvent,
          image: singleEvent.image || eventTech,
          gradient: 'bg-gradient-primary'
        };
        return [e];
      }

      // If no result returned yet, show empty array so UI can show 'no results'
      return [];
    }

    const eventsToFilter = events && events.length > 0 
      ? events.map(event => ({
          ...event,
          image: event.image || eventTech,
          gradient: "bg-gradient-primary"
        }))
      : allEvents;

    if (locationFilter === "all") return eventsToFilter;
    
    return eventsToFilter.filter(event => 
      event.location.toLowerCase().includes(locationFilter.toLowerCase())
    );
  }, [events, singleEvent, locationFilter, isIdSearch]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header with gradient */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Browse <span className="bg-gradient-primary bg-clip-text text-transparent">All Events</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover amazing events happening near you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="sf">San Francisco</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
              </SelectContent>
            </Select>


            <Button variant="outline" className="md:w-auto">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {(error || errorEvent) && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-center">
                {isIdSearch
                  ? `Failed to load event with id '${searchTerm}'. Showing sample data.`
                  : 'Failed to load events from server. Showing sample data.'}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> events
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(isLoading || (isIdSearch && isLoadingEvent)) ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </>
            ) : (
              filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard {...event} />
              </motion.div>
                ))
              ) : (
                // no results
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground mb-4">No events found.</p>
                  {isIdSearch && !isLoadingEvent && !singleEvent && (
                    <p className="text-sm text-foreground/80">No event found with id "{searchTerm}".</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
