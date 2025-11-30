import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { Event } from "@/types/api";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import { Download } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const BookingDialog = ({ event, open, onOpenChange, onSuccess }: BookingDialogProps) => {
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const quantity = watch("quantity") || 1;
  const totalAmount = event ? event.price * quantity : 0;

  useEffect(() => {
    if (open) {
      reset({ quantity: 1 });
      setBookingStatus("idle");
      setErrorMessage("");
      setBookingData(null);
      setQrCodeUrl("");
    }
  }, [open, reset]);

  const onSubmit = async (data: BookingFormData) => {
    if (!event) return;

    if (data.quantity > event.availableSeats) {
      setBookingStatus("error");
      setErrorMessage(`Only ${event.availableSeats} seats available. Please reduce quantity.`);
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        eventId: event.id,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        quantity: data.quantity,
      });

      const bookingTime = new Date().toISOString();
      const ticketData = {
        bookingId: booking.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        customerName: data.name,
        email: data.email,
        mobile: data.mobile,
        seats: data.quantity,
        totalAmount: totalAmount,
        bookingTime: bookingTime,
      };

      setBookingData(ticketData);
      
      // Generate QR code
      const qrData = JSON.stringify(ticketData);
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrUrl);

      setBookingStatus("success");
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    } catch (error: any) {
      setBookingStatus("error");
      setErrorMessage(error?.message || "Booking failed. Please try again.");
    }
  };

  const handleDownloadTicket = () => {
    if (!qrCodeUrl || !bookingData) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, canvas.width, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EVENT TICKET', canvas.width / 2, 70);

    // Event Details
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(bookingData.eventTitle, 50, 180);

    ctx.font = '18px Arial';
    ctx.fillText(`Date: ${new Date(bookingData.eventDate).toLocaleString()}`, 50, 220);
    ctx.fillText(`Location: ${bookingData.eventLocation}`, 50, 250);

    // Customer Details
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Booking Details', 50, 310);
    
    ctx.font = '18px Arial';
    ctx.fillText(`Name: ${bookingData.customerName}`, 50, 345);
    ctx.fillText(`Email: ${bookingData.email}`, 50, 375);
    ctx.fillText(`Mobile: ${bookingData.mobile}`, 50, 405);
    ctx.fillText(`Seats: ${bookingData.seats}`, 50, 435);
    ctx.fillText(`Total: $${bookingData.totalAmount.toFixed(2)}`, 50, 465);
    ctx.fillText(`Booked: ${new Date(bookingData.bookingTime).toLocaleString()}`, 50, 495);

    // QR Code
    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, (canvas.width - 256) / 2, 550, 256, 256);

      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scan QR code for verification', canvas.width / 2, 850);

      // Download
      const link = document.createElement('a');
      link.download = `ticket-${bookingData.bookingId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    qrImage.src = qrCodeUrl;
  };

  const handleClose = () => {
    onOpenChange(false);
    if (bookingStatus === "success") {
      onSuccess();
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {bookingStatus === "success" ? "Booking Confirmed!" : `Book Tickets - ${event.title}`}
          </DialogTitle>
        </DialogHeader>

        {bookingStatus === "success" && bookingData && qrCodeUrl && (
          <div className="space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-center font-medium">
                Your booking is confirmed! 🎉
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="text-center">
                <img src={qrCodeUrl} alt="Booking QR Code" className="mx-auto mb-4 rounded-lg" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="border-t pt-4">
                  <h3 className="font-bold text-lg mb-3">{bookingData.eventTitle}</h3>
                  <p><span className="font-semibold">Date:</span> {new Date(bookingData.eventDate).toLocaleString()}</p>
                  <p><span className="font-semibold">Location:</span> {bookingData.eventLocation}</p>
                </div>

                <div className="border-t pt-3">
                  <p><span className="font-semibold">Name:</span> {bookingData.customerName}</p>
                  <p><span className="font-semibold">Email:</span> {bookingData.email}</p>
                  <p><span className="font-semibold">Mobile:</span> {bookingData.mobile}</p>
                  <p><span className="font-semibold">Seats:</span> {bookingData.seats}</p>
                  <p><span className="font-semibold">Total Amount:</span> ${bookingData.totalAmount.toFixed(2)}</p>
                  <p><span className="font-semibold">Booking Time:</span> {new Date(bookingData.bookingTime).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDownloadTicket}
                className="flex-1"
                variant="default"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {bookingStatus === "error" && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-center">
              {errorMessage}
            </p>
          </div>
        )}

        {bookingStatus !== "success" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              disabled={createBooking.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              disabled={createBooking.isPending}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              {...register("mobile")}
              placeholder="+1234567890"
              disabled={createBooking.isPending}
            />
            {errors.mobile && (
              <p className="text-sm text-destructive mt-1">{errors.mobile.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Number of Tickets</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={event.availableSeats}
              {...register("quantity", { valueAsNumber: true })}
              disabled={createBooking.isPending}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Available: {event.availableSeats} seats
            </p>
            {errors.quantity && (
              <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input
              id="totalAmount"
              value={`$${totalAmount.toFixed(2)}`}
              disabled
              className="font-bold"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createBooking.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={createBooking.isPending || event.availableSeats === 0}
              className="flex-1"
            >
              {createBooking.isPending ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};