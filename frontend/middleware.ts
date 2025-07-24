import { PROTECTED_ROUTES, PUBLIC_AUTH_ROUTES, ROUTES } from '@/lib/routes.config';
import { NextRequest, NextResponse } from 'next/server';

// This middleware can be used to handle authentication, logging, or other request processing
export function middleware(request: NextRequest) {
  const token = request.cookies.get('AuthToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!token;
  const isAuthPage = PUBLIC_AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && isProtectedRoute && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // Redirect authenticated users to home if they try to access auth pages
  if (isAuthenticated && isAuthPage && pathname !== ROUTES.HOME) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

const config = {
  matcher: [
    ...PROTECTED_ROUTES.map(route => `${route}/:path*`),
    ...PUBLIC_AUTH_ROUTES,
  ],
};

export default config;