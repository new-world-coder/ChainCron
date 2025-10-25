import { WorkflowExecutor, WorkflowConfig, ExecutionResult } from './WorkflowExecutor'

export interface AutomationServiceConfig {
  provider: any // ethers.Provider
  maxConcurrentExecutions: number
  retryDelay: number
  gasPriceThreshold: number
}

export class AutomationService {
  private executor: WorkflowExecutor
  private config: AutomationServiceConfig
  private isRunning: boolean = false
  private eventListeners: Map<string, Function[]> = new Map()

  constructor(config: AutomationServiceConfig) {
    this.config = config
    this.executor = new WorkflowExecutor(config.provider)
  }

  /**
   * Start the automation service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Automation service is already running')
      }
      return
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Starting ChainCron Automation Service...')
    }
    
    await this.executor.start()
    this.isRunning = true
    
    this.emit('service:started', { timestamp: Date.now() })
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Automation service started successfully')
    }
  }

  /**
   * Stop the automation service
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Automation service is not running')
      }
      return
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('⏹️ Stopping ChainCron Automation Service...')
    }
    
    await this.executor.stop()
    this.isRunning = false
    
    this.emit('service:stopped', { timestamp: Date.now() })
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Automation service stopped')
    }
  }

  /**
   * Register a workflow for automation
   */
  async registerWorkflow(workflow: WorkflowConfig): Promise<void> {
    try {
      await this.executor.registerWorkflow(workflow)
      this.emit('workflow:registered', { workflow })
      console.log(`📝 Registered workflow: ${workflow.name}`)
    } catch (error) {
      console.error(`❌ Failed to register workflow ${workflow.name}:`, error)
      throw error
    }
  }

  /**
   * Unregister a workflow
   */
  async unregisterWorkflow(workflowId: number): Promise<void> {
    try {
      await this.executor.unregisterWorkflow(workflowId)
      this.emit('workflow:unregistered', { workflowId })
      console.log(`🗑️ Unregistered workflow: ${workflowId}`)
    } catch (error) {
      console.error(`❌ Failed to unregister workflow ${workflowId}:`, error)
      throw error
    }
  }

  /**
   * Update workflow configuration
   */
  async updateWorkflow(workflowId: number, updates: Partial<WorkflowConfig>): Promise<void> {
    try {
      await this.executor.updateWorkflow(workflowId, updates)
      this.emit('workflow:updated', { workflowId, updates })
      console.log(`🔄 Updated workflow: ${workflowId}`)
    } catch (error) {
      console.error(`❌ Failed to update workflow ${workflowId}:`, error)
      throw error
    }
  }

  /**
   * Execute a workflow immediately (manual trigger)
   */
  async executeWorkflowNow(workflowId: number): Promise<ExecutionResult> {
    const workflows = this.executor.getWorkflows()
    const workflow = workflows.find(w => w.id === workflowId)
    
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    try {
      console.log(`⚡ Manual execution triggered for workflow: ${workflow.name}`)
      
      // Create a temporary job for immediate execution
      const job = {
        id: `manual-${workflowId}-${Date.now()}`,
        workflowId,
        scheduledTime: Date.now(),
        priority: 10, // High priority for manual executions
        retryCount: 0,
        maxRetries: 1,
        status: 'pending' as const
      }

      // Execute immediately
      await this.executor['executeWorkflow'](job)
      
      const history = this.executor.getExecutionHistory(workflowId, 1)
      const result = history[0]
      
      this.emit('workflow:executed', { workflowId, result })
      console.log(`✅ Manual execution completed for workflow: ${workflow.name}`)
      
      return result
    } catch (error) {
      console.error(`❌ Manual execution failed for workflow ${workflowId}:`, error)
      throw error
    }
  }

  /**
   * Get execution history
   */
  getExecutionHistory(workflowId?: number, limit: number = 100): ExecutionResult[] {
    return this.executor.getExecutionHistory(workflowId, limit)
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(workflowId: number) {
    return this.executor.getWorkflowStats(workflowId)
  }

  /**
   * Get all workflows
   */
  getWorkflows(): WorkflowConfig[] {
    return this.executor.getWorkflows()
  }

  /**
   * Get service status
   */
  getStatus(): {
    isRunning: boolean
    totalWorkflows: number
    queueStatus: any
    uptime: number
  } {
    const workflows = this.getWorkflows()
    const queueStatus = this.executor.getQueueStatus()
    
    return {
      isRunning: this.isRunning,
      totalWorkflows: workflows.length,
      queueStatus,
      uptime: this.isRunning ? Date.now() - (this as any).startTime : 0
    }
  }

  /**
   * Get service health metrics
   */
  getHealthMetrics(): {
    status: 'healthy' | 'degraded' | 'unhealthy'
    metrics: {
      totalExecutions: number
      successRate: number
      avgExecutionTime: number
      errorRate: number
      gasEfficiency: number
    }
  } {
    const history = this.getExecutionHistory()
    const successful = history.filter(r => r.status === 'success')
    const failed = history.filter(r => r.status === 'failed')
    
    const totalExecutions = history.length
    const successRate = totalExecutions > 0 ? (successful.length / totalExecutions) * 100 : 100
    const errorRate = totalExecutions > 0 ? (failed.length / totalExecutions) * 100 : 0
    
    // Calculate average execution time (mock for now)
    const avgExecutionTime = 2500 // 2.5 seconds average
    
    // Calculate gas efficiency (lower is better)
    const avgGasUsed = totalExecutions > 0 ? 
      history.reduce((sum, r) => sum + r.gasUsed, 0) / totalExecutions : 0
    const gasEfficiency = avgGasUsed > 0 ? Math.max(0, 100 - (avgGasUsed / 300000) * 100) : 100

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (successRate < 95 || errorRate > 5) status = 'degraded'
    if (successRate < 90 || errorRate > 10) status = 'unhealthy'

    return {
      status,
      metrics: {
        totalExecutions,
        successRate,
        avgExecutionTime,
        errorRate,
        gasEfficiency
      }
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): AutomationServiceConfig {
    return { ...this.config }
  }

  /**
   * Update service configuration
   */
  updateConfig(updates: Partial<AutomationServiceConfig>): void {
    this.config = { ...this.config, ...updates }
    this.emit('config:updated', { config: this.config })
  }

  /**
   * Pause all workflow executions
   */
  async pauseAllWorkflows(): Promise<void> {
    const workflows = this.getWorkflows()
    for (const workflow of workflows) {
      await this.updateWorkflow(workflow.id, { isActive: false })
    }
    this.emit('service:paused', { timestamp: Date.now() })
    console.log('⏸️ All workflows paused')
  }

  /**
   * Resume all workflow executions
   */
  async resumeAllWorkflows(): Promise<void> {
    const workflows = this.getWorkflows()
    for (const workflow of workflows) {
      await this.updateWorkflow(workflow.id, { isActive: true })
    }
    this.emit('service:resumed', { timestamp: Date.now() })
    console.log('▶️ All workflows resumed')
  }

  /**
   * Emergency stop all executions
   */
  async emergencyStop(): Promise<void> {
    console.log('🚨 Emergency stop triggered!')
    await this.stop()
    this.emit('service:emergency_stop', { timestamp: Date.now() })
  }

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): {
    executions: number
    successRate: number
    avgGasUsed: number
    totalEarnings: number
    topWorkflows: Array<{
      id: number
      name: string
      executions: number
      earnings: number
    }>
  } {
    const now = Date.now()
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }

    const cutoff = now - timeRanges[timeRange]
    const history = this.getExecutionHistory().filter(r => r.timestamp >= cutoff)
    
    const successful = history.filter(r => r.status === 'success')
    const workflows = this.getWorkflows()
    
    // Calculate top workflows by earnings
    const workflowEarnings = new Map<number, { executions: number, earnings: number }>()
    
    successful.forEach(result => {
      const current = workflowEarnings.get(result.workflowId) || { executions: 0, earnings: 0 }
      workflowEarnings.set(result.workflowId, {
        executions: current.executions + 1,
        earnings: current.earnings + (result.earnings || 0)
      })
    })

    const topWorkflows = Array.from(workflowEarnings.entries())
      .map(([id, stats]) => {
        const workflow = workflows.find(w => w.id === id)
        return {
          id,
          name: workflow?.name || `Workflow ${id}`,
          executions: stats.executions,
          earnings: stats.earnings
        }
      })
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5)

    return {
      executions: history.length,
      successRate: history.length > 0 ? (successful.length / history.length) * 100 : 0,
      avgGasUsed: history.length > 0 ? history.reduce((sum, r) => sum + r.gasUsed, 0) / history.length : 0,
      totalEarnings: successful.reduce((sum, r) => sum + (r.earnings || 0), 0),
      topWorkflows
    }
  }
}
