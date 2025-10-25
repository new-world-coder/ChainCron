import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// POST /api/automation/resume
export async function POST(request: NextRequest) {
  try {
    await automationService.resumeAllWorkflows()
    
    return NextResponse.json({
      success: true,
      message: 'All workflows resumed'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
