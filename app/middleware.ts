import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// Middleware function
export function middleware(request: NextRequest) {
  // Your middleware code
  
  return NextResponse.next();
} 