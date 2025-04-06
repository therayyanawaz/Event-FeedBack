// This middleware file is used to specify which routes should or should not use Edge runtime

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // You can add any middleware logic here
  return NextResponse.next();
}

// Configure which paths should NOT use the Edge Runtime
export const config = {
  // Avoid using Edge runtime for API routes that use Mongoose
  matcher: '/((?!api/.*|_next/static|_next/image|favicon.ico).*)',
}; 