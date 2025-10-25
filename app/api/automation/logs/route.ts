import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/api/logger'

// GET /api/automation/logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const statsOnly = searchParams.get('stats') === 'true'
    
    if (statsOnly) {
      const stats = logger.getStats()
      
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    const limit = limitParam ? parseInt(limitParam) : 100
    const logs = logger.getLogs(limit)
    
    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
