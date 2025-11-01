export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/developer/:path*",
    "/wallet/:path*",
    "/chat/:path*",
    "/create-wallet/:path*",
  ],
};
