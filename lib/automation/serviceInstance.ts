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

// Start the service
automationService.start()
