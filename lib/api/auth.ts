import { NextRequest, NextResponse } from 'next/server'

// API key for automation endpoints (in production, use environment variable)
const API_KEY = process.env.AUTOMATION_API_KEY || 'dev-api-key-123'

/**
 * Validate API key from request headers
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  return apiKey === API_KEY
}

/**
 * Authentication middleware for automation endpoints
 */
export function requireAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Allow GET requests without auth (read-only endpoints)
    if (request.method === 'GET') {
      return handler(request)
    }

    // Require auth for write operations
    if (!validateApiKey(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Invalid or missing API key'
        },
        { status: 401 }
      )
    }

    return handler(request)
  }
}
