import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// GET /api/automation/stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowIdParam = searchParams.get('workflowId')
    
    if (!workflowIdParam) {
      return NextResponse.json({
        success: false,
        error: 'workflowId parameter is required'
      }, { status: 400 })
    }
    
    const workflowId = parseInt(workflowIdParam)
    
    if (isNaN(workflowId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid workflowId parameter'
      }, { status: 400 })
    }
    
    const stats = automationService.getWorkflowStats(workflowId)
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
