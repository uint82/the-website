import { verifyJwt } from "@lib/jwt";

export function requireAuth(handler) {
  return async function (req, res) {
    const cookie = req.headers.cookie || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = verifyJwt(token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // attach auth info to request
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return handler(req, res);
  };
}
