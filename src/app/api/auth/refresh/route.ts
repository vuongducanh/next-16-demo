// app/api/auth/refresh/route.ts
import { ApiResponse } from "@/shared/types/responses";
import { AuthServerService } from "@/server/services/auth.service";
import { cookies } from "next/headers";
import { handleApiError } from "@/shared/lib/error-handler";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) {
      return ApiResponse.unauthorized();
    }

    const result = await AuthServerService.refresh(refreshToken);

    return ApiResponse.successResponse(result);
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete("refresh_token");
    return handleApiError(error);
  }
}
