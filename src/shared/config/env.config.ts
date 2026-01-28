function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export const ENV_CONFIG = {
  AUTH: {
    ACCESS_TOKEN_EXPIRES: requireEnv("ACCESS_TOKEN_EXPIRES", "10s"),
    REFRESH_TOKEN_EXPIRES: requireEnv("REFRESH_TOKEN_EXPIRES", "7d"),
  },
  DATABASE_URL: requireEnv("DATABASE_URL"),
  SESSION_SECRET: requireEnv("SESSION_SECRET"),
};