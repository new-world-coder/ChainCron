import { NextRequest, NextResponse } from 'next/server'

interface LogEntry {
  timestamp: number
  method: string
  path: string
  statusCode: number
  duration: number
  userAgent: string
  ip: string
  error?: string
}

class Logger {
  private logs: LogEntry[] = []
  private readonly maxLogs = 1000

  log(entry: LogEntry): void {
    this.logs.push(entry)
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const emoji = entry.statusCode >= 500 ? '❌' : entry.statusCode >= 400 ? '⚠️' : '✅'
      console.log(
        `${emoji} [${new Date(entry.timestamp).toISOString()}] ${entry.method} ${entry.path} - ${entry.statusCode} (${entry.duration}ms)`
      )
      
      if (entry.error) {
        console.error(`   Error: ${entry.error}`)
      }
    }
  }

  getLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }

  getStats(): {
    totalRequests: number
    errorRate: number
    avgResponseTime: number
    statusCodes: Record<number, number>
  } {
    if (this.logs.length === 0) {
      return {
        totalRequests: 0,
        errorRate: 0,
        avgResponseTime: 0,
        statusCodes: {}
      }
    }

    const statusCodes: Record<number, number> = {}
    let totalResponseTime = 0
    let errors = 0

    for (const log of this.logs) {
      statusCodes[log.statusCode] = (statusCodes[log.statusCode] || 0) + 1
      totalResponseTime += log.duration
      if (log.statusCode >= 400) {
        errors++
      }
    }

    return {
      totalRequests: this.logs.length,
      errorRate: (errors / this.logs.length) * 100,
      avgResponseTime: totalResponseTime / this.logs.length,
      statusCodes
    }
  }

  clear(): void {
    this.logs = []
  }
}

export const logger = new Logger()

/**
 * Middleware to log API requests and responses
 */
export function withLogging(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()
    const start = performance.now()
    
    try {
      const response = await handler(request)
      const duration = Math.round(performance.now() - start)
      
      logger.log({
        timestamp: startTime,
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: response.status,
        duration,
        userAgent: request.headers.get('user-agent') || 'unknown',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 
            request.headers.get('x-real-ip') || 
            'unknown'
      })
      
      return response
    } catch (error) {
      const duration = Math.round(performance.now() - start)
      
      logger.log({
        timestamp: startTime,
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: 500,
        duration,
        userAgent: request.headers.get('user-agent') || 'unknown',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 
            request.headers.get('x-real-ip') || 
            'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      throw error
    }
  }
}
