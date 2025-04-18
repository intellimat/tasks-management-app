export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
      Match all routes except:
      - static files (_next, etc)
      - public routes: '/', '/login', '/signup'
    */
    "/((?!_next/static|_next/image|favicon.ico|login|signup|api/signup|$).*)",
  ],
};
