import { AUTH_EXPIRES } from "@/config/auth.config";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import { getExpiresAt } from "@/utils/expire.util";
import { ApiResponse } from "@/utils/response.util";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return ApiResponse.notFound("User not found");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return ApiResponse.unauthorized();
  }

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

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
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
