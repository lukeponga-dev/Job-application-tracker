import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // RLS handles auth at the database level, so middleware is simpler.
  // We just need to ensure that client-side routing works as expected.
  
  const { pathname } = request.nextUrl;

  // For API routes, we don't need to do anything.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If the user is trying to access the login page, let them.
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // For all other pages, we let the page itself handle redirection if the user is not authenticated.
  // This is because the authentication state is now managed on the client with the JWT.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
