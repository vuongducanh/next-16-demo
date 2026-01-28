import { getAuthenticatedUser } from "@/server/lib/auth/jwt";
import { ApiResponse } from "@/server/types/responses";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    return ApiResponse.successResponse(user);
  } catch (err) {
    // err is already ApiResponse
    return err as Response;
  }
}
