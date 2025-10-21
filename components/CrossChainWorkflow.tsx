'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Info,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CrossChainWorkflow, MOCK_CROSS_CHAIN_WORKFLOWS } from '@/lib/chains/registry'
import { CHAIN_LOGOS } from '@/lib/chains/registry'

interface CrossChainWorkflowProps {
  workflow: CrossChainWorkflow
  onExecute?: (workflow: CrossChainWorkflow) => void
  onConfigure?: (workflow: CrossChainWorkflow) => void
  isExecuting?: boolean
  className?: string
}

export function CrossChainWorkflowCard({
  workflow,
  onExecute,
  onConfigure,
  isExecuting = false,
  className = '',
}: CrossChainWorkflowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'bridge': return '🌉'
      case 'swap': return '🔄'
      case 'stake': return '📈'
      case 'transfer': return '💸'
      case 'monitor': return '👁️'
      default: return '⚡'
    }
  }

  const totalCost = Object.values(workflow.totalCost.gas).reduce((sum, cost) => {
    const numericCost = parseFloat(cost.split(' ')[0])
    return sum + numericCost
  }, 0)

  const bridgeFees = Object.values(workflow.totalCost.bridgeFees).reduce((sum, fee) => {
    const numericFee = parseFloat(fee.replace('%', ''))
    return sum + numericFee
  }, 0)

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{workflow.name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{workflow.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>~${totalCost.toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>{workflow.successRate}% success</span>
              </div>
              <Badge className={getRiskColor(workflow.riskLevel)}>
                {workflow.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Details'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure?.(workflow)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onExecute?.(workflow)}
              disabled={isExecuting}
              className="bg-primary hover:bg-primary/90"
            >
              {isExecuting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {/* Workflow Steps */}
            <div>
              <h4 className="font-semibold mb-3">Workflow Steps</h4>
              <div className="space-y-3">
                {workflow.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`p-3 rounded-lg border ${
                      index === currentStep
                        ? 'border-primary bg-primary/5'
                        : index < currentStep
                        ? 'border-green-200 bg-green-50'
                        : 'border-border'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index < currentStep ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getActionIcon(step.action)}</span>
                          <span className="font-medium">{step.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {CHAIN_LOGOS[step.chain]} {step.chain}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Gas: {step.estimatedGas} • Action: {step.action}
                        </div>
                      </div>
                      
                      {index < workflow.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h4 className="font-semibold mb-3">Cost Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-2">Gas Costs</h5>
                  <div className="space-y-1 text-sm">
                    {Object.entries(workflow.totalCost.gas).map(([chain, cost]) => (
                      <div key={chain} className="flex justify-between">
                        <span>{CHAIN_LOGOS[chain]} {chain}</span>
                        <span className="font-mono">{cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-2">Bridge Fees</h5>
                  <div className="space-y-1 text-sm">
                    {Object.entries(workflow.totalCost.bridgeFees).length > 0 ? (
                      Object.entries(workflow.totalCost.bridgeFees).map(([bridge, fee]) => (
                        <div key={bridge} className="flex justify-between">
                          <span>{bridge}</span>
                          <span className="font-mono">{fee}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground">No bridge fees</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <h4 className="font-semibold mb-3">Risk Assessment</h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Risk Factors</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Bridge finality time: {workflow.estimatedTime} minutes</li>
                    <li>Multi-chain execution complexity</li>
                    <li>Gas price volatility across chains</li>
                    <li>Smart contract risk on {workflow.steps.length} chains</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Execution Progress */}
            {isExecuting && (
              <div>
                <h4 className="font-semibold mb-3">Execution Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Step {currentStep + 1} of {workflow.steps.length}</span>
                    <span>{Math.round(((currentStep + 1) / workflow.steps.length) * 100)}%</span>
                  </div>
                  <Progress value={((currentStep + 1) / workflow.steps.length) * 100} />
                  <div className="text-sm text-muted-foreground">
                    {workflow.steps[currentStep]?.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Multi-chain workflow marketplace component
export function CrossChainWorkflowMarketplace() {
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [selectedRisk, setSelectedRisk] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null)

  const filteredWorkflows = MOCK_CROSS_CHAIN_WORKFLOWS.filter(workflow => {
    const matchesChains = selectedChains.length === 0 || 
      workflow.steps.some(step => selectedChains.includes(step.chain))
    const matchesRisk = selectedRisk === 'all' || workflow.riskLevel === selectedRisk
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesChains && matchesRisk && matchesSearch
  })

  const handleExecuteWorkflow = async (workflow: CrossChainWorkflow) => {
    setExecutingWorkflow(workflow.id)
    
    // Simulate execution
    for (let i = 0; i < workflow.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      // In a real app, this would execute the actual step
    }
    
    setExecutingWorkflow(null)
  }

  const handleConfigureWorkflow = (workflow: CrossChainWorkflow) => {
    console.log('Configure workflow:', workflow.id)
    // In a real app, this would open a configuration modal
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Chain Workflow Marketplace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Workflows</label>
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Supported Chains</label>
              <div className="flex flex-wrap gap-2">
                {selectedChains.map(chain => (
                  <Badge key={chain} variant="secondary" className="flex items-center gap-1">
                    <span>{CHAIN_LOGOS[chain]}</span>
                    <span>{chain}</span>
                    <button
                      onClick={() => setSelectedChains(selectedChains.filter(c => c !== chain))}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedChains.length === 0 && (
                  <span className="text-sm text-muted-foreground">All chains</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <CrossChainWorkflowCard
            key={workflow.id}
            workflow={workflow}
            onExecute={handleExecuteWorkflow}
            onConfigure={handleConfigureWorkflow}
            isExecuting={executingWorkflow === workflow.id}
          />
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">No Multi-Chain Workflows Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find cross-chain workflows.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
