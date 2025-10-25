import { AutomationService } from './AutomationService'

// Mock provider for demonstration
const mockProvider = {
  getFeeData: async () => ({ gasPrice: BigInt(20000000000) })
}

// Initialize automation service singleton
export const automationService = new AutomationService({
  provider: mockProvider,
  maxConcurrentExecutions: 10,
  retryDelay: 60000,
  gasPriceThreshold: 50
})

// Start the service only in runtime environment, not during build
// Check for Vercel or similar serverless environment
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.VERCEL_ENV === undefined ||
                    typeof window !== 'undefined'

if (!isBuildTime && typeof window === 'undefined') {
  // Use a try-catch and async initialization
  try {
    // Use setImmediate to defer initialization
    if (typeof setImmediate !== 'undefined') {
      setImmediate(async () => {
        try {
          await automationService.start()
        } catch (error) {
          // Silently fail during initialization
        }
      })
    }
  } catch (error) {
    // Ignore errors during initialization
  }
}
