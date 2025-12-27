import { prisma } from "@lib/prisma";
import { requireAuth } from "@/middleware/auth";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // req.user is now available
  if (req.user.role !== "RENTER") {
    return res.status(403).json({ error: "Only renters can book" });
  }

  const { listingId, date, duration, location } = req.body;

  if (!listingId || !date || !duration || !location) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { femboy: true },
  });

  if (!listing || !listing.isActive) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const totalPrice = listing.femboy.baseRate * Number(duration);

  const booking = await prisma.booking.create({
    data: {
      renterId: req.user.id,
      femboyId: listing.femboy.userId,
      date: new Date(date),
      duration,
      location,
      totalPrice,
      status: "PENDING",
    },
  });

  return res.status(201).json({
    bookingId: booking.id,
    totalPrice,
  });
}

export default requireAuth(handler);
