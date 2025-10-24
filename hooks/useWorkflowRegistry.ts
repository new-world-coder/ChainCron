'use client'

import { useContractRead, useWriteContract } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
import { 
  WORKFLOW_REGISTRY_ABI, 
  CONTRACT_ADDRESSES,
  type Workflow 
} from '@/types/contracts'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

// Mock contract addresses for now - these will be updated after deployment
const MOCK_CONTRACT_ADDRESSES = {
  WORKFLOW_REGISTRY: process.env.NEXT_PUBLIC_WORKFLOW_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  SUBSCRIPTION_MANAGER: process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
  WORKFLOW_EXECUTOR: process.env.NEXT_PUBLIC_WORKFLOW_EXECUTOR_ADDRESS || '0x0000000000000000000000000000000000000000',
  PAYMENT_TOKEN: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
}

export function useWorkflowRegistry() {
  // Hook to get total number of workflows
  const { data: totalWorkflows, isLoading: isLoadingTotal } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_REGISTRY as `0x${string}`,
    abi: WORKFLOW_REGISTRY_ABI,
    functionName: 'getTotalWorkflows',
  })

  // Hook to register a new workflow (write operation)
  const {
    writeContract: registerWorkflow,
    data: registerTxData,
    isPending: isRegistering,
    error: registerError,
  } = useWriteContract()

  // Wait for register transaction to complete
  const { isLoading: isRegisterConfirming } = useWaitForTransactionReceipt({
    hash: registerTxData,
  })

  // Function to register a workflow
  const registerNewWorkflow = useCallback(async (
    creator: string,
    name: string,
    description: string,
    price: bigint,
    category: string
  ) => {
    try {
      // In development mode, simulate registration without blockchain calls
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating workflow registration', name)
        toast.success('Workflow registered successfully! (Development Mode)')
        return
      }

      if (!registerWorkflow) {
        throw new Error('Contract not initialized')
      }

      await registerWorkflow({
        address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_REGISTRY as `0x${string}`,
        abi: WORKFLOW_REGISTRY_ABI,
        functionName: 'registerWorkflow',
        args: [creator as `0x${string}`, name, description, price, category],
      })
      toast.success('Workflow registered successfully!')
    } catch (error) {
      console.error('Error registering workflow:', error)
      toast.error('Failed to register workflow: ' + (error as Error).message)
      throw error
    }
  }, [registerWorkflow])

  return {
    totalWorkflows: totalWorkflows ? Number(totalWorkflows) : 0,
    isLoadingTotal,
    registerNewWorkflow,
    isRegistering: isRegistering || isRegisterConfirming,
    registerError,
    contractAddress: MOCK_CONTRACT_ADDRESSES.WORKFLOW_REGISTRY,
  }
}

// Hook to get a specific workflow by ID
export function useWorkflow(workflowId: number) {
  const { data: workflowData, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_REGISTRY as `0x${string}`,
    abi: WORKFLOW_REGISTRY_ABI,
    functionName: 'getWorkflow',
    args: [BigInt(workflowId)],
  })

  const workflow = useMemo(() => {
    if (!workflowData) return null
    
    return {
      id: Number(workflowData.id),
      name: workflowData.name,
      description: workflowData.description,
      creator: workflowData.creator,
      price: workflowData.price,
      category: workflowData.category,
      isActive: workflowData.isActive,
      createdAt: workflowData.createdAt,
    } as Workflow
  }, [workflowData])

  return {
    workflow,
    isLoading,
    error,
  }
}

// Hook to get workflows by creator
export function useWorkflowsByCreator(creatorAddress?: string) {
  const { data: workflowIds, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_REGISTRY as `0x${string}`,
    abi: WORKFLOW_REGISTRY_ABI,
    functionName: 'getWorkflowsByCreator',
    args: creatorAddress ? [creatorAddress as `0x${string}`] : undefined,
  })

  return {
    workflowIds: workflowIds ? workflowIds.map(id => Number(id)) : [],
    isLoading,
    error,
  }
}

// Hook to get workflows by category
export function useWorkflowsByCategory(category: string) {
  const { data: workflowIds, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_REGISTRY as `0x${string}`,
    abi: WORKFLOW_REGISTRY_ABI,
    functionName: 'getWorkflowsByCategory',
    args: [category],
  })

  return {
    workflowIds: workflowIds ? workflowIds.map(id => Number(id)) : [],
    isLoading,
    error,
  }
}