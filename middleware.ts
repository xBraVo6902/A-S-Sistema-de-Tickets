import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const url = req.nextUrl.clone();
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", url.pathname);

    if (!req.nextauth.token) {
      return NextResponse.redirect(loginUrl);
    }

    if (req.nextUrl.pathname === "/") {
      switch (req.nextauth.token.role) {
        case "Admin":
          return NextResponse.redirect(new URL("/admin", req.url));
        case "User":
          return NextResponse.redirect(new URL("/user", req.url));
        case "Client":
          return NextResponse.redirect(new URL("/client", req.url));
        default:
          return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/user") &&
      req.nextauth.token?.role !== "User"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/client") &&
      req.nextauth.token?.role !== "Client"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (!req.nextauth.token) {
      return NextResponse.redirect(loginUrl);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/admin(.*)", "/user(.*)", "/client(.*)"],
};
