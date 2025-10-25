import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// POST /api/automation/[id]/execute
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = parseInt(params.id)
    
    if (isNaN(workflowId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid workflow ID'
      }, { status: 400 })
    }
    
    const result = await automationService.executeWorkflowNow(workflowId)
    
    return NextResponse.json({
      success: true,
      message: 'Workflow executed successfully',
      data: result
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
