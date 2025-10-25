import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation/serviceInstance'

// POST /api/automation/emergency-stop
export async function POST(request: NextRequest) {
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
