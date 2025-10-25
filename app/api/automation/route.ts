import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'
import { WorkflowConfig } from '@/lib/automation/WorkflowExecutor'

// GET /api/automation/status
export async function GET(request: NextRequest) {
  try {
    const status = automationService.getStatus()
    const health = automationService.getHealthMetrics()
    
    return NextResponse.json({
      success: true,
      data: {
        status,
        health
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/automation/workflows
export async function POST(request: NextRequest) {
  try {
    const workflow: WorkflowConfig = await request.json()
    
    // Validate workflow data
    if (!workflow.id || !workflow.name || !workflow.type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required workflow fields'
      }, { status: 400 })
    }

    await automationService.registerWorkflow(workflow)
    
    return NextResponse.json({
      success: true,
      message: 'Workflow registered successfully',
      data: { workflowId: workflow.id }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Additional automation endpoints are in separate route files:
// - GET /api/automation/workflows - app/api/automation/workflows/route.ts
// - GET /api/automation/history - app/api/automation/history/route.ts
// - GET /api/automation/stats - app/api/automation/stats/route.ts
// - GET /api/automation/analytics - app/api/automation/analytics/route.ts
// - PUT /api/automation/[id] - app/api/automation/[id]/route.ts
// - DELETE /api/automation/[id] - app/api/automation/[id]/route.ts
// - POST /api/automation/[id]/execute - app/api/automation/[id]/execute/route.ts
// - POST /api/automation/pause - app/api/automation/pause/route.ts
// - POST /api/automation/resume - app/api/automation/resume/route.ts
// - POST /api/automation/emergency-stop - app/api/automation/emergency-stop/route.ts
