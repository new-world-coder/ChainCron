'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { Toaster } from 'sonner'
import { defineChain } from 'viem'
import { http } from 'wagmi'
import { useEffect } from 'react'
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler'
import { appConfig } from '@/lib/config'

// Ethereum Sepolia testnet configuration (Vercel-ready)
// Using Alchemy as primary RPC with multiple fallbacks for reliability
const sepoliaTestnet = defineChain({
  id: appConfig.chain.id,
  name: appConfig.chain.name,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [
        appConfig.chain.rpcUrl, // Public RPC - CORS compatible
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
})

// Ensure we use Sepolia for production/Vercel
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL

// Explicitly configure to prevent auto-detection of local networks
// Use safe config with error handling
let config: ReturnType<typeof getDefaultConfig>
try {
  config = getDefaultConfig({
    appName: 'ChainCron',
    projectId: appConfig.walletConnect.projectId,
    chains: [sepoliaTestnet],
    transports: {
      [sepoliaTestnet.id]: http(appConfig.chain.rpcUrl, {
        retryCount: 3,
        retryDelay: 1000,
      }),
    },
    ssr: true,
    // Disable auto-detection of local networks
    syncConnectedChain: false,
  })
} catch (error) {
  // Fallback config if initialization fails
  console.warn('Failed to initialize wallet config, using minimal config:', error)
  config = getDefaultConfig({
    appName: 'ChainCron',
    projectId: 'default',
    chains: [sepoliaTestnet],
    ssr: true,
    syncConnectedChain: false,
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Error boundary component for wallet connection errors
function WalletErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Handle unhandled promise rejections from WalletConnect
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason) || ''
      const errorStack = event.reason?.stack || ''
      
      if (errorMessage.includes('Connection interrupted') || 
          errorMessage.includes('WalletConnect') ||
          errorMessage.includes('subscribe') ||
          errorMessage.includes('jsonrpc-provider') ||
          errorMessage.includes('ws-connection') ||
          errorMessage.includes('WebSocket') ||
          errorMessage.includes('EventEmitter') ||
          errorMessage.includes('onClose') ||
          errorMessage.includes('onclose') ||
          errorStack.includes('@walletconnect') ||
          errorStack.includes('@reown') ||
          errorStack.includes('appkit') ||
          errorMessage.includes('Failed to fetch remote project configuration') ||
          errorMessage.includes('HTTP status code: 403') ||
          errorMessage.includes('api.web3modal.org')) {
        console.warn('WalletConnect connection interrupted, this is normal:', errorMessage)
        event.preventDefault() // Prevent the error from showing in console
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Log chain configuration for debugging
    console.log('🔗 ChainCron Network Configuration:')
    console.log('- Chain ID:', sepoliaTestnet.id)
    console.log('- Chain Name:', sepoliaTestnet.name)
    console.log('- RPC URL:', 'https://rpc.sepolia.org')
    console.log('- Block Explorer:', 'https://sepolia.etherscan.io')
    console.log('- Environment:', process.env.NODE_ENV)
    console.log('- Vercel:', process.env.VERCEL ? 'Yes' : 'No')
    
    // Warn users if they're trying to connect to localhost
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.warn('⚠️ You are on a Vercel deployment. Make sure Sepolia network is added to MetaMask.')
      console.warn('⚠️ If you see "Hardhat Local" errors, add Sepolia network and switch to it.')
    }
  }, [])

  return (
    <WalletErrorBoundary>
      <GlobalErrorHandler />
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            showRecentTransactions={true}
            appInfo={{
              appName: 'ChainCron',
              learnMoreUrl: 'https://chaincron.com',
            }}
          >
            {children}
            <Toaster 
              position="top-right" 
              richColors 
              expand={true}
              duration={4000}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </WalletErrorBoundary>
  )
}
