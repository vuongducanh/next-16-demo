// app/api/auth/logout/route.ts
import { ApiResponse } from "@/types/responses";
import { AuthServerService } from "@/services/server/auth.service";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/error-handler";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      await AuthServerService.logout(refreshToken);
    }

    cookieStore.delete("refresh_token");

    return ApiResponse.successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
