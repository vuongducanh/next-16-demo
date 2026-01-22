import { AUTH_EXPIRES } from "@/config/auth.config";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import { getExpiresAt } from "@/utils/expire.util";
import { ApiResponse } from "@/utils/response.util";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password, fullName } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  });

  const accessToken = await signAccessToken({
    userId: user.id,
  });

  const refreshToken = await signRefreshToken({
    userId: user.id,
  });

  const expiresAt = getExpiresAt(AUTH_EXPIRES.REFRESH_TOKEN);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return ApiResponse.successResponse({
    access_token: accessToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}
