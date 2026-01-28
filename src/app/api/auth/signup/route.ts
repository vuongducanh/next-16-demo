import { ApiResponse } from "@/server/types/responses";
import { AuthServerService } from "@/server/services/auth.service";
import { cookies } from "next/headers";
import { getExpiresAt } from "@/shared/lib/expire.util";
import { handleApiError } from "@/server/lib/error-handler";
import { ENV_CONFIG } from "@/shared/config/env.config";
import { SignupFormSchema } from "@/shared/types/auth.schema";
import { zodErrorsToFieldErrors } from "@/shared/lib/zod-error.util";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignupFormSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.validationError(zodErrorsToFieldErrors(parsed.error));
    }

    const { email, password, fullName } = parsed.data;

    const result = await AuthServerService.signup({
      email,
      password,
      fullName,
    });
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    const expiresAt = getExpiresAt(ENV_CONFIG.AUTH.REFRESH_TOKEN_EXPIRES);

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
