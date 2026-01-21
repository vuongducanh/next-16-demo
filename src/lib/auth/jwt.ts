import { AUTH_EXPIRES } from "@/config/auth.config";
import { SignJWT, jwtVerify } from "jose";
import "server-only";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function signAccessToken(payload: {
  userId: number;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(AUTH_EXPIRES.ACCESS_TOKEN)
    .sign(encodedKey);
}

export async function signRefreshToken(payload: {
  userId: number;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(AUTH_EXPIRES.REFRESH_TOKEN)
    .sign(encodedKey);
}

export async function decryptToken(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return null
  }
}
