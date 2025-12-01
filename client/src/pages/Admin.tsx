import { useState, useEffect } from "react";
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
import { useUpdateEvent } from "@/hooks/useUpdateEvent"; // ensure this is the named export your project uses
import { CreateEventRequest } from "@/types/api";

type EventItem = {
  id: string | number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  available_seats?: number; // DB snake_case
  total_seats?: number;     // DB snake_case
  availableSeats?: number;  // fallback camelCase
  totalSeats?: number;      // fallback camelCase
  price?: number;
  image?: string;
};

const Admin = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: events, isLoading, error } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const updateEvent = useUpdateEvent();

  // --- EDIT form state (separate from create form) ---
  const [editOpen, setEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    seats: "",
    price: "",
    image: "",
  });

  // populate edit form when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      const totalSeats =
        editingEvent.total_seats ??
        editingEvent.totalSeats ??
        editingEvent.available_seats ??
        editingEvent.availableSeats ??
        0;

      setEditForm({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        location: editingEvent.location || "",
        // convert ISO to datetime-local format yyyy-MM-ddThh:mm (slice keeps minutes)
        date: editingEvent.date ? new Date(editingEvent.date).toISOString().slice(0, 16) : "",
        seats: String(totalSeats),
        price: String(editingEvent.price ?? ""),
        image: editingEvent.image ?? "",
      });
      setEditOpen(true);
    }
  }, [editingEvent]);

  const resetEditForm = () => {
    setEditingEvent(null);
    setEditForm({
      title: "",
      description: "",
      location: "",
      date: "",
      seats: "",
      price: "",
      image: "",
    });
    setEditOpen(false);
  };

  // --- existing create handler (unchanged) ---
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const eventData: CreateEventRequest = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      totalSeats: parseInt(formData.get("seats") as string),
      price: parseFloat(formData.get("price") as string),
      image: (formData.get("image") as string) || undefined,
    };

    createEvent.mutate(eventData, {
      onSuccess: () => {
        setShowForm(false);
        (e.target as HTMLFormElement).reset();
      },
    });
  };

  const handleDeleteEvent = (id: string | number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(String(id));
    }
  };

  // Called when clicking "Edit" for an event
  const handleEditClick = (event: EventItem) => {
    // Accept both snake_case and camelCase from server
    setEditingEvent(event);
  };

  // Submit update
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    // basic validation
    if (!editForm.title || !editForm.date || !editForm.seats) {
      alert("Please fill Title, Date and Seats.");
      return;
    }

    // Build payload using your CreateEventRequest shape (keep create/update shape same)
    const payload: CreateEventRequest = {
      title: editForm.title,
      description: editForm.description,
      location: editForm.location,
      date: new Date(editForm.date).toISOString(),
      totalSeats: parseInt(editForm.seats || "0"),
      price: parseFloat(editForm.price || "0"),
      image: editForm.image || undefined,
    };

    // `useUpdateEvent` expects { id, data } as you showed earlier
    updateEvent.mutate(
      { id: String(editingEvent.id), data: payload },
      {
        onSuccess: () => {
          resetEditForm();
        },
      }
    );
  };

  // Mock data fallback
  const mockEvents = [
    { id: 1, title: "Tech Innovation Summit 2025", bookings: 350, revenue: 104650, date: new Date().toISOString(), total_seats: 500, price: 299 },
    { id: 2, title: "Summer Music Festival", bookings: 955, revenue: 190045, date: new Date().toISOString(), total_seats: 1000, price: 199 },
    { id: 3, title: "Business Networking Gala", bookings: 100, revenue: 14900, date: new Date().toISOString(), total_seats: 300, price: 149 },
  ];

  const displayEvents: any[] = events && events.length > 0 ? events : mockEvents;

  const stats = [
    { label: "Total Events", value: "12", icon: Calendar, color: "bg-gradient-blue" },
    { label: "Total Bookings", value: "1,405", icon: Users, color: "bg-gradient-primary" },
    { label: "Revenue", value: "$309,595", icon: DollarSign, color: "bg-gradient-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">Manage your events and track performance</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <Button variant="gradient" size="lg" onClick={() => setShowForm((s) => !s)} className="w-full md:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Create New Event
          </Button>
        </motion.div>

        {/* Create Event Form (UNCHANGED) */}
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12">
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
                  <Textarea id="description" placeholder="Describe your event" className="min-h-[120px]" required />
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
                  <Button type="submit" variant="gradient" size="lg" disabled={createEvent.isPending}>
                    {createEvent.isPending ? "Creating..." : "Create Event"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* EDIT form (pre-filled) */}
        {editOpen && editingEvent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="edit_title">Event Title</Label>
                    <Input id="edit_title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Enter event title" required />
                  </div>
                  <div>
                    <Label htmlFor="edit_location">Location</Label>
                    <Input id="edit_location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Event location" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit_description">Description</Label>
                  <Textarea id="edit_description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="min-h-[120px]" placeholder="Describe your event" required />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="edit_date">Date & Time</Label>
                    <Input id="edit_date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} type="datetime-local" required />
                  </div>
                  <div>
                    <Label htmlFor="edit_seats">Total Seats</Label>
                    <Input id="edit_seats" value={editForm.seats} onChange={(e) => setEditForm({ ...editForm, seats: e.target.value })} type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="edit_price">Price ($)</Label>
                    <Input id="edit_price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} type="number" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit_image">Event Image URL</Label>
                  <Input id="edit_image" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="https://example.com/image.jpg" />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="gradient" size="lg" disabled={updateEvent.isPending}>
                    {updateEvent.isPending ? "Updating..." : "Update Event"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={resetEditForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Events List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-bold mb-6">Your Events</h2>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive">Failed to load events from server. Showing sample data.</p>
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
              displayEvents.map((event: any, index: number) => {
                // support snake_case and camelCase shapes from backend
                const totalSeats = event.total_seats ?? event.totalSeats ?? 0;
                const availableSeats = event.available_seats ?? event.availableSeats ?? 0;
                const price = event.price ?? 0;
                const evtDate = event.date ?? event.created_at ?? "";

                return (
                  <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="p-6 hover:shadow-card transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {evtDate ? new Date(evtDate).toLocaleDateString() : "—"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {availableSeats}/{totalSeats} available
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${price}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)} disabled={Boolean(deleteEvent.isPending)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
