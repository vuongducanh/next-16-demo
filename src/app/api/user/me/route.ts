import { decryptToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/utils/response.util";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized();
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const payload = await decryptToken(accessToken);

    if (!payload) {
      return ApiResponse.unauthorized("Invalid or expired token");
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
      return ApiResponse.notFound("User not found");
    }

    return ApiResponse.successResponse(user);
  } catch (err) {
    return ApiResponse.unauthorized("Invalid or expired token");
  }
}
