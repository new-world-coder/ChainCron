'use client'

import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { defineChain } from 'viem'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'

// Ethereum Sepolia testnet configuration (Vercel-ready)
const sepoliaTestnet = defineChain({
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
})

// Contract addresses - these should be updated after deployment
const CONTRACT_ADDRESSES = {
  WORKFLOW_REGISTRY: process.env.NEXT_PUBLIC_WORKFLOW_REGISTRY_ADDRESS || '0x1234567890123456789012345678901234567890',
  SUBSCRIPTION_MANAGER: process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS || '0x1234567890123456789012345678901234567890',
  WORKFLOW_EXECUTOR: process.env.NEXT_PUBLIC_WORKFLOW_EXECUTOR_ADDRESS || '0x1234567890123456789012345678901234567890',
  PAYMENT_TOKEN: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || '0x1234567890123456789012345678901234567890',
} as const

// Testnet configuration
const TESTNET_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true' || process.env.NODE_ENV === 'development',
  rpcUrl: process.env.NEXT_PUBLIC_TESTNET_RPC_URL || 'https://rpc.sepolia.org',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
  isTestnetMode: process.env.NEXT_PUBLIC_TESTNET_MODE === 'true' || process.env.NODE_ENV === 'development',
}

// Mock ABI for testing - replace with actual contract ABI
export const MOCK_WORKFLOW_EXECUTOR_ABI = [
  {
    "inputs": [
      {"name": "workflowId", "type": "uint256"},
      {"name": "userAddress", "type": "address"},
      {"name": "executionData", "type": "bytes"}
    ],
    "name": "executeWorkflow",
    "outputs": [{"name": "success", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "workflowId", "type": "uint256"},
      {"indexed": true, "name": "userAddress", "type": "address"},
      {"indexed": false, "name": "success", "type": "bool"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "WorkflowExecuted",
    "type": "event"
  }
] as const

// Testnet utilities
export class TestnetUtils {
  private static instance: TestnetUtils
  private publicClient: any
  private walletClient: any

  private constructor() {
    this.publicClient = createPublicClient({
      chain: sepoliaTestnet,
      transport: http(TESTNET_CONFIG.rpcUrl),
    })
  }

  static getInstance(): TestnetUtils {
    if (!TestnetUtils.instance) {
      TestnetUtils.instance = new TestnetUtils()
    }
    return TestnetUtils.instance
  }

  // Get current block number
  async getCurrentBlock(): Promise<bigint> {
    try {
      return await this.publicClient.getBlockNumber()
    } catch (error) {
      console.error('Error getting current block:', error)
      throw error
    }
  }

  // Get balance of an address
  async getBalance(address: `0x${string}`): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({ address })
      return formatEther(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      throw error
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(hash: `0x${string}`) {
    try {
      return await this.publicClient.getTransactionReceipt({ hash })
    } catch (error) {
      console.error('Error getting transaction receipt:', error)
      throw error
    }
  }

  // Get logs for a specific contract
  async getContractLogs(
    contractAddress: `0x${string}`,
    fromBlock?: bigint,
    toBlock?: bigint
  ) {
    try {
      return await this.publicClient.getLogs({
        address: contractAddress,
        fromBlock: fromBlock || 'earliest',
        toBlock: toBlock || 'latest',
      })
    } catch (error) {
      console.error('Error getting contract logs:', error)
      throw error
    }
  }

  // Simulate transaction without sending
  async simulateTransaction(
    contractAddress: `0x${string}`,
    functionName: string,
    args: any[]
  ) {
    try {
      // In development mode with mock contracts, return a mock simulation result
      if (process.env.NODE_ENV === 'development') {
        return {
          request: {
            address: contractAddress,
            abi: MOCK_WORKFLOW_EXECUTOR_ABI,
            functionName,
            args,
          },
          result: true, // Mock successful simulation
        }
      }

      return await this.publicClient.simulateContract({
        address: contractAddress,
        abi: MOCK_WORKFLOW_EXECUTOR_ABI,
        functionName,
        args,
      })
    } catch (error) {
      console.error('Error simulating transaction:', error)
      throw error
    }
  }
}

// Hook for testnet operations
export function useTestnetOperations() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: txData, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txData,
  })

  const testnetUtils = TestnetUtils.getInstance()

  // Execute workflow on testnet
  const executeWorkflowOnTestnet = async (
    workflowId: number,
    executionData: string = '0x'
  ) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return null
    }

    if (!TESTNET_CONFIG.enabled) {
      toast.error('Testnet mode is not enabled')
      return null
    }

    try {
      // In development mode with mock contracts, skip simulation and just return a mock hash
      if (process.env.NODE_ENV === 'development') {
        const mockHash = `0x${Math.random().toString(36).substr(2, 64)}` as `0x${string}`
        toast.success('Workflow execution simulated successfully! (Development Mode)')
        return mockHash
      }

      // First simulate the transaction
      await testnetUtils.simulateTransaction(
        CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
        'executeWorkflow',
        [BigInt(workflowId), address, executionData as `0x${string}`]
      )

      // If simulation succeeds, execute the transaction
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
        abi: MOCK_WORKFLOW_EXECUTOR_ABI,
        functionName: 'executeWorkflow',
        args: [BigInt(workflowId), address, executionData as `0x${string}`],
      })

      toast.success('Workflow execution initiated on testnet!')
      return hash
    } catch (error) {
      console.error('Error executing workflow on testnet:', error)
      toast.error('Failed to execute workflow: ' + (error as Error).message)
      throw error
    }
  }

  // Get execution logs from testnet
  const getExecutionLogs = async (workflowId?: number) => {
    try {
      // In development mode, return mock logs
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            transactionHash: `0x${Math.random().toString(36).substr(2, 64)}`,
            blockNumber: BigInt(Math.floor(Math.random() * 1000000)),
            topics: [
              '0x' + Math.random().toString(36).substr(2, 64), // Event signature
              `0x${workflowId?.toString(16).padStart(64, '0') || '0'.repeat(64)}`, // Workflow ID
              `0x${'f39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.padStart(64, '0')}`, // User address
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001', // Success
          }
        ]
      }

      const logs = await testnetUtils.getContractLogs(
        CONTRACT_ADDRESSES.WORKFLOW_EXECUTOR as `0x${string}`,
        undefined,
        undefined
      )

      // Filter logs for WorkflowExecuted events
      const executionLogs = logs.filter((log: any) => 
        log.topics[0] === '0x' + // WorkflowExecuted event signature hash
        (workflowId ? log.topics[1] === `0x${workflowId.toString(16).padStart(64, '0')}` : true)
      )

      return executionLogs
    } catch (error) {
      console.error('Error getting execution logs:', error)
      throw error
    }
  }

  // Check if testnet is available
  const checkTestnetStatus = async () => {
    try {
      // In development mode, return mock status
      if (process.env.NODE_ENV === 'development') {
        return {
          isOnline: true,
          blockNumber: Math.floor(Math.random() * 1000000),
          chainId: TESTNET_CONFIG.chainId,
          rpcUrl: TESTNET_CONFIG.rpcUrl,
          mode: 'development',
        }
      }

      const blockNumber = await testnetUtils.getCurrentBlock()
      return {
        isOnline: true,
        blockNumber: Number(blockNumber),
        chainId: TESTNET_CONFIG.chainId,
        rpcUrl: TESTNET_CONFIG.rpcUrl,
      }
    } catch (error) {
      return {
        isOnline: false,
        error: (error as Error).message,
      }
    }
  }

  return {
    executeWorkflowOnTestnet,
    getExecutionLogs,
    checkTestnetStatus,
    isExecuting: isPending || isConfirming,
    isSuccess,
    isError,
    txData,
    error,
    isConnected,
    address,
  }
}

// Utility function to format execution logs
export function formatExecutionLog(log: any) {
  try {
    return {
      transactionHash: log.transactionHash,
      blockNumber: Number(log.blockNumber),
      timestamp: new Date(Number(log.blockNumber) * 12000), // Approximate timestamp
      workflowId: parseInt(log.topics[1], 16),
      userAddress: `0x${log.topics[2].slice(26)}`,
      success: log.data === '0x0000000000000000000000000000000000000000000000000000000000000001',
    }
  } catch (error) {
    console.error('Error formatting execution log:', error)
    return null
  }
}

// Export testnet configuration for use in components
export { TESTNET_CONFIG, CONTRACT_ADDRESSES, sepoliaTestnet }
