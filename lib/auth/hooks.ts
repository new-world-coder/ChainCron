'use client'

import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { UserRole, User } from './types'
import { getUserRoleFromAddress, isAdminAddress } from './config'

export function useAuth() {
  const { data: session, status } = useSession()
  const { address, isConnected } = useAccount()
  
  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user || isConnected
  
  // Determine user role
  let userRole: UserRole = 'subscriber'
  let user: User | null = null
  
  if (session?.user) {
    // Social login user
    userRole = session.user.role || 'subscriber'
    user = {
      id: session.user.id,
      email: session.user.email || undefined,
      name: session.user.name || undefined,
      role: userRole,
      createdAt: new Date(),
      isActive: true,
    }
  } else if (isConnected && address) {
    // Web3 wallet user
    userRole = getUserRoleFromAddress(address)
    user = {
      id: address,
      address,
      role: userRole,
      createdAt: new Date(),
      isActive: true,
    }
  }
  
  return {
    user,
    userRole,
    isAuthenticated,
    isLoading,
    isConnected,
    address,
    session,
  }
}

export function useRole() {
  const { userRole } = useAuth()
  
  return {
    isAdmin: userRole === 'admin',
    isCreator: userRole === 'creator' || userRole === 'admin',
    isSubscriber: userRole === 'subscriber' || userRole === 'creator' || userRole === 'admin',
    role: userRole,
  }
}

export function usePermissions() {
  const { userRole } = useAuth()
  
  return {
    canCreateWorkflows: userRole === 'creator' || userRole === 'admin',
    canManageUsers: userRole === 'admin',
    canAccessAdminPanel: userRole === 'admin',
    canViewAnalytics: userRole === 'creator' || userRole === 'admin',
    canSubscribeToWorkflows: userRole === 'subscriber' || userRole === 'creator' || userRole === 'admin',
  }
}
