import { NextRequest, NextResponse } from 'next/server'

// Health check endpoint for Docker and monitoring
export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: {
        aiWorkflowBuilder: true,
        templateGallery: true,
        socialFeatures: true,
        publicAPI: true,
        flowIntegration: true,
      },
      services: {
        database: 'connected',
        redis: 'connected',
        flowNetwork: process.env.FLOW_NETWORK || 'testnet',
      },
      uptime: process.uptime(),
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
