import { prisma } from "@/lib/prisma";

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { listingId, date, startTime, duration } = req.query;

  if (!listingId || !date || !startTime || !duration) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getUTCDay();

    const availability = await prisma.availability.findMany({
      where: {
        listingId,
        dayOfWeek,
      },
    });

    if (availability.length === 0) {
      return res.json({ available: false, reason: "Not available that day" });
    }

    const start = timeToMinutes(startTime);
    const end = start + Number(duration) * 60;

    const fitsSlot = availability.some((slot) => {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      return start >= slotStart && end <= slotEnd;
    });

    if (!fitsSlot) {
      return res.json({ available: false, reason: "Outside available hours" });
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        femboyId: (
          await prisma.listing.findUnique({
            where: { id: listingId },
          })
        )?.femboyId,
        date: bookingDate,
        status: {
          in: ["PENDING", "ACCEPTED"],
        },
      },
    });

    if (conflict) {
      return res.json({ available: false, reason: "Time slot already booked" });
    }

    return res.json({ available: true });
  } catch (err) {
    console.error("AVAILABILITY_CHECK_ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
