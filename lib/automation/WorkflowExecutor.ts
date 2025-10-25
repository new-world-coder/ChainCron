import { ethers } from 'ethers'

export interface WorkflowConfig {
  id: number
  name: string
  type: 'auto-compound' | 'portfolio-rebalance' | 'price-alert' | 'dca'
  parameters: Record<string, any>
  schedule: {
    interval: number // seconds
    lastExecution: number
    nextExecution: number
  }
  isActive: boolean
  creator: string
  subscribers: string[]
}

export interface ExecutionResult {
  workflowId: number
  executionId: string
  timestamp: number
  status: 'success' | 'failed' | 'pending'
  gasUsed: number
  gasPrice: number
  txHash?: string
  error?: string
  earnings?: number
  details: Record<string, any>
}

export interface AutomationJob {
  id: string
  workflowId: number
  scheduledTime: number
  priority: number
  retryCount: number
  maxRetries: number
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export class WorkflowExecutor {
  private provider: ethers.Provider
  private workflows: Map<number, WorkflowConfig> = new Map()
  private executionQueue: AutomationJob[] = []
  private isRunning: boolean = false
  private executionHistory: ExecutionResult[] = []
  private intervalIds: NodeJS.Timeout[] | null = null

  constructor(provider: ethers.Provider) {
    this.provider = provider
  }

  /**
   * Register a workflow for automation
   */
  async registerWorkflow(config: WorkflowConfig): Promise<void> {
    this.workflows.set(config.id, config)
    await this.scheduleNextExecution(config.id)
  }

  /**
   * Unregister a workflow
   */
  async unregisterWorkflow(workflowId: number): Promise<void> {
    this.workflows.delete(workflowId)
    // Remove from execution queue
    this.executionQueue = this.executionQueue.filter(job => job.workflowId !== workflowId)
  }

  /**
   * Update workflow configuration
   */
  async updateWorkflow(workflowId: number, updates: Partial<WorkflowConfig>): Promise<void> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) throw new Error('Workflow not found')

    const updatedWorkflow = { ...workflow, ...updates }
    this.workflows.set(workflowId, updatedWorkflow)
    
    // Reschedule if schedule changed
    if (updates.schedule) {
      await this.scheduleNextExecution(workflowId)
    }
  }

  /**
   * Schedule next execution for a workflow
   */
  private async scheduleNextExecution(workflowId: number): Promise<void> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow || !workflow.isActive) return

    const nextExecution = Date.now() + (workflow.schedule.interval * 1000)
    
    const job: AutomationJob = {
      id: `${workflowId}-${nextExecution}`,
      workflowId,
      scheduledTime: nextExecution,
      priority: this.calculatePriority(workflow),
      retryCount: 0,
      maxRetries: 3,
      status: 'pending'
    }

    // Remove existing job for this workflow
    this.executionQueue = this.executionQueue.filter(j => j.workflowId !== workflowId)
    
    // Add new job
    this.executionQueue.push(job)
    this.executionQueue.sort((a, b) => a.scheduledTime - b.scheduledTime)
  }

  /**
   * Calculate execution priority based on workflow type and parameters
   */
  private calculatePriority(workflow: WorkflowConfig): number {
    let priority = 1

    // Higher priority for time-sensitive workflows
    if (workflow.type === 'price-alert') priority += 2
    if (workflow.type === 'auto-compound') priority += 1

    // Higher priority for workflows with more subscribers
    priority += Math.min(workflow.subscribers.length, 5)

    return priority
  }

  /**
   * Start the automation engine
   */
  async start(): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Automation engine started')
    }

    // Only use timers in production/server environment
    if (typeof window === 'undefined') {
      // Process execution queue
      const intervalId1 = setInterval(async () => {
        if (this.isRunning) {
          await this.processExecutionQueue()
        }
      }, 1000) // Check every second

      // Monitor gas prices for optimal execution timing
      const intervalId2 = setInterval(async () => {
        if (this.isRunning) {
          await this.optimizeExecutionTiming()
        }
      }, 30000) // Check every 30 seconds

      // Store interval IDs for cleanup
      if (!this.intervalIds) {
        this.intervalIds = []
      }
      this.intervalIds.push(intervalId1, intervalId2)
    }
  }

  /**
   * Stop the automation engine
   */
  async stop(): Promise<void> {
    this.isRunning = false
    
    // Clear all intervals
    if (this.intervalIds) {
      this.intervalIds.forEach(id => clearInterval(id))
      this.intervalIds = null
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('⏹️ Automation engine stopped')
    }
  }

  /**
   * Process the execution queue
   */
  private async processExecutionQueue(): Promise<void> {
    if (!this.isRunning) return

    const now = Date.now()
    const readyJobs = this.executionQueue.filter(
      job => job.status === 'pending' && job.scheduledTime <= now
    )

    for (const job of readyJobs) {
      await this.executeWorkflow(job)
    }
  }

  /**
   * Execute a workflow
   */
  private async executeWorkflow(job: AutomationJob): Promise<void> {
    const workflow = this.workflows.get(job.workflowId)
    if (!workflow) return

    job.status = 'running'
    
    try {
      console.log(`⚡ Executing workflow ${workflow.name} (ID: ${workflow.id})`)
      
      const result = await this.executeWorkflowByType(workflow)
      
      job.status = 'completed'
      this.executionHistory.push(result)
      
      // Schedule next execution
      await this.scheduleNextExecution(workflow.id)
      
      console.log(`✅ Workflow ${workflow.name} executed successfully`)
      
    } catch (error) {
      console.error(`❌ Workflow ${workflow.name} execution failed:`, error)
      
      job.retryCount++
      if (job.retryCount < job.maxRetries) {
        // Retry with exponential backoff
        job.scheduledTime = Date.now() + (Math.pow(2, job.retryCount) * 60000) // 1min, 2min, 4min
        job.status = 'pending'
      } else {
        job.status = 'failed'
        this.executionHistory.push({
          workflowId: workflow.id,
          executionId: job.id,
          timestamp: Date.now(),
          status: 'failed',
          gasUsed: 0,
          gasPrice: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: {}
        })
      }
    }
  }

  /**
   * Execute workflow based on its type
   */
  private async executeWorkflowByType(workflow: WorkflowConfig): Promise<ExecutionResult> {
    const executionId = `${workflow.id}-${Date.now()}`
    const startTime = Date.now()

    let result: ExecutionResult = {
      workflowId: workflow.id,
      executionId,
      timestamp: startTime,
      status: 'pending',
      gasUsed: 0,
      gasPrice: 0,
      details: {}
    }

    try {
      switch (workflow.type) {
        case 'auto-compound':
          result = await this.executeAutoCompound(workflow, result)
          break
        case 'portfolio-rebalance':
          result = await this.executePortfolioRebalance(workflow, result)
          break
        case 'price-alert':
          result = await this.executePriceAlert(workflow, result)
          break
        case 'dca':
          result = await this.executeDCA(workflow, result)
          break
        default:
          throw new Error(`Unknown workflow type: ${workflow.type}`)
      }

      result.status = 'success'
      return result

    } catch (error) {
      result.status = 'failed'
      result.error = error instanceof Error ? error.message : 'Unknown error'
      throw error
    }
  }

  /**
   * Execute auto-compound workflow
   */
  private async executeAutoCompound(workflow: WorkflowConfig, result: ExecutionResult): Promise<ExecutionResult> {
    const { yieldToken, yieldFarm, minCompoundAmount } = workflow.parameters

    // Simulate auto-compound execution
    const mockRewards = Math.random() * 100 + 10 // $10-110 in rewards
    const gasUsed = 180000 + Math.floor(Math.random() * 20000) // 180k-200k gas
    const gasPrice = await this.getCurrentGasPrice()

    if (mockRewards >= minCompoundAmount) {
      result.gasUsed = gasUsed
      result.gasPrice = gasPrice
      result.earnings = mockRewards
      result.details = {
        yieldToken,
        yieldFarm,
        rewardsCompounded: mockRewards,
        gasCost: (gasUsed * gasPrice) / 1e18
      }
    } else {
      result.details = {
        yieldToken,
        yieldFarm,
        rewardsCompounded: 0,
        reason: 'Below minimum compound amount'
      }
    }

    return result
  }

  /**
   * Execute portfolio rebalance workflow
   */
  private async executePortfolioRebalance(workflow: WorkflowConfig, result: ExecutionResult): Promise<ExecutionResult> {
    const { allocations, rebalanceThreshold } = workflow.parameters

    // Simulate portfolio rebalancing
    const gasUsed = 220000 + Math.floor(Math.random() * 30000) // 220k-250k gas
    const gasPrice = await this.getCurrentGasPrice()

    result.gasUsed = gasUsed
    result.gasPrice = gasPrice
    result.details = {
      allocations,
      rebalanceThreshold,
      tokensRebalanced: allocations.length,
      gasCost: (gasUsed * gasPrice) / 1e18
    }

    return result
  }

  /**
   * Execute price alert workflow
   */
  private async executePriceAlert(workflow: WorkflowConfig, result: ExecutionResult): Promise<ExecutionResult> {
    const { tokenAddress, targetPrice, conditionType, autoSwapEnabled } = workflow.parameters

    // Simulate price check and potential swap
    const currentPrice = Math.random() * 5000 + 1000 // Mock price
    const gasUsed = 150000 + Math.floor(Math.random() * 20000) // 150k-170k gas
    const gasPrice = await this.getCurrentGasPrice()

    let triggered = false
    if (conditionType === 'GREATER_THAN' && currentPrice >= targetPrice) {
      triggered = true
    } else if (conditionType === 'LESS_THAN' && currentPrice <= targetPrice) {
      triggered = true
    }

    result.gasUsed = gasUsed
    result.gasPrice = gasPrice
    result.details = {
      tokenAddress,
      targetPrice,
      currentPrice,
      conditionType,
      triggered,
      autoSwapEnabled,
      gasCost: (gasUsed * gasPrice) / 1e18
    }

    return result
  }

  /**
   * Execute DCA (Dollar Cost Averaging) workflow
   */
  private async executeDCA(workflow: WorkflowConfig, result: ExecutionResult): Promise<ExecutionResult> {
    const { tokenAddress, amount, frequency } = workflow.parameters

    // Simulate DCA execution
    const gasUsed = 120000 + Math.floor(Math.random() * 15000) // 120k-135k gas
    const gasPrice = await this.getCurrentGasPrice()

    result.gasUsed = gasUsed
    result.gasPrice = gasPrice
    result.details = {
      tokenAddress,
      amount,
      frequency,
      gasCost: (gasUsed * gasPrice) / 1e18
    }

    return result
  }

  /**
   * Get current gas price
   */
  private async getCurrentGasPrice(): Promise<number> {
    try {
      const feeData = await this.provider.getFeeData()
      return Number(feeData.gasPrice) || 20000000000 // 20 gwei default
    } catch (error) {
      return 20000000000 // 20 gwei fallback
    }
  }

  /**
   * Optimize execution timing based on gas prices
   */
  private async optimizeExecutionTiming(): Promise<void> {
    const gasPrice = await this.getCurrentGasPrice()
    const gasPriceGwei = gasPrice / 1e9

    // If gas is too high, delay non-critical executions
    if (gasPriceGwei > 50) {
      console.log(`⛽ High gas detected (${gasPriceGwei.toFixed(2)} gwei), delaying non-critical executions`)
      
      this.executionQueue.forEach(job => {
        const workflow = this.workflows.get(job.workflowId)
        if (workflow && workflow.type !== 'price-alert') {
          job.scheduledTime += 300000 // Delay by 5 minutes
        }
      })
    }
  }

  /**
   * Get execution history
   */
  getExecutionHistory(workflowId?: number, limit: number = 100): ExecutionResult[] {
    let history = this.executionHistory
    
    if (workflowId) {
      history = history.filter(result => result.workflowId === workflowId)
    }
    
    return history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(workflowId: number): {
    totalExecutions: number
    successRate: number
    avgGasUsed: number
    totalEarnings: number
    lastExecution?: ExecutionResult
  } {
    const history = this.getExecutionHistory(workflowId)
    const successful = history.filter(r => r.status === 'success')
    
    return {
      totalExecutions: history.length,
      successRate: history.length > 0 ? (successful.length / history.length) * 100 : 0,
      avgGasUsed: history.length > 0 ? history.reduce((sum, r) => sum + r.gasUsed, 0) / history.length : 0,
      totalEarnings: successful.reduce((sum, r) => sum + (r.earnings || 0), 0),
      lastExecution: history[0]
    }
  }

  /**
   * Get all registered workflows
   */
  getWorkflows(): WorkflowConfig[] {
    return Array.from(this.workflows.values())
  }

  /**
   * Get execution queue status
   */
  getQueueStatus(): {
    totalJobs: number
    pendingJobs: number
    runningJobs: number
    nextExecution?: number
  } {
    const pendingJobs = this.executionQueue.filter(job => job.status === 'pending')
    const runningJobs = this.executionQueue.filter(job => job.status === 'running')
    const nextExecution = pendingJobs.length > 0 ? Math.min(...pendingJobs.map(job => job.scheduledTime)) : undefined

    return {
      totalJobs: this.executionQueue.length,
      pendingJobs: pendingJobs.length,
      runningJobs: runningJobs.length,
      nextExecution
    }
  }
}
