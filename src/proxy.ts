import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get admin path from env
  const adminPath = process.env.ADMIN_SECRET_PATH || 'admin-x9QpK7';
  
  // Check if this is an admin route
  if (pathname.startsWith(`/${adminPath}`)) {
    // Skip login page
    if (pathname === `/${adminPath}`) {
      return NextResponse.next();
    }
    
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL(`/${adminPath}`, request.url));
    }
    
    // Verify session is still valid
    try {
      const sessionData = JSON.parse(adminSession.value);
      const now = Date.now();
      
      if (sessionData.expiresAt < now) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL(`/${adminPath}`, request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    } catch (error) {
      // Invalid session data, redirect to login
      const response = NextResponse.redirect(new URL(`/${adminPath}`, request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
