import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET || "fallback-secret-for-development-only";

if (
  !process.env.NEXT_PUBLIC_JWT_SECRET &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("JWT_SECRET environment variable is required in production");
}

export function signToken(payload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    console.log("Structure", jwt.verify(token, JWT_SECRET));

    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }
}
