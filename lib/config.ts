// Configuration with error handling and safe defaults

interface AppConfig {
  walletConnect: {
    projectId: string
    enabled: boolean
  }
  chain: {
    id: number
    name: string
    rpcUrl: string
  }
}

const getConfig = (): AppConfig => {
  // Safe defaults - always return a valid config
  const defaultConfig: AppConfig = {
    walletConnect: {
      projectId: 'default',
      enabled: false,
    },
    chain: {
      id: 11155111, // Sepolia
      name: 'Sepolia',
      rpcUrl: 'https://rpc.sepolia.org',
    },
  }

  try {
    // Try to get WalletConnect project ID from environment
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    
    if (projectId && projectId !== 'default' && projectId.trim() !== '') {
      return {
        ...defaultConfig,
        walletConnect: {
          projectId: projectId.trim(),
          enabled: true,
        },
      }
    }
  } catch (error) {
    console.warn('Config initialization failed, using defaults:', error)
  }

  return defaultConfig
}

export const appConfig = getConfig()

// Export a function to get config safely in components
export const getAppConfig = () => appConfig
