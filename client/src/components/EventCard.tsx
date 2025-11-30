import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  image: string;
  gradient: string;
  onBookNow?: () => void;
}

const EventCard = ({
  id,
  title,
  description,
  location,
  date,
  availableSeats,
  totalSeats,
  price,
  image,
  gradient,
  onBookNow,
}: EventCardProps) => {
  const seatPercentage = (availableSeats / totalSeats) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group cursor-pointer shadow-card hover:shadow-glow transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <div className={`absolute inset-0 ${gradient} opacity-90`} />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-secondary text-foreground px-3 py-1 rounded-full font-bold">
            ${price}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(date).toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span className={seatPercentage < 20 ? "text-destructive font-medium" : "text-muted-foreground"}>
                {availableSeats} / {totalSeats} seats available
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium">{Math.round(seatPercentage)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${seatPercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${
                  seatPercentage < 20 ? "bg-destructive" : "bg-gradient-primary"
                }`}
              />
            </div>
          </div>

          <Button variant="gradient" className="w-full group/btn" onClick={onBookNow}>
            Book Now
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default EventCard;