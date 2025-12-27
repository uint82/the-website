import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        femboy: {
          select: {
            id: true,
            displayName: true,
            bio: true,
            baseRate: true,
            images: {
              where: {
                isPrimary: true,
              },
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    /**
     * Normalize response shape for frontend
     */
    const response = listings.map((listing) => ({
      listingId: listing.id,
      profileId: listing.femboy.id,
      name: listing.femboy.displayName,
      bio: listing.femboy.bio,
      rate: listing.femboy.baseRate,
      image: listing.femboy.images[0]?.url || null,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error("DISCOVER_ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
