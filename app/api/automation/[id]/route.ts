import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'
import { WorkflowConfig } from '@/lib/automation/WorkflowExecutor'

// PUT /api/automation/[id]
export async function PUT(
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
    
    const updates: Partial<WorkflowConfig> = await request.json()
    
    await automationService.updateWorkflow(workflowId, updates)
    
    return NextResponse.json({
      success: true,
      message: 'Workflow updated successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/automation/[id]
export async function DELETE(
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
    
    await automationService.unregisterWorkflow(workflowId)
    
    return NextResponse.json({
      success: true,
      message: 'Workflow unregistered successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
