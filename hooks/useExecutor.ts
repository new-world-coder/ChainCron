'use client'

import { useContractRead, useWriteContract } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
import { 
  WORKFLOW_EXECUTOR_ABI, 
  type Execution 
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

export function useExecutor() {
  // Hook to execute a workflow
  const {
    writeContract: executeWorkflow,
    data: executeTxData,
    isPending: isExecuting,
    error: executeError,
  } = useWriteContract()

  // Wait for execution transaction to complete
  const { isLoading: isExecuteConfirming, data: receipt } = useWaitForTransactionReceipt({
    hash: executeTxData,
  })

  // Function to execute a workflow
  const execute = useCallback(async (
    workflowId: number, 
    userAddress: string, 
    executionData: string = '0x'
  ) => {
    try {
      // In development mode, simulate execution without blockchain calls
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating workflow execution', workflowId)
        toast.success('Workflow executed successfully! (Development Mode)')
        return
      }

      if (!executeWorkflow) {
        throw new Error('Contract not initialized')
      }

      await executeWorkflow({
        address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
        abi: WORKFLOW_EXECUTOR_ABI,
        functionName: 'executeWorkflow',
        args: [BigInt(workflowId), userAddress as `0x${string}`, executionData as `0x${string}`],
      })
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow: ' + (error as Error).message)
      throw error
    }
  }, [executeWorkflow])

  return {
    execute,
    isExecuting: isExecuting || isExecuteConfirming,
    executeError,
    executeTxData,
    receipt,
    contractAddress: MOCK_CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR,
  }
}

// Hook to get execution details by hash
export function useExecutionDetails(executionHash?: string) {
  const { data: executionData, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
    abi: WORKFLOW_EXECUTOR_ABI,
    functionName: 'getExecution',
    args: executionHash ? [executionHash as `0x${string}`] : undefined,
  })

  const execution = useMemo(() => {
    if (!executionData) return null
    
    return {
      workflowId: Number(executionData.workflowId),
      user: executionData.user,
      executor: executionData.executor,
      timestamp: executionData.timestamp,
      executionHash: executionData.executionHash,
      success: executionData.success,
      resultData: executionData.resultData,
      gasUsed: executionData.gasUsed,
    } as Execution
  }, [executionData])

  return {
    execution,
    isLoading,
    error,
  }
}

// Hook to get workflow executions
export function useWorkflowExecutions(workflowId: number) {
  const { data: executionHashes, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
    abi: WORKFLOW_EXECUTOR_ABI,
    functionName: 'getWorkflowExecutions',
    args: [BigInt(workflowId)],
  })

  return {
    executionHashes: executionHashes || [],
    isLoading,
    error,
    executionCount: executionHashes ? executionHashes.length : 0,
  }
}

// Hook to get user executions
export function useUserExecutions(userAddress?: string) {
  const { data: executionHashes, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
    abi: WORKFLOW_EXECUTOR_ABI,
    functionName: 'getUserExecutions',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  })

  return {
    executionHashes: executionHashes || [],
    isLoading,
    error,
    executionCount: executionHashes ? executionHashes.length : 0,
  }
}