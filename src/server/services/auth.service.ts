// services/server/auth.service.ts
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "@/server/lib/auth/jwt";
import prisma from "@/server/lib/prisma";
import { getExpiresAt } from "@/shared/lib/expire.util";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "@/shared/lib/errors";

export interface SignupPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export class AuthServerService {
  static async signup(payload: SignupPayload) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        fullName: payload.fullName,
      },
    });

    const accessToken = await signAccessToken({ userId: user.id });
    const refreshToken = await signRefreshToken({ userId: user.id });

    const expiresAt = getExpiresAt(process.env.REFRESH_TOKEN_EXPIRES || "7d");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  static async login(payload: LoginPayload) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid) {
      throw new BadRequestError("Invalid password");
    }

    const accessToken = await signAccessToken({ userId: user.id });
    const refreshToken = await signRefreshToken({ userId: user.id });

    const expiresAt = getExpiresAt(process.env.REFRESH_TOKEN_EXPIRES || "7d");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  static async refresh(refreshToken: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (
      !tokenRecord ||
      tokenRecord.revoked ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const accessToken = await signAccessToken({ userId: tokenRecord.userId });

    return {
      access_token: accessToken,
    };
  }

  static async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }
}
