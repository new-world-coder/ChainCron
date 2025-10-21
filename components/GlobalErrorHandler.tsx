'use client'

import { useEffect } from 'react'

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason) || ''
      const errorStack = event.reason?.stack || ''
      
      // Check if it's a WalletConnect related error
      if (errorMessage.includes('Connection interrupted') || 
          errorMessage.includes('WalletConnect') ||
          errorMessage.includes('subscribe') ||
          errorMessage.includes('WebSocket') ||
          errorMessage.includes('jsonrpc-provider') ||
          errorMessage.includes('ws-connection') ||
          errorMessage.includes('EventEmitter') ||
          errorMessage.includes('onClose') ||
          errorMessage.includes('onclose') ||
          errorStack.includes('@walletconnect') ||
          errorStack.includes('@reown') ||
          errorStack.includes('appkit')) {
        console.warn('Wallet connection interrupted (this is normal):', errorMessage)
        event.preventDefault() // Prevent the error from showing in console
        return
      }
      
      // Check if it's a network related error
      if (errorMessage.includes('Network') ||
          errorMessage.includes('fetch') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('Failed to fetch')) {
        console.warn('Network error (this may be temporary):', errorMessage)
        event.preventDefault()
        return
      }
      
      // Check if it's a Reown/AppKit configuration error
      if (errorMessage.includes('Failed to fetch remote project configuration') ||
          errorMessage.includes('HTTP status code: 403') ||
          errorMessage.includes('api.web3modal.org')) {
        console.warn('Wallet configuration error (using local defaults):', errorMessage)
        event.preventDefault()
        return
      }
      
      // Log other errors but don't prevent them
      console.error('Unhandled promise rejection:', event.reason)
    }

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || ''
      const errorStack = event.error?.stack || ''
      
      // Check if it's a WalletConnect related error
      if (errorMessage.includes('Connection interrupted') || 
          errorMessage.includes('WalletConnect') ||
          errorMessage.includes('subscribe') ||
          errorMessage.includes('WebSocket') ||
          errorMessage.includes('jsonrpc-provider') ||
          errorMessage.includes('ws-connection') ||
          errorMessage.includes('EventEmitter') ||
          errorMessage.includes('onClose') ||
          errorMessage.includes('onclose') ||
          errorStack.includes('@walletconnect') ||
          errorStack.includes('@reown') ||
          errorStack.includes('appkit')) {
        console.warn('Wallet connection error (this is normal):', errorMessage)
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
