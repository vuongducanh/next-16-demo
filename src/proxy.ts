// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { decryptToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/"];
const publicRoutes = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("refresh_token")?.value;

  if (!cookie) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next(); // public + chưa login
  }

  const refreshTokenDecrypt = await decryptToken(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !refreshTokenDecrypt?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    refreshTokenDecrypt?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|\\.well-known|_next/image|.*\\.png$).*)",
  ],
};
