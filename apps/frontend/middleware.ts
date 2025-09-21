import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  /* if (pathname.startsWith("/editor")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } */

  if (pathname.startsWith("/editor")) {
    if (!sessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/editor";
    return NextResponse.redirect(homeUrl);
  }

  /* if (
    (sessionCookie && pathname.includes("/login")) ||
    pathname.includes("/signup")
  ) {
    return NextResponse.redirect(new URL("/editor", request.url));
  } */

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor", "/login", "/signup"], // routes middleware applies to
};
