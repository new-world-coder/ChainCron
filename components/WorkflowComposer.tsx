'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Play,
  Pause,
  Settings,
  Save,
  Download,
  Upload,
  ArrowRight,
  GitBranch,
  GitCommit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Copy,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { TestnetToggle, TestnetExecutionButton } from '@/components/TestnetStatus'
import { useTestnetOperations } from '@/lib/testnet'

// Workflow node types
export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'output'
  name: string
  description: string
  parameters: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
  status: 'idle' | 'running' | 'success' | 'error'
}

export interface WorkflowConnection {
  id: string
  from: string
  to: string
  condition?: string
}

export interface ComposedWorkflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  variables: Record<string, any>
  executionPlan: string[]
  estimatedGas: string
  successRate: number
  createdAt: Date
  updatedAt: Date
  isTestnetEnabled?: boolean
}

// Mock workflow templates
const WORKFLOW_TEMPLATES = [
  {
    id: 'auto-compound-rebalance',
    name: 'Auto-Compound → Rebalance → Alert',
    description: 'Compound yields, rebalance portfolio, then send alert if profit > $100',
    nodes: [
      {
        id: 'trigger1',
        type: 'trigger' as const,
        name: 'Time Trigger',
        description: 'Execute every 24 hours',
        parameters: { interval: '24h' },
        position: { x: 100, y: 100 },
        connections: ['action1'],
        status: 'idle' as const,
      },
      {
        id: 'action1',
        type: 'action' as const,
        name: 'Auto-Compound',
        description: 'Compound USDC rewards',
        parameters: { token: 'USDC', protocol: 'Aave' },
        position: { x: 300, y: 100 },
        connections: ['condition1'],
        status: 'idle' as const,
      },
      {
        id: 'condition1',
        type: 'condition' as const,
        name: 'Profit Check',
        description: 'Check if profit > $100',
        parameters: { threshold: 100, operator: '>' },
        position: { x: 500, y: 100 },
        connections: ['action2', 'action3'],
        status: 'idle' as const,
      },
      {
        id: 'action2',
        type: 'action' as const,
        name: 'Rebalance',
        description: 'Rebalance portfolio',
        parameters: { targetAllocation: '60% ETH, 40% USDC' },
        position: { x: 700, y: 50 },
        connections: ['output1'],
        status: 'idle' as const,
      },
      {
        id: 'action3',
        type: 'action' as const,
        name: 'Send Alert',
        description: 'Send notification',
        parameters: { message: 'High profit detected!' },
        position: { x: 700, y: 150 },
        connections: ['output2'],
        status: 'idle' as const,
      },
      {
        id: 'output1',
        type: 'output' as const,
        name: 'Success',
        description: 'Workflow completed successfully',
        parameters: {},
        position: { x: 900, y: 50 },
        connections: [],
        status: 'idle' as const,
      },
      {
        id: 'output2',
        type: 'output' as const,
        name: 'Alert Sent',
        description: 'Alert notification sent',
        parameters: {},
        position: { x: 900, y: 150 },
        connections: [],
        status: 'idle' as const,
      },
    ],
    connections: [
      { id: 'conn1', from: 'trigger1', to: 'action1' },
      { id: 'conn2', from: 'action1', to: 'condition1' },
      { id: 'conn3', from: 'condition1', to: 'action2', condition: 'profit > $100' },
      { id: 'conn4', from: 'condition1', to: 'action3', condition: 'profit <= $100' },
      { id: 'conn5', from: 'action2', to: 'output1' },
      { id: 'conn6', from: 'action3', to: 'output2' },
    ],
    variables: { profit: 0, totalGas: 0 },
    executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'action3', 'output1', 'output2'],
    estimatedGas: '0.008 ETH',
    successRate: 94,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Node component for the workflow canvas
function WorkflowNode({ node, onSelect, onDelete, isSelected }: {
  node: WorkflowNode
  onSelect: (node: WorkflowNode) => void
  onDelete: (nodeId: string) => void
  isSelected: boolean
}) {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'action': return 'bg-green-100 border-green-300 text-green-800'
      case 'condition': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'output': return 'bg-purple-100 border-purple-300 text-purple-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="w-3 h-3 animate-spin" />
      case 'success': return <CheckCircle className="w-3 h-3 text-green-600" />
      case 'error': return <AlertTriangle className="w-3 h-3 text-red-600" />
      default: return null
    }
  }

  return (
    <motion.div
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected ? 'border-primary shadow-lg' : getNodeColor(node.type)
      }`}
      style={{ position: 'absolute', left: node.position.x, top: node.position.y }}
      onClick={() => onSelect(node)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        // Update node position
        console.log('Node dragged:', node.id, info.point)
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {node.type}
          </Badge>
          {getStatusIcon(node.status)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(node.id)
          }}
          className="h-6 w-6 p-0 hover:bg-red-100"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="font-medium text-sm">{node.name}</div>
      <div className="text-xs opacity-75">{node.description}</div>
      
      {node.connections.length > 0 && (
        <div className="mt-2 flex justify-end">
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </motion.div>
  )
}

// Main workflow composer component
export function WorkflowComposer() {
  const [selectedTemplate, setSelectedTemplate] = useState<ComposedWorkflow | null>(null)
  const [currentWorkflow, setCurrentWorkflow] = useState<ComposedWorkflow | null>(null)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionStep, setExecutionStep] = useState(0)
  const [showVariables, setShowVariables] = useState(false)
  const [isTestnetEnabled, setIsTestnetEnabled] = useState(false)

  const { executeWorkflowOnTestnet, isExecuting: isTestnetExecuting } = useTestnetOperations()

  // Auto-enable testnet mode in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsTestnetEnabled(true)
    }
  }, [])

  const handleSelectTemplate = (template: ComposedWorkflow) => {
    setSelectedTemplate(template)
    setCurrentWorkflow({ ...template, id: `workflow-${Date.now()}` })
  }

  const handleNodeSelect = (node: WorkflowNode) => {
    setSelectedNode(node)
  }

  const handleNodeDelete = (nodeId: string) => {
    if (currentWorkflow) {
      const updatedNodes = currentWorkflow.nodes.filter(node => node.id !== nodeId)
      const updatedConnections = currentWorkflow.connections.filter(
        conn => conn.from !== nodeId && conn.to !== nodeId
      )
      setCurrentWorkflow({
        ...currentWorkflow,
        nodes: updatedNodes,
        connections: updatedConnections,
      })
    }
  }

  const handleExecuteWorkflow = async () => {
    if (!currentWorkflow) return
    
    // In development mode, always use local simulation to avoid MetaMask circuit breaker
    if (process.env.NODE_ENV === 'development') {
      // Local simulation execution
      setIsExecuting(true)
      setExecutionStep(0)
      
      const steps = [
        'Initializing workflow...',
        'Validating parameters...',
        'Connecting to Flow blockchain...',
        'Executing workflow steps...',
        'Monitoring execution...',
        'Workflow completed successfully!'
      ]
      
      for (let i = 0; i < steps.length; i++) {
        setExecutionStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      setIsExecuting(false)
      setExecutionStep(0)
      return
    }
    
    if (isTestnetEnabled) {
      // Execute on testnet
      try {
        const workflowId = parseInt(currentWorkflow.id.replace('workflow-', ''))
        await executeWorkflowOnTestnet(workflowId, JSON.stringify(currentWorkflow.variables))
      } catch (error) {
        console.error('Testnet execution failed:', error)
      }
      return
    }
    
    // Local simulation execution
    setIsExecuting(true)
    setExecutionStep(0)
    
    // Simulate execution
    for (let i = 0; i < currentWorkflow.executionPlan.length; i++) {
      setExecutionStep(i)
      
      // Update node status
      const nodeId = currentWorkflow.executionPlan[i]
      const updatedNodes = currentWorkflow.nodes.map(node => 
        node.id === nodeId ? { ...node, status: 'running' as const } : node
      )
      setCurrentWorkflow({ ...currentWorkflow, nodes: updatedNodes })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark as success
      const successNodes = currentWorkflow.nodes.map(node => 
        node.id === nodeId ? { ...node, status: 'success' as const } : node
      )
      setCurrentWorkflow({ ...currentWorkflow, nodes: successNodes })
    }
    
    setIsExecuting(false)
  }

  const handleTestnetToggle = (enabled: boolean) => {
    setIsTestnetEnabled(enabled)
    if (currentWorkflow) {
      setCurrentWorkflow({
        ...currentWorkflow,
        isTestnetEnabled: enabled
      })
    }
  }

  const handleSaveWorkflow = () => {
    if (currentWorkflow) {
      console.log('Saving workflow:', currentWorkflow)
      // In a real app, this would save to the backend
    }
  }

  const handleExportWorkflow = () => {
    if (currentWorkflow) {
      const dataStr = JSON.stringify(currentWorkflow, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentWorkflow.name}.json`
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      {!currentWorkflow && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Workflow Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKFLOW_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span>{template.estimatedGas}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{template.successRate}% success</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4 text-purple-600" />
                        <span>{template.nodes.length} nodes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Canvas */}
      {currentWorkflow && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>{currentWorkflow.name}</CardTitle>
                    {process.env.NODE_ENV === 'development' && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Dev Mode
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVariables(!showVariables)}
                    >
                      {showVariables ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      Variables
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportWorkflow}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <TestnetToggle 
                      enabled={isTestnetEnabled}
                      onToggle={handleTestnetToggle}
                    />
                    <Button
                      onClick={handleExecuteWorkflow}
                      disabled={isExecuting || isTestnetExecuting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isExecuting || isTestnetExecuting ? (
                        <Pause className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isExecuting || isTestnetExecuting ? 'Executing...' : 'Execute'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  {/* Workflow Nodes */}
                  {currentWorkflow.nodes.map((node) => (
                    <WorkflowNode
                      key={node.id}
                      node={node}
                      onSelect={handleNodeSelect}
                      onDelete={handleNodeDelete}
                      isSelected={selectedNode?.id === node.id}
                    />
                  ))}
                  
                  {/* Execution Progress */}
                  {isExecuting && (
                    <div className="absolute top-4 left-4 bg-background/90 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span className="font-medium">Executing Workflow</span>
                      </div>
                      <Progress value={(executionStep / currentWorkflow.executionPlan.length) * 100} />
                      <div className="text-sm text-muted-foreground mt-1">
                        Step {executionStep + 1} of {currentWorkflow.executionPlan.length}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Node Properties */}
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Node Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={selectedNode.name}
                        onChange={(e) => {
                          // Update node name
                          console.log('Update node name:', e.target.value)
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={selectedNode.description}
                        onChange={(e) => {
                          // Update node description
                          console.log('Update node description:', e.target.value)
                        }}
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Badge variant="outline" className="text-xs">
                        {selectedNode.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs">Status</Label>
                      <Badge
                        variant={selectedNode.status === 'success' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {selectedNode.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Variables Panel */}
            {showVariables && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Workflow Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(currentWorkflow.variables).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-mono">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Workflow Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Workflow Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nodes:</span>
                    <span>{currentWorkflow.nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span>{currentWorkflow.connections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Gas:</span>
                    <span>{currentWorkflow.estimatedGas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span>{currentWorkflow.successRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
