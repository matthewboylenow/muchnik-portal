import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes
  if (pathname === "/login" || pathname === "/") {
    if (session) {
      const redirectPath =
        session.user.role === "admin"
          ? "/admin/dashboard"
          : "/portal/overview";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require auth
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin routes — require admin role
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/portal/overview", req.url));
  }

  // Portal routes — allow both admin and client
  if (pathname.startsWith("/portal")) {
    return NextResponse.next();
  }

  // API cron routes — require CRON_SECRET, not user auth
  if (pathname.startsWith("/api/cron")) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|images).*)",
  ],
};
