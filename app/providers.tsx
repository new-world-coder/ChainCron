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

// Forte testnet configuration
const forteTestnet = defineChain({
  id: 5245293,
  name: 'Forte Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.forte-chain.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.forte-chain.io' },
  },
  testnet: true,
})

const config = getDefaultConfig({
  appName: 'ChainCron',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default',
  chains: [forteTestnet],
  transports: {
    [forteTestnet.id]: http(),
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
      if (event.reason?.message?.includes('Connection interrupted') || 
          event.reason?.message?.includes('WalletConnect') ||
          event.reason?.message?.includes('subscribe')) {
        console.warn('WalletConnect connection interrupted, this is normal:', event.reason)
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
