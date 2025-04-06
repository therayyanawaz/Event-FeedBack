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
  // Only use Edge runtime for static assets and non-API routes
  matcher: ['/((?!api|.*\\.(?:js|json|jsx|ts|tsx)).*)', '/'],
}; 