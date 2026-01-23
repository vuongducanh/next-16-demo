// src/jobs/cleanupRefreshTokens.ts
import prisma from "@/server/lib/prisma";

export async function cleanupRefreshTokens() {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { revoked: true },
      ],
    },
  });

  console.log(
    `[CRON] Deleted ${result.count} refresh tokens`
  );
}
