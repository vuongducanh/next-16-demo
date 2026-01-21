// app/api/cron/cleanup/route.ts
import { cleanupRefreshTokens } from "@/jobs/cleanupRefreshTokens";
import { ApiResponse } from "@/utils/response.util";

export async function GET(req: Request) {
  // TODO: Enable this check in production
  // const auth = req.headers.get("authorization");

  // if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return ApiResponse.unauthorized();
  // }

  await cleanupRefreshTokens();
  return ApiResponse.successResponse({ ok: true });
}
