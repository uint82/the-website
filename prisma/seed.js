// prisma/seed.js
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌸 Seeding MVP database (SQLite-safe, with images)...");

  // --------------------------------------------------
  // Clean tables (order matters because of relations)
  // --------------------------------------------------
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.listing.deleteMany();

  await prisma.femboyProfileImage.deleteMany();
  await prisma.renterProfileImage.deleteMany();

  await prisma.femboyProfile.deleteMany();
  await prisma.renterProfile.deleteMany();

  await prisma.legalAcceptance.deleteMany();
  await prisma.user.deleteMany();

  // --------------------------------------------------
  // Users
  // --------------------------------------------------
  const femboyUser = await prisma.user.create({
    data: {
      email: "luna@test.com",
      password: "hashed-password",
      role: "FEMBOY",
    },
  });

  const renterUser = await prisma.user.create({
    data: {
      email: "alex@test.com",
      password: "hashed-password",
      role: "RENTER",
    },
  });

  // --------------------------------------------------
  // Profiles
  // --------------------------------------------------
  const femboyProfile = await prisma.femboyProfile.create({
    data: {
      userId: femboyUser.id,
      displayName: "Luna",
      bio: "Cute, friendly companion for chill vibes 💖",
      baseRate: 30000,
    },
  });

  const renterProfile = await prisma.renterProfile.create({
    data: {
      userId: renterUser.id,
      nickname: "Alex",
    },
  });

  // --------------------------------------------------
  // Profile Images (SEPARATE TABLES – SQLite safe)
  // --------------------------------------------------

  // Femboy images
  await prisma.femboyProfileImage.createMany({
    data: [
      {
        profileId: femboyProfile.id,
        url: "https://placehold.co/600x800/fda4c7/white?text=Luna+Primary",
        isPrimary: true,
      },
      {
        profileId: femboyProfile.id,
        url: "https://placehold.co/600x800/fecddf/white?text=Luna+2",
      },
    ],
  });

  // Renter images
  await prisma.renterProfileImage.createMany({
    data: [
      {
        profileId: renterProfile.id,
        url: "https://placehold.co/600x800/ffd1dc/white?text=Alex+Primary",
        isPrimary: true,
      },
    ],
  });

  // --------------------------------------------------
  // Listing
  // --------------------------------------------------
  const listing = await prisma.listing.create({
    data: {
      femboyId: femboyProfile.id,
      isActive: true,
    },
  });

  // --------------------------------------------------
  // Availability
  // --------------------------------------------------
  await prisma.availability.createMany({
    data: [
      {
        listingId: listing.id,
        dayOfWeek: 5, // Friday
        startTime: "18:00",
        endTime: "22:00",
      },
      {
        listingId: listing.id,
        dayOfWeek: 6, // Saturday
        startTime: "14:00",
        endTime: "20:00",
      },
    ],
  });

  // --------------------------------------------------
  // Legal Acceptance (required)
  // --------------------------------------------------
  await prisma.legalAcceptance.createMany({
    data: [
      {
        userId: femboyUser.id,
        acceptedTerms: true,
        acceptedPrivacy: true,
        acceptedDisclaimer: true,
      },
      {
        userId: renterUser.id,
        acceptedTerms: true,
        acceptedPrivacy: true,
        acceptedDisclaimer: true,
      },
    ],
  });

  // --------------------------------------------------
  // Sample Booking
  // --------------------------------------------------
  await prisma.booking.create({
    data: {
      renterId: renterUser.id,
      femboyId: femboyUser.id,
      date: new Date("2025-01-10T18:00:00Z"),
      duration: 2,
      location: "Online",
      totalPrice: 60000,
      status: "PENDING",
    },
  });

  console.log("✅ Seed completed successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
