'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Eye,
  Shield,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Users,
  TrendingUp,
  Activity,
  BarChart3,
  Globe,
  Lock,
  Unlock,
  FileText,
  Award,
  Star,
  Zap,
  DollarSign,
  Hash,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Mock data for transparency dashboard
const mockTransparencyData = {
  liveExecutions: [
    {
      id: 1,
      timestamp: '2024-06-15 14:30:25',
      workflow: 'Auto-Compound DeFi Yields',
      user: '0x742d...35Cc',
      action: 'Compound USDC rewards',
      result: 'Success',
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      gasUsed: '0.0021 ETH',
      profit: '$45.20',
      blockNumber: 18543210,
    },
    {
      id: 2,
      timestamp: '2024-06-15 14:28:15',
      workflow: 'Portfolio Rebalancer',
      user: '0xAb58...01a7',
      action: 'Rebalance to target allocation',
      result: 'Success',
      txHash: '0x2345678901bcdef1234567890abcdef1234567890',
      gasUsed: '0.0032 ETH',
      profit: '$8.50',
      blockNumber: 18543208,
    },
    {
      id: 3,
      timestamp: '2024-06-15 14:25:42',
      workflow: 'Price Alert Trader',
      user: '0x742d...35Cc',
      action: 'Swap ETH to USDC',
      result: 'Success',
      txHash: '0x3456789012cdef1234567890abcdef1234567890',
      gasUsed: '0.0018 ETH',
      profit: '$12.80',
      blockNumber: 18543205,
    },
    {
      id: 4,
      timestamp: '2024-06-15 14:22:33',
      workflow: 'DCA Strategy',
      user: '0xCd67...89eF',
      action: 'Buy ETH with USDC',
      result: 'Failed',
      txHash: '0x4567890123def1234567890abcdef1234567890',
      gasUsed: '0.0015 ETH',
      profit: '$0.00',
      blockNumber: 18543202,
      error: 'Insufficient balance',
    },
  ],
  
  smartContracts: [
    {
      name: 'WorkflowRegistry',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      auditStatus: 'Audited by CertiK',
      tvl: '$2.5M',
      securityScore: 'A+',
      lastUpdated: '2024-06-15 14:30:00',
      verified: true,
    },
    {
      name: 'SubscriptionManager',
      address: '0x2345678901bcdef1234567890abcdef1234567890',
      auditStatus: 'Audited by OpenZeppelin',
      tvl: '$1.8M',
      securityScore: 'A',
      lastUpdated: '2024-06-15 14:25:00',
      verified: true,
    },
    {
      name: 'WorkflowExecutor',
      address: '0x3456789012cdef1234567890abcdef1234567890',
      auditStatus: 'Audited by ConsenSys',
      tvl: '$3.2M',
      securityScore: 'A+',
      lastUpdated: '2024-06-15 14:20:00',
      verified: true,
    },
  ],
  
  platformMetrics: {
    totalWorkflows: 1247,
    totalSubscribers: 8942,
    totalExecutions: 156789,
    totalValueAutomated: 125000000,
    averageSuccessRate: 97.8,
    averageGasSaved: 44.7,
    topWorkflows: [
      { name: 'Auto-Compound DeFi Yields', subscribers: 2847, revenue: 125000 },
      { name: 'Portfolio Rebalancer', subscribers: 1923, revenue: 89000 },
      { name: 'Price Alert Trader', subscribers: 1654, revenue: 67000 },
      { name: 'DCA Strategy', subscribers: 1432, revenue: 45000 },
      { name: 'Liquidation Protection', subscribers: 1086, revenue: 32000 },
    ],
  },
  
  creatorVerification: [
    {
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      name: 'DeFiMaster',
      reputation: 98,
      workflows: 12,
      subscribers: 2847,
      revenue: 125000,
      verified: true,
      badges: ['Top Creator', 'Verified', 'Audited'],
      joinDate: '2023-08-15',
    },
    {
      address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      name: 'YieldOptimizer',
      reputation: 94,
      workflows: 8,
      subscribers: 1923,
      revenue: 89000,
      verified: true,
      badges: ['Rising Star', 'Verified'],
      joinDate: '2023-10-22',
    },
    {
      address: '0xCd6789eF0123456789abcdef0123456789abcdef',
      name: 'TradingBot',
      reputation: 89,
      workflows: 15,
      subscribers: 1654,
      revenue: 67000,
      verified: false,
      badges: ['Active Creator'],
      joinDate: '2023-12-05',
    },
  ],
  
  executionProofs: [
    {
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      workflowId: 1,
      inputParams: {
        token: 'USDC',
        amount: '1000',
        protocol: 'Aave',
      },
      outputResults: {
        rewards: '45.20',
        gasUsed: '0.0021',
        success: true,
      },
      blockNumber: 18543210,
      timestamp: '2024-06-15 14:30:25',
      verified: true,
    },
    {
      txHash: '0x2345678901bcdef1234567890abcdef1234567890',
      workflowId: 2,
      inputParams: {
        targetAllocation: '60% ETH, 40% USDC',
        threshold: '5%',
      },
      outputResults: {
        rebalanced: true,
        gasUsed: '0.0032',
        success: true,
      },
      blockNumber: 18543208,
      timestamp: '2024-06-15 14:28:15',
      verified: true,
    },
  ],
}

export default function TransparencyPage() {
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [selectedContract, setSelectedContract] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [verificationTxHash, setVerificationTxHash] = useState('')

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const handleVerifyExecution = () => {
    if (!verificationTxHash.trim()) {
      toast.error('Please enter a transaction hash')
      return
    }
    
    // Mock verification
    toast.success('Execution verified! Check the details below.')
    console.log('Verifying execution:', verificationTxHash)
  }

  const handleViewOnExplorer = (txHash: string) => {
    // In a real app, this would open the block explorer
    window.open(`https://explorer.forte-chain.io/tx/${txHash}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Transparency Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Live execution monitoring and on-chain verification
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isLiveMode ? 'default' : 'outline'}
                onClick={() => setIsLiveMode(!isLiveMode)}
              >
                {isLiveMode ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isLiveMode ? 'Live Mode' : 'Paused'}
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Workflows</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {mockTransparencyData.platformMetrics.totalWorkflows.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Subscribers</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {mockTransparencyData.platformMetrics.totalSubscribers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Executions</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {mockTransparencyData.platformMetrics.totalExecutions.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Value Automated</h3>
                    <p className="text-2xl font-bold text-orange-600">
                      ${(mockTransparencyData.platformMetrics.totalValueAutomated / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Execution Monitor */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Execution Monitor
              {isLiveMode && (
                <Badge variant="secondary" className="ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  Live
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransparencyData.liveExecutions.map((execution) => (
                <motion.div
                  key={execution.id}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    execution.result === 'Success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{execution.workflow}</span>
                      <Badge variant={execution.result === 'Success' ? 'default' : 'destructive'}>
                        {execution.result}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {execution.action} • {execution.user} • Block #{execution.blockNumber}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      {execution.profit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {execution.gasUsed}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyAddress(execution.txHash)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOnExplorer(execution.txHash)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Contract Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Smart Contract Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTransparencyData.smartContracts.map((contract) => (
                <div key={contract.name} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{contract.name}</h3>
                    <Badge variant={contract.verified ? 'default' : 'secondary'}>
                      {contract.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-mono text-xs">
                        {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Audit:</span>
                      <span className="text-green-600">{contract.auditStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TVL:</span>
                      <span className="font-medium">{contract.tvl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security:</span>
                      <Badge variant="outline" className="text-green-600">
                        {contract.securityScore}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAddress(contract.address)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOnExplorer(contract.address)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Explorer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Creator Verification System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Creator Verification System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransparencyData.creatorVerification.map((creator) => (
                <div key={creator.address} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{creator.name}</span>
                      {creator.verified && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="flex gap-1">
                        {creator.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {creator.address} • Joined {creator.joinDate}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm">
                      <div>Reputation: {creator.reputation}/100</div>
                      <div>{creator.workflows} workflows</div>
                      <div>{creator.subscribers.toLocaleString()} subscribers</div>
                      <div>${creator.revenue.toLocaleString()} revenue</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Execution Proof System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Execution Proof System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Verification Tool */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-3">Verify Execution</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter transaction hash to verify"
                    value={verificationTxHash}
                    onChange={(e) => setVerificationTxHash(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleVerifyExecution}>
                    <Search className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </div>

              {/* Recent Proofs */}
              <div className="space-y-4">
                <h3 className="font-semibold">Recent Execution Proofs</h3>
                {mockTransparencyData.executionProofs.map((proof) => (
                  <div key={proof.txHash} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span className="font-mono text-sm">
                          {proof.txHash.slice(0, 10)}...{proof.txHash.slice(-10)}
                        </span>
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Block #{proof.blockNumber}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Input Parameters</h4>
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(proof.inputParams).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Output Results</h4>
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(proof.outputResults).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyAddress(proof.txHash)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Hash
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOnExplorer(proof.txHash)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
