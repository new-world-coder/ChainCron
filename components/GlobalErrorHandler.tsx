'use client'

import { useEffect } from 'react'

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if it's a WalletConnect related error
      if (event.reason?.message?.includes('Connection interrupted') || 
          event.reason?.message?.includes('WalletConnect') ||
          event.reason?.message?.includes('subscribe') ||
          event.reason?.message?.includes('WebSocket')) {
        console.warn('Wallet connection interrupted (this is normal):', event.reason?.message)
        event.preventDefault() // Prevent the error from showing in console
        return
      }
      
      // Check if it's a network related error
      if (event.reason?.message?.includes('Network') ||
          event.reason?.message?.includes('fetch') ||
          event.reason?.message?.includes('timeout')) {
        console.warn('Network error (this may be temporary):', event.reason?.message)
        event.preventDefault()
        return
      }
      
      // Log other errors but don't prevent them
      console.error('Unhandled promise rejection:', event.reason)
    }

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      // Check if it's a WalletConnect related error
      if (event.message?.includes('Connection interrupted') || 
          event.message?.includes('WalletConnect') ||
          event.message?.includes('subscribe') ||
          event.message?.includes('WebSocket')) {
        console.warn('Wallet connection error (this is normal):', event.message)
        event.preventDefault()
        return
      }
      
      // Log other errors
      console.error('Uncaught error:', event.error)
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)
    
    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null // This component doesn't render anything
}
