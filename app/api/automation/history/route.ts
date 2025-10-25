import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// GET /api/automation/history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowIdParam = searchParams.get('workflowId')
    const limitParam = searchParams.get('limit')
    
    const workflowId = workflowIdParam ? parseInt(workflowIdParam) : undefined
    const limit = limitParam ? parseInt(limitParam) : 100
    
    const history = automationService.getExecutionHistory(workflowId, limit)
    
    return NextResponse.json({
      success: true,
      data: history
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
