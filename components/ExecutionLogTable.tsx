'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Hash,
  User,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useTestnetOperations, formatExecutionLog } from '@/lib/testnet'

interface ExecutionLog {
  transactionHash: string
  blockNumber: number
  timestamp: Date
  workflowId: number
  userAddress: string
  success: boolean
}

interface ExecutionLogTableProps {
  workflowId?: number
  className?: string
}

export function ExecutionLogTable({ workflowId, className = '' }: ExecutionLogTableProps) {
  const [logs, setLogs] = useState<ExecutionLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'success' | 'failed'>('all')
  const { getExecutionLogs } = useTestnetOperations()

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const rawLogs = await getExecutionLogs(workflowId)
      const formattedLogs = rawLogs
        .map((log: any) => formatExecutionLog(log))
        .filter((log: ExecutionLog | null) => log !== null) as ExecutionLog[]
      
      setLogs(formattedLogs)
    } catch (error) {
      console.error('Error fetching execution logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [workflowId])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.workflowId.toString().includes(searchTerm)
    
    const matchesFilter = 
      filterSuccess === 'all' ||
      (filterSuccess === 'success' && log.success) ||
      (filterSuccess === 'failed' && !log.success)
    
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? 'default' : 'destructive'}>
        {success ? 'Success' : 'Failed'}
      </Badge>
    )
  }

  return (
    <Card className={`glass ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Execution Logs
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by hash, address, or workflow ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterSuccess}
              onChange={(e) => setFilterSuccess(e.target.value as 'all' | 'success' | 'failed')}
              className="px-3 py-1 border rounded-md bg-background text-sm"
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No execution logs found</p>
            <p className="text-sm">Execute a workflow to see logs here</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.transactionHash}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.success)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {log.transactionHash.slice(0, 10)}...{log.transactionHash.slice(-8)}
                          </span>
                          {getStatusBadge(log.success)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Block #{log.blockNumber.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://explorer.forte-chain.io/tx/${log.transactionHash}`, '_blank')}
                      className="p-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Workflow ID:</span>
                      <span className="font-mono">{log.workflowId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">User:</span>
                      <span className="font-mono text-xs">
                        {log.userAddress.slice(0, 6)}...{log.userAddress.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span>{log.timestamp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Status:</span>
                      <span className={log.success ? 'text-green-500' : 'text-red-500'}>
                        {log.success ? 'Completed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {filteredLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} execution logs
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for dashboard
export function ExecutionLogSummary({ workflowId, className = '' }: ExecutionLogTableProps) {
  const [logs, setLogs] = useState<ExecutionLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { getExecutionLogs } = useTestnetOperations()

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const rawLogs = await getExecutionLogs(workflowId)
      const formattedLogs = rawLogs
        .map((log: any) => formatExecutionLog(log))
        .filter((log: ExecutionLog | null) => log !== null) as ExecutionLog[]
      
      setLogs(formattedLogs.slice(0, 5)) // Show only last 5
    } catch (error) {
      console.error('Error fetching execution logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [workflowId])

  const successCount = logs.filter(log => log.success).length
  const failureCount = logs.filter(log => !log.success).length

  return (
    <Card className={`glass ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Recent Executions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-1"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No executions yet
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{successCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>{failureCount}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {logs.length} total
              </Badge>
            </div>
            
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.transactionHash} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {log.success ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className="font-mono">
                      {log.transactionHash.slice(0, 8)}...
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {log.timestamp.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
