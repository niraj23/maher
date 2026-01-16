import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authenticated = request.cookies.get('authenticated')?.value === 'true';
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  
  // Allow API routes and login page
  if (isApiRoute || isAuthPage) {
    return NextResponse.next();
  }
  
  // Redirect to login if not authenticated
  if (!authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
