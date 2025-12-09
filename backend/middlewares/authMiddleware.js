import { jwtVerify, createRemoteJWKSet } from "jose";
import { fromNodeHeaders } from "better-auth/node";
import auth from "../auth/auth.js";

const JWKS = createRemoteJWKSet(
  new URL("http://localhost:3000/api/auth/jwks")
);

export async function authMiddleware(req, res, next) {
  // First try Better Auth session (for browser requests with cookies)
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user?.id) {
      req.user = { id: session.user.id };
      return next();
    }
  } catch (err) {
    // Session check failed, try Bearer token
  }

  // Fall back to JWT Bearer token (for CLI requests)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized - No valid session or token" });

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "http://localhost:3000",
      audience: "http://localhost:3000",
    });

    // Better Auth puts user ID in the subject (sub)
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}
