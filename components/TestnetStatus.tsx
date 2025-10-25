'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTestnetOperations, TESTNET_CONFIG } from '@/lib/testnet'
import { useAccount } from 'wagmi'

interface TestnetStatusProps {
  className?: string
}

export function TestnetStatus({ className = '' }: TestnetStatusProps) {
  const [status, setStatus] = useState<{
    isOnline: boolean
    blockNumber?: number
    chainId?: number
    rpcUrl?: string
    error?: string
  } | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const { checkTestnetStatus } = useTestnetOperations()
  const { isConnected, address } = useAccount()

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const result = await checkTestnetStatus()
      setStatus(result)
    } catch (error) {
      setStatus({
        isOnline: false,
        error: (error as Error).message,
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    if (TESTNET_CONFIG.enabled) {
      checkStatus()
    }
  }, [])

  if (!TESTNET_CONFIG.enabled) {
    return null
  }

  return (
    <Card className={`glass ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="w-5 h-5 text-blue-500" />
            Testnet Status
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkStatus}
            disabled={isChecking}
            className="p-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {status?.isOnline ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            {status?.isOnline ? 'Connected' : 'Disconnected'}
          </span>
          <Badge variant={status?.isOnline ? 'default' : 'destructive'}>
            {status?.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {status?.isOnline && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Chain ID:</span>
              <span className="font-mono">{status.chainId}</span>
            </div>
            <div className="flex justify-between">
              <span>Block:</span>
              <span className="font-mono">{status.blockNumber?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>RPC:</span>
              <span className="font-mono text-xs truncate max-w-[200px]">
                {status.rpcUrl}
              </span>
            </div>
          </div>
        )}

        {status?.error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertTriangle className="w-4 h-4" />
            <span>{status.error}</span>
          </div>
        )}

        {isConnected && address && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="w-4 h-4 text-green-500" />
              <span>Wallet Connected</span>
              <Badge variant="outline" className="text-xs">
                {address.slice(0, 6)}...{address.slice(-4)}
              </Badge>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open('https://sepolia.etherscan.io', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Testnet toggle component for workflows
interface TestnetToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  className?: string
}

export function TestnetToggle({ enabled, onToggle, className = '' }: TestnetToggleProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <TestTube className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium">Run on Testnet</span>
      </div>
      <Button
        variant={enabled ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle(!enabled)}
        className="min-w-[80px]"
      >
        {enabled ? 'Enabled' : 'Disabled'}
      </Button>
    </div>
  )
}

// Testnet execution button
interface TestnetExecutionButtonProps {
  workflowId: number
  executionData?: string
  onExecutionComplete?: (hash: string) => void
  className?: string
}

export function TestnetExecutionButton({ 
  workflowId, 
  executionData, 
  onExecutionComplete,
  className = '' 
}: TestnetExecutionButtonProps) {
  const { 
    executeWorkflowOnTestnet, 
    isExecuting, 
    isSuccess, 
    txData 
  } = useTestnetOperations()

  const handleExecute = async () => {
    try {
      const hash = await executeWorkflowOnTestnet(workflowId, executionData)
      if (hash && onExecutionComplete) {
        onExecutionComplete(hash)
      }
    } catch (error) {
      console.error('Execution failed:', error)
    }
  }

  return (
    <Button
      onClick={handleExecute}
      disabled={isExecuting || !TESTNET_CONFIG.enabled}
      className={`${className} ${isExecuting ? 'animate-pulse' : ''}`}
      variant="outline"
    >
      <TestTube className="w-4 h-4 mr-2" />
      {isExecuting ? 'Executing...' : 'Execute on Testnet'}
    </Button>
  )
}
