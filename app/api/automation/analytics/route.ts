import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// GET /api/automation/analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = (searchParams.get('timeRange') as '1h' | '24h' | '7d' | '30d') || '24h'
    
    const analytics = automationService.getPerformanceAnalytics(timeRange)
    
    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
