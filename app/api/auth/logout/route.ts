export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '../../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    clearAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 