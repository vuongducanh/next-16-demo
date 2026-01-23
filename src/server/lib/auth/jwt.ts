import { AUTH_EXPIRES } from "@/client/config/auth.config";
import { SignJWT, jwtVerify } from "jose";
import "server-only";
import prisma from "@/server/lib/prisma";
import { ApiResponse } from "@/shared/types/responses";

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

export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiResponse.unauthorized();
  }

  const accessToken = authHeader.replace("Bearer ", "");

  const payload = await decryptToken(accessToken);

  if (!payload) {
    throw ApiResponse.unauthorized("Invalid or expired token");
  }

  const userId = payload.userId as number;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw ApiResponse.notFound("User not found");
  }

  return user;
}
