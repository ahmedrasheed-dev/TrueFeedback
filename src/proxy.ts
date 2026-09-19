import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        if (token && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (token?.isVerified && pathname.startsWith("/verify")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (!token && pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname;

                if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
                    return true;
                }

                if (pathname.startsWith("/verify")) {
                    return true;
                }

                return Boolean(token);
            },
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/settings/:path*",
        "/verify/:path*",
        "/sign-in",
        "/sign-up"
    ],
};