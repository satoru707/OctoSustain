import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/pods", "/dashboard", "/challenges", "/reports"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes
  const authRoutes = ["/auth/signin", "/auth/signup"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (isAuthRoute && token) {
    try {
      verifyToken(token);
      return NextResponse.redirect(new URL("/pods", request.url));
    } catch {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pods/:path*",
    "/dashboard/:path*",
    "/challenges/:path*",
    "/reports/:path*",
    "/auth/:path*",
  ],
};
