import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitStore>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Also consider API key if available
  const apiKey = request.headers.get('x-api-key')
  
  return apiKey || ip
}

/**
 * Apply rate limiting to requests
 * 
 * @param maxRequests Maximum number of requests allowed in the time window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return (request: NextRequest): { allowed: boolean; limit: number; remaining: number; reset: number } | null => {
    const clientId = getClientId(request)
    const now = Date.now()
    
    const current = rateLimitStore.get(clientId)
    
    if (!current || current.resetTime < now) {
      // First request or window expired, create new entry
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      })
      
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: now + windowMs
      }
    }
    
    // Increment count
    current.count++
    
    if (current.count > maxRequests) {
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        reset: current.resetTime
      }
    }
    
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - current.count,
      reset: current.resetTime
    }
  }
}

/**
 * Middleware to apply rate limiting with 429 response
 */
export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000
) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest): Promise<NextResponse> => {
      const result = rateLimit(maxRequests, windowMs)(request)
      
      if (!result) {
        // Shouldn't happen, but handle gracefully
        return handler(request)
      }
      
      if (!result.allowed) {
        const secondsUntilReset = Math.ceil((result.reset - Date.now()) / 1000)
        
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests. Please try again later.',
            retryAfter: secondsUntilReset
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': result.reset.toString(),
              'Retry-After': secondsUntilReset.toString()
            }
          }
        )
      }
      
      const response = await handler(request)
      
      // Add rate limit headers to response
      response.headers.set('X-RateLimit-Limit', result.limit.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.reset.toString())
      
      return response
    }
  }
}
