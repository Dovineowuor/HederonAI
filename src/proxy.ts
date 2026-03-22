import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default async function proxy(request: NextRequest) {
  // Use the Edge-compatible auth check
  const session = await auth();

  // Protect sensitive routes
  const protectedRoutes = ["/marketplace/hire", "/marketplace/jobs", "/settings", "/marketplace/my-jobs", "/creator", "/api/creator", "/admin", "/api/admin"];
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection for /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.redirect(new URL("/creator/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/marketplace/hire/:path*", 
    "/marketplace/jobs/:path*",
    "/settings/:path*",
    "/marketplace/my-jobs/:path*",
    "/creator/:path*",
    "/api/creator/:path*",
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};
