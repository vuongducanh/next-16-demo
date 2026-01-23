import { AUTH_EXPIRES } from "@/client/config/auth.config";
import { ApiResponse } from "@/shared/types/responses";
import { AuthServerService } from "@/server/services/auth.service";
import { cookies } from "next/headers";
import { getExpiresAt } from "@/shared/lib/expire.util";
import { handleApiError } from "@/shared/lib/error-handler";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    const result = await AuthServerService.signup({ email, password, fullName });
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    const expiresAt = getExpiresAt(AUTH_EXPIRES.REFRESH_TOKEN);

    cookieStore.set("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return ApiResponse.successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

