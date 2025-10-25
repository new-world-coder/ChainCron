export type UserRole = 'creator' | 'subscriber' | 'admin'

export interface User {
  id: string
  address?: string // Wallet address for Web3 users
  email?: string // Email for social login users
  name?: string
  role: UserRole
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
  profile?: {
    bio?: string
    avatar?: string
    website?: string
  }
}

export interface AuthSession {
  user: User
  expires: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SocialLoginProvider {
  id: string
  name: string
  type: 'oauth' | 'oauth-popup'
}

export interface AdminCredentials {
  email: string
  password: string
  mfaCode?: string
}

// Whitelisted admin addresses for on-chain admin privileges
export const ADMIN_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Example admin address
  // Add more admin addresses as needed
]

// Default admin credentials for development
export const DEFAULT_ADMIN = {
  email: 'admin@chaincron.com',
  password: 'admin123!', // In production, this should be set via environment variables
}
