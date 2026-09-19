import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        if (
            token && (
                pathname.startsWith("/sign-in") ||
                pathname.startsWith("/sign-up") ||
                pathname === "/" ||
                pathname.startsWith("/verify")
            )
        ) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (!token && pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => Boolean(token),
        },
    }
);

export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/dashboard/:path*",
        "/verify/:path*",
    ],
};