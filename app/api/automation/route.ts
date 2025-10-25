import { NextRequest, NextResponse } from 'next/server'
import { AutomationService } from '@/lib/automation/AutomationService'
import { WorkflowConfig } from '@/lib/automation/WorkflowExecutor'

// Mock provider for demonstration
const mockProvider = {
  getFeeData: async () => ({ gasPrice: BigInt(20000000000) })
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

// Additional automation endpoints would be in separate route files
// This file only handles the main automation API endpoints
