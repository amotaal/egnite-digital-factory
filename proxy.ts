import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/constants";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public paths through unconditionally.
  // Do NOT redirect cookie-holders away from /login here — the factory layout
  // is the authoritative session validator. Redirecting based on cookie existence
  // alone causes an infinite loop when the session is expired or the sessions
  // file was cleared (cookie exists → proxy sends to /dashboard → layout finds
  // expired session → sends back to /login → repeat forever).
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Static assets pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/samples") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/templates") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check session cookie — proxy only checks existence (full validation happens server-side)
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
