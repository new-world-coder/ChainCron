import type { Workflow } from '@/types/contracts'

export const mockWorkflows: Workflow[] = [
  {
    id: 1,
    name: "Auto-Compound DeFi Yield",
    description: "Automatically compound your yield farming rewards every 24 hours to maximize your returns. Works with major DeFi protocols like Aave, Compound, and Uniswap V3.",
    creator: "0x1234567890123456789012345678901234567890",
    price: BigInt("500000000000000000"), // 0.5 ETH
    category: "DeFi",
    isActive: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 7), // 7 days ago
  },
  {
    id: 2,
    name: "Portfolio Rebalancer",
    description: "Maintain optimal 50/50 allocation between ETH and USDC. Automatically rebalances when drift exceeds 5%, optimizing for gas efficiency.",
    creator: "0x2345678901234567890123456789012345678901",
    price: BigInt("750000000000000000"), // 0.75 ETH
    category: "Trading",
    isActive: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 5), // 5 days ago
  },
  {
    id: 3,
    name: "Gas Price Optimizer",
    description: "Execute transactions when gas prices drop below your threshold. Perfect for batch operations and cost-sensitive trading strategies.",
    creator: "0x3456789012345678901234567890123456789012",
    price: BigInt("300000000000000000"), // 0.3 ETH
    category: "Utility",
    isActive: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 3), // 3 days ago
  },
  {
    id: 4,
    name: "Token Price Alert + Auto-Swap",
    description: "Set conditional alerts for token prices and automatically execute swaps when conditions are met. Supports multiple tokens and custom logic.",
    creator: "0x4567890123456789012345678901234567890123",
    price: BigInt("600000000000000000"), // 0.6 ETH
    category: "Trading",
    isActive: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2), // 2 days ago
  },
  {
    id: 5,
    name: "DAO Governance Auto-Voter",
    description: "Automatically vote on governance proposals based on your preferences and delegate's recommendations. Never miss important DAO decisions.",
    creator: "0x5678901234567890123456789012345678901234",
    price: BigInt("400000000000000000"), // 0.4 ETH
    category: "Governance",
    isActive: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 1), // 1 day ago
  },
]

export const categories = [
  { id: 'all', name: 'All Categories', count: mockWorkflows.length },
  { id: 'DeFi', name: 'DeFi', count: mockWorkflows.filter(w => w.category === 'DeFi').length },
  { id: 'Trading', name: 'Trading', count: mockWorkflows.filter(w => w.category === 'Trading').length },
  { id: 'Utility', name: 'Utility', count: mockWorkflows.filter(w => w.category === 'Utility').length },
  { id: 'Governance', name: 'Governance', count: mockWorkflows.filter(w => w.category === 'Governance').length },
  { id: 'NFT', name: 'NFT', count: 0 },
]

export const getWorkflowById = (id: number): Workflow | undefined => {
  return mockWorkflows.find(w => w.id === id)
}

export const getWorkflowsByCategory = (category: string): Workflow[] => {
  if (category === 'all') return mockWorkflows
  return mockWorkflows.filter(w => w.category === category)
}

export const searchWorkflows = (query: string): Workflow[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockWorkflows.filter(w => 
    w.name.toLowerCase().includes(lowercaseQuery) ||
    w.description.toLowerCase().includes(lowercaseQuery) ||
    w.category.toLowerCase().includes(lowercaseQuery)
  )
}
