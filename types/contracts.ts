// Contract types for Forte Cron
export interface Workflow {
  id: number;
  name: string;
  description: string;
  creator: string;
  price: bigint;
  category: string;
  isActive: boolean;
  createdAt: bigint;
}

export interface Subscription {
  user: string;
  workflowId: number;
  expiryTime: bigint;
  isActive: boolean;
  subscribedAt: bigint;
  lastRenewedAt: bigint;
}

export interface Execution {
  workflowId: number;
  user: string;
  executor: string;
  timestamp: bigint;
  executionHash: string;
  success: boolean;
  resultData: string;
  gasUsed: bigint;
}

// Contract addresses (will be populated after deployment)
export const CONTRACT_ADDRESSES = {
  WORKFLOW_REGISTRY: '',
  SUBSCRIPTION_MANAGER: '',
  WORKFLOW_EXECUTOR: '',
  PAYMENT_TOKEN: '',
} as const;

// Contract ABIs (simplified versions for frontend)
export const WORKFLOW_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'creator', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'category', type: 'string' }
    ],
    name: 'registerWorkflow',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'workflowId', type: 'uint256' }],
    name: 'getWorkflow',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'category', type: 'string' },
          { name: 'isActive', type: 'bool' },
          { name: 'createdAt', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'creator', type: 'address' }],
    name: 'getWorkflowsByCreator',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'category', type: 'string' }],
    name: 'getWorkflowsByCategory',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalWorkflows',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export const SUBSCRIPTION_MANAGER_ABI = [
  {
    inputs: [
      { name: 'workflowId', type: 'uint256' },
      { name: 'price', type: 'uint256' }
    ],
    name: 'subscribe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'workflowId', type: 'uint256' },
      { name: 'price', type: 'uint256' }
    ],
    name: 'renew',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'workflowId', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'workflowId', type: 'uint256' }
    ],
    name: 'isSubscriptionActive',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'workflowId', type: 'uint256' }
    ],
    name: 'getSubscription',
    outputs: [
      {
        components: [
          { name: 'user', type: 'address' },
          { name: 'workflowId', type: 'uint256' },
          { name: 'expiryTime', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
          { name: 'subscribedAt', type: 'uint256' },
          { name: 'lastRenewedAt', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserActiveWorkflows',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export const WORKFLOW_EXECUTOR_ABI = [
  {
    inputs: [
      { name: 'workflowId', type: 'uint256' },
      { name: 'user', type: 'address' },
      { name: 'executionData', type: 'bytes' }
    ],
    name: 'executeWorkflow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'executionHash', type: 'bytes32' }],
    name: 'getExecution',
    outputs: [
      {
        components: [
          { name: 'workflowId', type: 'uint256' },
          { name: 'user', type: 'address' },
          { name: 'executor', type: 'address' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'executionHash', type: 'bytes32' },
          { name: 'success', type: 'bool' },
          { name: 'resultData', type: 'bytes' },
          { name: 'gasUsed', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'workflowId', type: 'uint256' }],
    name: 'getWorkflowExecutions',
    outputs: [{ name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserExecutions',
    outputs: [{ name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
