import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname, searchParams } = request.nextUrl; 
  
  const isStandaloneMode = searchParams.get('mode') === 'standalone';

  // console.log(`--- Middleware Checking: ${pathname} | Token: ${token ? 'Found' : 'Missing'} ---`);

  const protectedPaths = ['/dashboard', '/emissions-calculator', '/ai-insights', '/reports-log', '/settings', '/company-profile'];
  
  
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path)) && 
                          !(pathname.startsWith('/emissions-calculator') && isStandaloneMode);

  if (isProtectedRoute && !token) {
    // console.log("-> Unauthorized! Redirecting to /login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((pathname === '/login' || pathname === '/register') && token) {
    // console.log("-> Already Logged In! Redirecting to /dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/emissions-calculator/:path*', 
    '/ai-insights/:path*', 
    '/reports-log/:path*',
    '/settings/:path*',
    '/company-profile/:path*',
    '/login', 
    '/register'
  ],
};