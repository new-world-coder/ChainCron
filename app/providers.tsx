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

const config = getDefaultConfig({
  appName: 'ChainCron',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default',
  chains: [sepoliaTestnet],
  transports: {
    [sepoliaTestnet.id]: http(),
  },
})

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
