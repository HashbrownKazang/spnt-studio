import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [],
  afterAuth(auth, req) {
    if (req.nextUrl.pathname === "/record") {
      if (!auth.userId) {
        //  If user tries to access record page without authentication
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }

      if (auth.sessionClaims?.role !== 'admin' && auth.sessionClaims?.role !== 'editor') {
        return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 403 });
      }
    }
  },
});

export const config = {
  matcher: [
    '/((?!_next/image|_next/static|favicon.ico).*)',
    "/record",
    "/api(.*)",
  ],
};