import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// POST /api/automation/pause
export async function POST(request: NextRequest) {
  try {
    await automationService.pauseAllWorkflows()
    
    return NextResponse.json({
      success: true,
      message: 'All workflows paused'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
