function requireEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export const AUTH_EXPIRES = {
  ACCESS_TOKEN: requireEnv("ACCESS_TOKEN_EXPIRES", "10s"),
  REFRESH_TOKEN: requireEnv("REFRESH_TOKEN_EXPIRES", "7d"),
};
