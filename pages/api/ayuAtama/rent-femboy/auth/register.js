import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    email,
    password,
    role,
    nickname,
    displayName,
    bio,
    baseRate,
    legal,
    imageUrl,
  } = req.body;

  // ----------------------------------
  // Basic validation
  // ----------------------------------
  if (!email || !password || !role || !legal) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!legal.terms || !legal.privacy || !legal.disclaimer) {
    return res.status(400).json({
      error: "You must accept all legal agreements",
    });
  }

  if (!["RENTER", "FEMBOY"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (role === "RENTER" && !nickname) {
    return res.status(400).json({ error: "Nickname is required" });
  }

  if (role === "FEMBOY") {
    if (!displayName || !bio || !baseRate) {
      return res.status(400).json({
        error: "Display name, bio, and base rate are required",
      });
    }
  }

  try {
    // ----------------------------------
    // Prevent duplicate accounts
    // ----------------------------------
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // ----------------------------------
    // Password hashing
    // ----------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------------------------------
    // Transaction (CRITICAL)
    // ----------------------------------
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      let renterProfile = null;
      let femboyProfile = null;

      if (role === "RENTER") {
        renterProfile = await tx.renterProfile.create({
          data: {
            userId: user.id,
            nickname,
          },
        });

        if (imageUrl) {
          await tx.renterProfileImage.create({
            data: {
              profileId: renterProfile.id,
              url: imageUrl,
              isPrimary: true,
            },
          });
        }
      }

      if (role === "FEMBOY") {
        femboyProfile = await tx.femboyProfile.create({
          data: {
            userId: user.id,
            displayName,
            bio,
            baseRate: Number(baseRate),
          },
        });

        if (imageUrl) {
          await tx.femboyProfileImage.create({
            data: {
              profileId: femboyProfile.id,
              url: imageUrl,
              isPrimary: true,
            },
          });
        }
      }

      await tx.legalAcceptance.create({
        data: {
          userId: user.id,
          acceptedTerms: legal.terms,
          acceptedPrivacy: legal.privacy,
          acceptedDisclaimer: legal.disclaimer,
        },
      });

      return user;
    });

    // ----------------------------------
    // Response (NO sensitive data)
    // ----------------------------------
    return res.status(201).json({
      userId: result.id,
      role: result.role,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
