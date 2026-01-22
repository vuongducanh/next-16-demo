// app/api/auth/refresh/route.ts
import { signAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/responses";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return ApiResponse.unauthorized();
  }

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (
    !tokenRecord ||
    tokenRecord.revoked ||
    tokenRecord.expiresAt < new Date()
  ) {
    cookieStore.delete("refresh_token");
    return ApiResponse.unauthorized('Invalid refresh token');

  }

  const accessToken = await signAccessToken({
    userId: tokenRecord.user.id,
  });

  return ApiResponse.successResponse({ access_token: accessToken });
}
