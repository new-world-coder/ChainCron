// Chain registry for multi-chain support
export interface ChainConfig {
  id: number
  name: string
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  gasToken: string
  dexRouters: string[]
  bridgeContracts: string[]
  isTestnet: boolean
  status: 'online' | 'offline' | 'maintenance'
  gasPrice?: string
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  forte: {
    id: 1,
    name: 'Forte',
    rpcUrl: 'https://rpc.forte-chain.io',
    blockExplorer: 'https://explorer.forte-chain.io',
    nativeCurrency: {
      name: 'Forte',
      symbol: 'FTE',
      decimals: 18,
    },
    gasToken: 'FTE',
    dexRouters: ['0x1234567890abcdef1234567890abcdef12345678'],
    bridgeContracts: ['0x2345678901bcdef1234567890abcdef1234567890'],
    isTestnet: true,
    status: 'online',
    gasPrice: '0.0001',
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    gasToken: 'ETH',
    dexRouters: ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'], // Uniswap V2
    bridgeContracts: ['0x3ee18B2214AFF97000D97cf8261a47f3CAA75a8f'], // Wormhole
    isTestnet: false,
    status: 'online',
    gasPrice: '0.002',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    gasToken: 'MATIC',
    dexRouters: ['0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'], // QuickSwap
    bridgeContracts: ['0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'], // Polygon Bridge
    isTestnet: false,
    status: 'online',
    gasPrice: '0.0001',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    gasToken: 'ETH',
    dexRouters: ['0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // SushiSwap
    bridgeContracts: ['0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'], // Arbitrum Bridge
    isTestnet: false,
    status: 'online',
    gasPrice: '0.0001',
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    gasToken: 'ETH',
    dexRouters: ['0xE592427A0AEce92De3Edee1F18E0157C05861564'], // Uniswap V3
    bridgeContracts: ['0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'], // Optimism Bridge
    isTestnet: false,
    status: 'online',
    gasPrice: '0.0001',
  },
  base: {
    id: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    gasToken: 'ETH',
    dexRouters: ['0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24'], // BaseSwap
    bridgeContracts: ['0x4200000000000000000000000000000000000010'], // Base Bridge
    isTestnet: false,
    status: 'online',
    gasPrice: '0.0001',
  },
}

export const CHAIN_LOGOS: Record<string, string> = {
  forte: '🔗',
  ethereum: '⟠',
  polygon: '⬟',
  arbitrum: '🔷',
  optimism: '🔴',
  base: '🔵',
}

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId)
}

export function getChainConfigByName(name: string): ChainConfig | undefined {
  return SUPPORTED_CHAINS[name.toLowerCase()]
}

export function getAllChains(): ChainConfig[] {
  return Object.values(SUPPORTED_CHAINS)
}

export function getOnlineChains(): ChainConfig[] {
  return getAllChains().filter(chain => chain.status === 'online')
}

export function getTestnetChains(): ChainConfig[] {
  return getAllChains().filter(chain => chain.isTestnet)
}

export function getMainnetChains(): ChainConfig[] {
  return getAllChains().filter(chain => !chain.isTestnet)
}

// Cross-chain workflow types
export interface CrossChainWorkflow {
  id: string
  name: string
  description: string
  steps: CrossChainStep[]
  estimatedTime: number // in minutes
  totalCost: {
    gas: Record<string, string> // chain -> gas cost
    bridgeFees: Record<string, string> // bridge -> fee
  }
  riskLevel: 'low' | 'medium' | 'high'
  successRate: number
}

export interface CrossChainStep {
  id: string
  chain: string
  action: 'bridge' | 'swap' | 'stake' | 'transfer' | 'monitor'
  description: string
  estimatedGas: string
  dependencies: string[]
  parameters: Record<string, any>
}

// Mock cross-chain workflows
export const MOCK_CROSS_CHAIN_WORKFLOWS: CrossChainWorkflow[] = [
  {
    id: 'bridge-and-stake',
    name: 'Bridge USDC from Ethereum to Polygon, then Stake',
    description: 'Automatically bridge USDC from Ethereum to Polygon and stake it in the highest yield protocol',
    steps: [
      {
        id: 'step1',
        chain: 'ethereum',
        action: 'bridge',
        description: 'Bridge USDC from Ethereum to Polygon',
        estimatedGas: '0.003 ETH',
        dependencies: [],
        parameters: { token: 'USDC', amount: '1000', targetChain: 'polygon' },
      },
      {
        id: 'step2',
        chain: 'polygon',
        action: 'stake',
        description: 'Stake USDC in Aave Polygon',
        estimatedGas: '0.001 MATIC',
        dependencies: ['step1'],
        parameters: { protocol: 'Aave', token: 'USDC', amount: '1000' },
      },
    ],
    estimatedTime: 15,
    totalCost: {
      gas: { ethereum: '0.003 ETH', polygon: '0.001 MATIC' },
      bridgeFees: { 'Polygon Bridge': '0.1%' },
    },
    riskLevel: 'medium',
    successRate: 94,
  },
  {
    id: 'multi-chain-monitor',
    name: 'Monitor Multi-Chain Balances',
    description: 'Monitor balances across all chains and consolidate when any chain exceeds $1000',
    steps: [
      {
        id: 'monitor1',
        chain: 'ethereum',
        action: 'monitor',
        description: 'Monitor ETH balance on Ethereum',
        estimatedGas: '0.0001 ETH',
        dependencies: [],
        parameters: { token: 'ETH', threshold: '1000' },
      },
      {
        id: 'monitor2',
        chain: 'polygon',
        action: 'monitor',
        description: 'Monitor MATIC balance on Polygon',
        estimatedGas: '0.0001 MATIC',
        dependencies: [],
        parameters: { token: 'MATIC', threshold: '1000' },
      },
      {
        id: 'consolidate',
        chain: 'ethereum',
        action: 'transfer',
        description: 'Consolidate funds to Ethereum',
        estimatedGas: '0.002 ETH',
        dependencies: ['monitor1', 'monitor2'],
        parameters: { targetChain: 'ethereum' },
      },
    ],
    estimatedTime: 5,
    totalCost: {
      gas: { ethereum: '0.0021 ETH', polygon: '0.0001 MATIC' },
      bridgeFees: {},
    },
    riskLevel: 'low',
    successRate: 98,
  },
  {
    id: 'arbitrage-workflow',
    name: 'Cross-Chain Arbitrage',
    description: 'Detect price differences between chains and execute arbitrage trades',
    steps: [
      {
        id: 'detect',
        chain: 'ethereum',
        action: 'monitor',
        description: 'Monitor token prices across chains',
        estimatedGas: '0.0001 ETH',
        dependencies: [],
        parameters: { token: 'USDC', priceThreshold: '0.5%' },
      },
      {
        id: 'buy',
        chain: 'polygon',
        action: 'swap',
        description: 'Buy token on cheaper chain',
        estimatedGas: '0.002 MATIC',
        dependencies: ['detect'],
        parameters: { token: 'USDC', amount: '1000' },
      },
      {
        id: 'bridge',
        chain: 'polygon',
        action: 'bridge',
        description: 'Bridge token to Ethereum',
        estimatedGas: '0.001 MATIC',
        dependencies: ['buy'],
        parameters: { token: 'USDC', targetChain: 'ethereum' },
      },
      {
        id: 'sell',
        chain: 'ethereum',
        action: 'swap',
        description: 'Sell token on Ethereum',
        estimatedGas: '0.003 ETH',
        dependencies: ['bridge'],
        parameters: { token: 'USDC', amount: '1000' },
      },
    ],
    estimatedTime: 25,
    totalCost: {
      gas: { ethereum: '0.0031 ETH', polygon: '0.003 MATIC' },
      bridgeFees: { 'Polygon Bridge': '0.1%' },
    },
    riskLevel: 'high',
    successRate: 87,
  },
]
