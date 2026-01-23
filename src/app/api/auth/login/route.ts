import { AUTH_EXPIRES } from "@/config/auth.config";
import { ApiResponse } from "@/types/responses";
import { AuthServerService } from "@/services/server/auth.service";
import { cookies } from "next/headers";
import { getExpiresAt } from "@/lib/expire.util";
import { handleApiError } from "@/lib/error-handler";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const result = await AuthServerService.login({ email, password });

    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    const expiresAt = getExpiresAt(AUTH_EXPIRES.REFRESH_TOKEN);

    cookieStore.set("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      expires: expiresAt, // 7 days
      path: "/",
    });

    return ApiResponse.successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
