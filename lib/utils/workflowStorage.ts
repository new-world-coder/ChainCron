import { ComposedWorkflow } from '@/components/WorkflowComposer'

const WORKFLOW_STORAGE_KEY = 'chaincron_saved_workflows'

export interface SavedWorkflow {
  id: string
  name: string
  description: string
  nodes: any[]
  connections: any[]
  variables: Record<string, any>
  executionPlan: string[]
  estimatedGas: string
  successRate: number
  createdAt: Date
  updatedAt: Date
  isTestnetEnabled?: boolean
  isDeployed?: boolean
  deployPrice?: number
  deployCreatorFee?: number
  status?: 'draft' | 'published' | 'paused'
  deployedAt?: Date
}

export function saveWorkflow(workflow: ComposedWorkflow): void {
  try {
    const saved = getSavedWorkflows()
    
    // Check if workflow already exists
    const existingIndex = saved.findIndex(w => w.id === workflow.id)
    const existing = existingIndex >= 0 ? saved[existingIndex] : null
    
    const workflowToSave: SavedWorkflow = {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      nodes: workflow.nodes,
      connections: workflow.connections,
      variables: workflow.variables,
      executionPlan: workflow.executionPlan,
      estimatedGas: workflow.estimatedGas,
      successRate: workflow.successRate,
      createdAt: workflow.createdAt,
      updatedAt: new Date(),
      isTestnetEnabled: workflow.isTestnetEnabled,
      // Preserve deployment status if updating existing workflow
      isDeployed: existing?.isDeployed || workflow.isDeployed,
      deployPrice: existing?.deployPrice || (workflow as any).deployPrice,
      deployCreatorFee: existing?.deployCreatorFee || (workflow as any).deployCreatorFee,
      status: existing?.status || (workflow as any).status || 'draft',
      deployedAt: existing?.deployedAt || (workflow as any).deployedAt,
    }

    if (existingIndex >= 0) {
      // Update existing
      saved[existingIndex] = workflowToSave
    } else {
      // Add new
      saved.push(workflowToSave)
    }

    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(saved))
  } catch (error) {
    console.error('Error saving workflow:', error)
    throw error
  }
}

export function getSavedWorkflows(): SavedWorkflow[] {
  try {
    const stored = localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (!stored) return []
    
    const workflows = JSON.parse(stored)
    // Convert date strings back to Date objects
    return workflows.map((w: any) => ({
      ...w,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
      deployedAt: w.deployedAt ? new Date(w.deployedAt) : undefined,
    }))
  } catch (error) {
    console.error('Error loading workflows:', error)
    return []
  }
}

export function getWorkflowById(id: string): SavedWorkflow | null {
  const workflows = getSavedWorkflows()
  const workflow = workflows.find(w => w.id === id)
  return workflow || null
}

export function deleteWorkflow(id: string): void {
  try {
    const workflows = getSavedWorkflows()
    const filtered = workflows.filter(w => w.id !== id)
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting workflow:', error)
    throw error
  }
}

export function convertSavedWorkflowToComposed(saved: SavedWorkflow): ComposedWorkflow {
  return {
    id: saved.id,
    name: saved.name,
    description: saved.description,
    nodes: saved.nodes,
    connections: saved.connections,
    variables: saved.variables,
    executionPlan: saved.executionPlan,
    estimatedGas: saved.estimatedGas,
    successRate: saved.successRate,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
    isTestnetEnabled: saved.isTestnetEnabled,
    isDeployed: saved.isDeployed,
    deployPrice: saved.deployPrice,
    deployCreatorFee: saved.deployCreatorFee,
    status: saved.status,
    deployedAt: saved.deployedAt,
  } as any
}
