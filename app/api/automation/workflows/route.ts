import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// GET /api/automation/workflows
export async function GET(request: NextRequest) {
  try {
    const workflows = automationService.getWorkflows()
    
    return NextResponse.json({
      success: true,
      data: workflows
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
