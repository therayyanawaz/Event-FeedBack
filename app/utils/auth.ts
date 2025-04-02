import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User, { IUser } from '../models/user.schema';
import connectToDatabase from './database';

// Ensure these environment variables are properly set in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * User payload for JWT token
 */
type UserPayload = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

/**
 * Generate a JWT token for a user
 * @param payload User data to include in the token
 * @returns Signed JWT token
 */
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY as string });
}

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Set the JWT token in an HTTP-only cookie
 * @param token JWT token
 * @param response NextResponse object
 */
export function setAuthCookie(token: string): void {
  cookies().set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'strict',
  });
}

/**
 * Get the JWT token from the cookie
 * @param request NextRequest object
 * @returns JWT token or null if not found
 */
export function getAuthToken(request: NextRequest): string | null {
  const token = request.cookies.get('auth_token')?.value;
  return token || null;
}

/**
 * Clear the auth cookie
 */
export function clearAuthCookie(): void {
  cookies().delete('auth_token');
}

/**
 * Middleware to check if the user is authenticated
 * @param request NextRequest object
 * @returns NextResponse or null if authenticated
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: any } | NextResponse> {
  const token = getAuthToken(request);

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    clearAuthCookie();
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return { user: decoded };
}

/**
 * Middleware to check if the user has the required role
 * @param user User object
 * @param roles Required roles
 * @returns NextResponse or null if authorized
 */
export function requireRole(
  user: any,
  roles: string[]
): NextResponse | null {
  if (!roles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Check if a user exists with the given email
 * @param email Email to check
 * @returns Boolean indicating if user exists
 */
export async function userExists(email: string): Promise<boolean> {
  await connectToDatabase();
  const user = await User.findOne({ email });
  return !!user;
}

/**
 * Create a new user
 * @param userData User data
 * @returns Created user
 */
export async function createUser(userData: {
  email: string;
  name: string;
  password: string;
  role?: string;
}): Promise<IUser> {
  await connectToDatabase();
  
  const user = new User({
    email: userData.email,
    name: userData.name,
    role: userData.role || 'user',
  });

  user.setPassword(userData.password);
  
  await user.save();
  return user;
}

/**
 * Validate user credentials
 * @param email User email
 * @param password User password
 * @returns User object if valid, null otherwise
 */
export async function validateCredentials(
  email: string,
  password: string
): Promise<IUser | null> {
  await connectToDatabase();
  
  const user = await User.findOne({ email });
  
  if (!user) {
    return null;
  }

  const isValid = user.validatePassword(password);
  
  if (!isValid) {
    return null;
  }

  return user;
}

export default {
  generateToken,
  verifyToken,
  setAuthCookie,
  getAuthToken,
  clearAuthCookie,
  requireAuth,
  requireRole,
  userExists,
  createUser,
  validateCredentials,
};