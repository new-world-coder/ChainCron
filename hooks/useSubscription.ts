'use client'

import { useContractRead, useWriteContract, useAccount } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
import { 
  SUBSCRIPTION_MANAGER_ABI, 
  type Subscription 
} from '@/types/contracts'
import { useCallback, useMemo, useEffect } from 'react'
import { toast } from 'sonner'

// Mock contract addresses for now - these will be updated after deployment
const MOCK_CONTRACT_ADDRESSES = {
  WORKFLOW_REGISTRY: process.env.NEXT_PUBLIC_WORKFLOW_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  SUBSCRIPTION_MANAGER: process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
  WORKFLOW_EXECUTOR: process.env.NEXT_PUBLIC_WORKFLOW_EXECUTOR_ADDRESS || '0x0000000000000000000000000000000000000000',
  PAYMENT_TOKEN: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
}

export function useSubscription() {
  const { address } = useAccount()

  // Hook to subscribe to a workflow
  const {
    writeContract: subscribeToWorkflow,
    data: subscribeTxData,
    isPending: isSubscribing,
    error: subscribeError,
  } = useWriteContract()

  // Wait for subscribe transaction to complete
  const { isLoading: isSubscribeConfirming, isSuccess: isSubscribeSuccess, isError: isSubscribeError } = useWaitForTransactionReceipt({
    hash: subscribeTxData,
  })

  useEffect(() => {
    if (isSubscribeSuccess) {
      toast.success('Successfully subscribed to workflow!')
    }
    if (isSubscribeError) {
      toast.error('Subscription transaction failed')
    }
  }, [isSubscribeSuccess, isSubscribeError])

  // Hook to cancel subscription
  const {
    writeContract: cancelSubscription,
    data: cancelTxData,
    isPending: isCancelling,
    error: cancelError,
  } = useWriteContract()

  // Wait for cancel transaction to complete
  const { isLoading: isCancelConfirming } = useWaitForTransactionReceipt({
    hash: cancelTxData,
  })

  // Function to subscribe to a workflow
  const subscribe = useCallback(async (workflowId: number, price: bigint) => {
    try {
      if (!subscribeToWorkflow) {
        throw new Error('Contract not initialized')
      }

      await subscribeToWorkflow({
        address: MOCK_CONTRACT_ADDRESSES.SUBSCRIPTION_MANAGER as `0x${string}`,
        abi: SUBSCRIPTION_MANAGER_ABI,
        functionName: 'subscribe',
        args: [BigInt(workflowId), price],
      })
    } catch (error) {
      console.error('Error subscribing to workflow:', error)
      toast.error('Failed to subscribe: ' + (error as Error).message)
      throw error
    }
  }, [subscribeToWorkflow])

  // Function to cancel subscription
  const cancel = useCallback(async (workflowId: number) => {
    try {
      if (!cancelSubscription) {
        throw new Error('Contract not initialized')
      }

      await cancelSubscription({
        address: MOCK_CONTRACT_ADDRESSES.SUBSCRIPTION_MANAGER as `0x${string}`,
        abi: SUBSCRIPTION_MANAGER_ABI,
        functionName: 'cancel',
        args: [BigInt(workflowId)],
      })
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw error
    }
  }, [cancelSubscription])

  return {
    subscribe,
    cancel,
    isSubscribing: isSubscribing || isSubscribeConfirming,
    isCancelling: isCancelling || isCancelConfirming,
    subscribeError,
    cancelError,
    contractAddress: MOCK_CONTRACT_ADDRESSES.SUBSCRIPTION_MANAGER,
  }
}

// Hook to check if user has active subscription to a specific workflow
export function useSubscriptionStatus(workflowId: number, userAddress?: string) {
  const { data: isActive, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.SUBSCRIPTION_MANAGER as `0x${string}`,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'isSubscriptionActive',
    args: userAddress && workflowId > 0 ? [userAddress as `0x${string}`, BigInt(workflowId)] : undefined,
  })

  return {
    isActive: isActive || false,
    isLoading,
    error,
  }
}

// Hook to get subscription details
export function useSubscriptionDetails(workflowId: number, userAddress?: string) {
  const { data: subscriptionData, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.SUBSCRIPTION_MANAGER as `0x${string}`,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'getSubscription',
    args: userAddress && workflowId > 0 ? [userAddress as `0x${string}`, BigInt(workflowId)] : undefined,
  })

  const subscription = useMemo(() => {
    if (!subscriptionData) return null
    
    return {
      user: subscriptionData.user,
      workflowId: Number(subscriptionData.workflowId),
      expiryTime: subscriptionData.expiryTime,
      isActive: subscriptionData.isActive,
      subscribedAt: subscriptionData.subscribedAt,
      lastRenewedAt: subscriptionData.lastRenewedAt,
    } as Subscription
  }, [subscriptionData])

  return {
    subscription,
    isLoading,
    error,
  }
}

// Hook to get user's active workflows
export function useUserActiveWorkflows(userAddress?: string) {
  const { data: workflowIds, isLoading, error } = useContractRead({
    address: MOCK_CONTRACT_ADDRESSES.SUBSCRIPTION_MANAGER as `0x${string}`,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'getUserActiveWorkflows',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  })

  return {
    activeWorkflowIds: workflowIds ? workflowIds.map(id => Number(id)) : [],
    isLoading,
    error,
  }
}