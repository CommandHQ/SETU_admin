// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

// Public routes that don't require authentication
const publicRoutes = ["/", "/auth/login"];

export async function middleware(request: NextRequestWithAuth) {
  const path = request.nextUrl.pathname;
  
  // Check if the current path is a public route
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ req: request });

  // For non-public routes, check authentication
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Check for admin role
  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};