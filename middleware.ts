import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from './app/utils/auth';

// Define paths that require authentication
const protectedPaths = [
  '/pages/analytics',
  '/api/events',
  '/api/feedback',
];

// Define paths that require admin role
const adminPaths = [
  '/api/users',
];

// Define paths that are public
const publicPaths = [
  '/',
  '/pages/auth',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/chat',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // If no token and trying to access protected route
  if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
    // Redirect to login page
    const url = new URL('/pages/auth', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }
  
  // If has token, verify it
  if (token) {
    const decodedToken = verifyToken(token);
    
    // If token is invalid, redirect to login
    if (!decodedToken) {
      const url = new URL('/pages/auth', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
    
    // Check admin paths
    if (adminPaths.some(path => pathname.startsWith(path)) && decodedToken.role !== 'admin') {
      // Return forbidden for unauthorized access to admin routes
      return new NextResponse(
        JSON.stringify({ error: 'Insufficient permissions' }), 
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: [
    // Pages that require protection
    '/pages/analytics/:path*',
    
    // API routes
    '/api/:path*',
    
    // Bypass static files, favicon.ico etc
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 