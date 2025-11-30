import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Calendar, Users, DollarSign } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { CreateEventRequest } from "@/types/api";

const Admin = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: events, isLoading, error } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const eventData: CreateEventRequest = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      date: new Date(formData.get('date') as string).toISOString(),
      totalSeats: parseInt(formData.get('seats') as string),
      price: parseFloat(formData.get('price') as string),
      image: formData.get('image') as string || undefined,
    };

    createEvent.mutate(eventData, {
      onSuccess: () => {
        setShowForm(false);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent.mutate(id);
    }
  };

  // Mock data fallback
  const mockEvents = [
    { id: 1, title: "Tech Innovation Summit 2025", bookings: 350, revenue: 104650 },
    { id: 2, title: "Summer Music Festival", bookings: 955, revenue: 190045 },
    { id: 3, title: "Business Networking Gala", bookings: 100, revenue: 14900 },
  ];

  const displayEvents = events && events.length > 0 ? events : mockEvents;

  const stats = [
    { label: "Total Events", value: "12", icon: Calendar, color: "bg-gradient-blue" },
    { label: "Total Bookings", value: "1,405", icon: Users, color: "bg-gradient-primary" },
    { label: "Revenue", value: "$309,595", icon: DollarSign, color: "bg-gradient-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your events and track performance
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-glow transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Event Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Button
            variant="gradient"
            size="lg"
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Event
          </Button>
        </motion.div>

        {/* Create Event Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" placeholder="Enter event title" required />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Event location" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="date">Date & Time</Label>
                    <Input id="date" type="datetime-local" required />
                  </div>
                  <div>
                    <Label htmlFor="seats">Total Seats</Label>
                    <Input id="seats" type="number" placeholder="500" required />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" placeholder="99" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Event Image URL</Label>
                  <Input id="image" placeholder="https://example.com/image.jpg" />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="gradient" size="lg">
                    Create Event
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Your Events</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive">
                Failed to load events from server. Showing sample data.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </Card>
                ))}
              </>
            ) : (
              displayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-card transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.availableSeats}/{event.totalSeats} available
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${event.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deleteEvent.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
