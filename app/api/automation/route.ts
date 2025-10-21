import { NextRequest, NextResponse } from 'next/server'
import { AutomationService } from '@/lib/automation/AutomationService'
import { WorkflowConfig } from '@/lib/automation/WorkflowExecutor'

// Mock provider for demonstration
const mockProvider = {
  getFeeData: async () => ({ gasPrice: 20000000000n })
}

// Initialize automation service
const automationService = new AutomationService({
  provider: mockProvider,
  maxConcurrentExecutions: 10,
  retryDelay: 60000,
  gasPriceThreshold: 50
})

// Start the service
automationService.start()

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

// PUT /api/automation/workflows/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflowId = parseInt(params.id)
    const updates = await request.json()
    
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

// DELETE /api/automation/workflows/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflowId = parseInt(params.id)
    
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

// POST /api/automation/workflows/[id]/execute
export async function POST_EXECUTE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflowId = parseInt(params.id)
    
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

// GET /api/automation/workflows
export async function GET_WORKFLOWS(request: NextRequest) {
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

// GET /api/automation/history
export async function GET_HISTORY(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const history = automationService.getExecutionHistory(
      workflowId ? parseInt(workflowId) : undefined,
      limit
    )
    
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

// GET /api/automation/stats/[id]
export async function GET_STATS(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflowId = parseInt(params.id)
    
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

// GET /api/automation/analytics
export async function GET_ANALYTICS(request: NextRequest) {
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

// POST /api/automation/pause
export async function POST_PAUSE(request: NextRequest) {
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

// POST /api/automation/resume
export async function POST_RESUME(request: NextRequest) {
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

// POST /api/automation/emergency-stop
export async function POST_EMERGENCY_STOP(request: NextRequest) {
  try {
    await automationService.emergencyStop()
    
    return NextResponse.json({
      success: true,
      message: 'Emergency stop executed'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
