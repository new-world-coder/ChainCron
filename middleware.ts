import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/signin?error=AccessDenied', req.url))
      }
    }

    // Creator routes protection
    if (pathname.startsWith('/creator')) {
      if (!token || (token.role !== 'creator' && token.role !== 'admin')) {
        return NextResponse.redirect(new URL('/auth/signin?error=AccessDenied', req.url))
      }
    }

    // Dashboard routes protection (requires authentication)
    // Allow wallet-based auth (check client-side)
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        // Don't redirect - let the client check for wallet connection
        // The dashboard page will handle auth state client-side
        return NextResponse.next()
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        if (pathname === '/' || 
            pathname.startsWith('/marketplace') || 
            pathname.startsWith('/auth') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/_next') ||
            pathname.startsWith('/favicon')) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/creator/:path*', 
    '/dashboard/:path*',
    '/builder/:path*',
    '/compose/:path*',
  ]
}
