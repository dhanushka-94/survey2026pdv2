'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AdminSession } from '@/lib/types';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PATH = process.env.ADMIN_SECRET_PATH || 'admin-x9QpK7';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function loginAdmin(password: string) {
  try {
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: 'Invalid password' };
    }

    // Create session
    const session: AdminSession = {
      authenticated: true,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect(`/${ADMIN_PATH}`);
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession) {
      return false;
    }

    const session: AdminSession = JSON.parse(adminSession.value);
    const now = Date.now();

    if (session.expiresAt < now) {
      // Session expired
      cookieStore.delete('admin_session');
      return false;
    }

    return session.authenticated;
  } catch (error) {
    console.error('Session check error:', error);
    return false;
  }
}

export async function getAdminPath(): Promise<string> {
  return ADMIN_PATH;
}
