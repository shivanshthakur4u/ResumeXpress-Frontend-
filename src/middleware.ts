import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes
const protectedRoutes = ["/dashboard", "/dashboard/*"];
const invalidUserRoutes = ["/auth", "/auth/*"];

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // user cookies
  const user = request.cookies.get("user");
  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {

    // If user is not authenticated, redirect to login page
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } else if (
    user &&
    invalidUserRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed if it's not a protected route or the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
