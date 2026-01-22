// src/utils/expire.util.ts

export function parseExpireToMs(exp: string): number {
  const match = exp.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid expire format: ${exp}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Unsupported time unit");
  }
}

export function getExpiresAt(exp: string): Date {
  return new Date(Date.now() + parseExpireToMs(exp));
}
