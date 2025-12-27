import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid profile id" });
  }

  try {
    const profile = await prisma.femboyProfile.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            isPrimary: "desc",
          },
        },
        listing: {
          include: {
            availability: {
              orderBy: {
                dayOfWeek: "asc",
              },
            },
          },
        },
      },
    });

    if (!profile || !profile.listing || !profile.listing.isActive) {
      return res.status(404).json({ error: "Profile not found" });
    }

    /**
     * Normalize response for frontend
     */
    const response = {
      profileId: profile.id,
      name: profile.displayName,
      bio: profile.bio,
      baseRate: profile.baseRate,
      images: profile.images.map((img) => ({
        url: img.url,
        isPrimary: img.isPrimary,
      })),
      availability: profile.listing.availability.map((a) => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("PROFILE_DETAIL_ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
