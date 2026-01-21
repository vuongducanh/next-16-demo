// app/api/auth/logout/route.ts
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/utils/response.util";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  cookieStore.delete("refresh_token");

  return ApiResponse.successResponse({ success: true });
}
