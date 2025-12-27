import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@lib/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ----------------------------------
    // Create JWT (7 days)
    // ----------------------------------
    const token = signJwt({
      sub: user.id,
      role: user.role,
    });

    // ----------------------------------
    // Store JWT in HttpOnly cookie
    // ----------------------------------
    res.setHeader("Set-Cookie", [
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Lax`,
    ]);

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
