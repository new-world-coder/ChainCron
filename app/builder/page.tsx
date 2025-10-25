'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Save,
  Play,
  Upload,
  Download,
  Settings,
  Share2,
  Eye,
  Trash2,
  Copy,
  Move,
  Zap,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Grid,
  List,
  Search,
  Filter,
  HelpCircle,
  Info,
  ExternalLink,
  Target,
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Block types for the workflow builder
interface WorkflowBlock {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'output'
  name: string
  description: string
  icon: React.ComponentType<any>
  category: string
  inputs: BlockInput[]
  outputs: BlockOutput[]
  configurable: boolean
}

interface BlockInput {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'address' | 'token'
  required: boolean
  defaultValue?: any
}

interface BlockOutput {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'address' | 'token'
}

interface WorkflowNode {
  id: string
  blockId: string
  position: { x: number; y: number }
  config: Record<string, any>
  connections: string[]
}

// Available workflow blocks
const workflowBlocks: WorkflowBlock[] = [
  // Triggers
  {
    id: 'time-trigger',
    type: 'trigger',
    name: 'Time Trigger',
    description: 'Execute workflow at specific intervals',
    icon: Clock,
    category: 'Triggers',
    inputs: [],
    outputs: [{ id: 'trigger', name: 'Trigger', type: 'boolean' }],
    configurable: true,
  },
  {
    id: 'price-trigger',
    type: 'trigger',
    name: 'Price Alert',
    description: 'Trigger when token price reaches target',
    icon: TrendingUp,
    category: 'Triggers',
    inputs: [],
    outputs: [{ id: 'trigger', name: 'Trigger', type: 'boolean' }],
    configurable: true,
  },
  {
    id: 'balance-trigger',
    type: 'trigger',
    name: 'Balance Change',
    description: 'Trigger when wallet balance changes',
    icon: DollarSign,
    category: 'Triggers',
    inputs: [],
    outputs: [{ id: 'trigger', name: 'Trigger', type: 'boolean' }],
    configurable: true,
  },
  // Actions
  {
    id: 'swap-action',
    type: 'action',
    name: 'Token Swap',
    description: 'Swap tokens on DEX',
    icon: ArrowRight,
    category: 'Actions',
    inputs: [
      { id: 'tokenIn', name: 'Token In', type: 'token', required: true },
      { id: 'tokenOut', name: 'Token Out', type: 'token', required: true },
      { id: 'amount', name: 'Amount', type: 'number', required: true },
    ],
    outputs: [
      { id: 'amountOut', name: 'Amount Out', type: 'number' },
      { id: 'txHash', name: 'Transaction Hash', type: 'string' },
    ],
    configurable: true,
  },
  {
    id: 'stake-action',
    type: 'action',
    name: 'Stake Tokens',
    description: 'Stake tokens in DeFi protocol',
    icon: Shield,
    category: 'Actions',
    inputs: [
      { id: 'token', name: 'Token', type: 'token', required: true },
      { id: 'amount', name: 'Amount', type: 'number', required: true },
    ],
    outputs: [
      { id: 'stakeAmount', name: 'Stake Amount', type: 'number' },
      { id: 'txHash', name: 'Transaction Hash', type: 'string' },
    ],
    configurable: true,
  },
  {
    id: 'transfer-action',
    type: 'action',
    name: 'Transfer Funds',
    description: 'Transfer tokens to another address',
    icon: ArrowRight,
    category: 'Actions',
    inputs: [
      { id: 'to', name: 'To Address', type: 'address', required: true },
      { id: 'token', name: 'Token', type: 'token', required: true },
      { id: 'amount', name: 'Amount', type: 'number', required: true },
    ],
    outputs: [
      { id: 'txHash', name: 'Transaction Hash', type: 'string' },
    ],
    configurable: true,
  },
  // Conditions
  {
    id: 'if-condition',
    type: 'condition',
    name: 'If/Else',
    description: 'Conditional logic branching',
    icon: AlertTriangle,
    category: 'Conditions',
    inputs: [
      { id: 'condition', name: 'Condition', type: 'boolean', required: true },
    ],
    outputs: [
      { id: 'true', name: 'True Path', type: 'boolean' },
      { id: 'false', name: 'False Path', type: 'boolean' },
    ],
    configurable: true,
  },
  {
    id: 'compare-condition',
    type: 'condition',
    name: 'Compare Values',
    description: 'Compare two values',
    icon: BarChart3,
    category: 'Conditions',
    inputs: [
      { id: 'value1', name: 'Value 1', type: 'number', required: true },
      { id: 'value2', name: 'Value 2', type: 'number', required: true },
      { id: 'operator', name: 'Operator', type: 'string', required: true, defaultValue: '>' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean' },
    ],
    configurable: true,
  },
  // Outputs
  {
    id: 'notification-output',
    type: 'output',
    name: 'Send Notification',
    description: 'Send notification to user',
    icon: Activity,
    category: 'Outputs',
    inputs: [
      { id: 'message', name: 'Message', type: 'string', required: true },
      { id: 'type', name: 'Type', type: 'string', required: true, defaultValue: 'info' },
    ],
    outputs: [],
    configurable: true,
  },
  {
    id: 'log-output',
    type: 'output',
    name: 'Log Result',
    description: 'Log workflow result',
    icon: List,
    category: 'Outputs',
    inputs: [
      { id: 'data', name: 'Data', type: 'string', required: true },
    ],
    outputs: [],
    configurable: true,
  },
]

export default function WorkflowBuilderPage() {
  const [selectedBlock, setSelectedBlock] = useState<WorkflowBlock | null>(null)
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [workflowPrice, setWorkflowPrice] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((block: WorkflowBlock, event: React.DragEvent) => {
    setIsDragging(true)
    const rect = event.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
    event.dataTransfer.setData('application/json', JSON.stringify(block))
  }, [])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleCanvasDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const blockData = JSON.parse(event.dataTransfer.getData('application/json'))
    const rect = canvasRef.current?.getBoundingClientRect()
    
    if (rect) {
      const x = event.clientX - rect.left - dragOffset.x
      const y = event.clientY - rect.top - dragOffset.y
      
      const newNode: WorkflowNode = {
        id: `${blockData.id}-${Date.now()}`,
        blockId: blockData.id,
        position: { x, y },
        config: {},
        connections: [],
      }
      
      setWorkflowNodes(prev => [...prev, newNode])
      setSelectedNode(newNode)
      toast.success(`${blockData.name} added to workflow`)
    }
  }, [dragOffset])

  const handleCanvasDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    setSelectedNode(node)
    const block = workflowBlocks.find(b => b.id === node.blockId)
    setSelectedBlock(block || null)
  }, [])

  const handleNodeConfigChange = useCallback((nodeId: string, config: Record<string, any>) => {
    setWorkflowNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, config: { ...node.config, ...config } } : node
      )
    )
  }, [])

  const handleDeleteNode = useCallback((nodeId: string) => {
    setWorkflowNodes(prev => prev.filter(node => node.id !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
      setSelectedBlock(null)
    }
    toast.success('Node deleted')
  }, [selectedNode])

  const handleSaveWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name')
      return
    }
    
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      price: workflowPrice,
      nodes: workflowNodes,
      createdAt: new Date().toISOString(),
    }
    
    // In a real app, this would save to the blockchain
    console.log('Saving workflow:', workflow)
    toast.success('Workflow saved successfully!')
  }, [workflowName, workflowDescription, workflowPrice, workflowNodes])

  const handleTestWorkflow = useCallback(() => {
    if (workflowNodes.length === 0) {
      toast.error('Please add at least one node to test')
      return
    }
    
    toast.success('Running workflow test...')
    // In a real app, this would simulate the workflow
  }, [workflowNodes])

  const handleDeployWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name')
      return
    }
    
    if (workflowNodes.length === 0) {
      toast.error('Please add at least one node to deploy')
      return
    }
    
    toast.success('Deploying workflow to marketplace...')
    // In a real app, this would deploy to the blockchain
  }, [workflowName, workflowNodes])

  const groupedBlocks = workflowBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = []
    }
    acc[block.category].push(block)
    return acc
  }, {} as Record<string, WorkflowBlock[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="flex h-screen">
        {/* Left Sidebar - Block Library */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Workflow Blocks</h2>
            <p className="text-sm text-muted-foreground">
              Drag blocks onto the canvas to build your workflow
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(groupedBlocks).map(([category, blocks]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {blocks.map((block) => {
                    const Icon = block.icon
                    return (
                      <motion.div
                        key={block.id}
                        className="p-3 bg-background border border-border rounded-lg cursor-grab hover:border-primary/50 transition-colors"
                        draggable
                        onDragStart={(e) => handleDragStart(block, e as unknown as React.DragEvent)}
                        onDragEnd={handleDragEnd}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">{block.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {block.description}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Workflow Builder</h1>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Workflow name..."
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-48"
                />
                <Badge variant="outline">
                  {workflowNodes.length} nodes
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleTestWorkflow}>
                <Play className="w-4 h-4 mr-2" />
                Test Run
              </Button>
              <Button variant="outline" onClick={handleSaveWorkflow}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleDeployWorkflow}>
                <Upload className="w-4 h-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <div
              ref={canvasRef}
              className="w-full h-full bg-grid-pattern relative"
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
            >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Workflow Nodes */}
              <AnimatePresence>
                {workflowNodes.map((node) => {
                  const block = workflowBlocks.find(b => b.id === node.blockId)
                  if (!block) return null
                  
                  const Icon = block.icon
                  const isSelected = selectedNode?.id === node.id
                  
                  return (
                    <motion.div
                      key={node.id}
                      className={`absolute p-4 bg-card border-2 rounded-lg cursor-pointer min-w-[200px] ${
                        isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'
                      }`}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => handleNodeClick(node)}
                      drag
                      dragMomentum={false}
                      onDragEnd={(_, info) => {
                        setWorkflowNodes(prev =>
                          prev.map(n =>
                            n.id === node.id
                              ? { ...n, position: { x: n.position.x + info.offset.x, y: n.position.y + info.offset.y } }
                              : n
                          )
                        )
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">{block.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNode(node.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {block.description}
                      </p>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {block.type}
                        </Badge>
                        {block.configurable && (
                          <Badge variant="outline" className="text-xs">
                            Configurable
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Empty State */}
              {workflowNodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Start Building Your Workflow</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag blocks from the sidebar to create your automation workflow
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="outline">Triggers</Badge>
                      <Badge variant="outline">Actions</Badge>
                      <Badge variant="outline">Conditions</Badge>
                      <Badge variant="outline">Outputs</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Configuration Panel */}
        <div className="w-80 bg-card border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure selected node or workflow settings
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode && selectedBlock ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{selectedBlock.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedBlock.description}
                  </p>
                </div>
                
                {selectedBlock.configurable && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Configuration</h4>
                    {selectedBlock.inputs.map((input) => (
                      <div key={input.id}>
                        <Label htmlFor={input.id} className="text-sm">
                          {input.name}
                          {input.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {input.type === 'string' && (
                          <Input
                            id={input.id}
                            placeholder={`Enter ${input.name.toLowerCase()}`}
                            value={selectedNode.config[input.id] || ''}
                            onChange={(e) => handleNodeConfigChange(selectedNode.id, {
                              ...selectedNode.config,
                              [input.id]: e.target.value
                            })}
                          />
                        )}
                        {input.type === 'number' && (
                          <Input
                            id={input.id}
                            type="number"
                            placeholder={`Enter ${input.name.toLowerCase()}`}
                            value={selectedNode.config[input.id] || ''}
                            onChange={(e) => handleNodeConfigChange(selectedNode.id, {
                              ...selectedNode.config,
                              [input.id]: e.target.value
                            })}
                          />
                        )}
                        {input.type === 'boolean' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={input.id}
                              checked={selectedNode.config[input.id] || false}
                              onChange={(e) => handleNodeConfigChange(selectedNode.id, {
                                ...selectedNode.config,
                                [input.id]: e.target.checked
                              })}
                            />
                            <Label htmlFor={input.id} className="text-sm">
                              {input.name}
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Workflow Settings</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="workflow-name" className="text-sm">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      placeholder="Enter workflow name"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workflow-description" className="text-sm">Description</Label>
                    <Textarea
                      id="workflow-description"
                      placeholder="Describe what this workflow does"
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workflow-price" className="text-sm">Monthly Price (ETH)</Label>
                    <Input
                      id="workflow-price"
                      type="number"
                      step="0.01"
                      placeholder="0.01"
                      value={workflowPrice}
                      onChange={(e) => setWorkflowPrice(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium text-sm mb-2">Workflow Stats</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Nodes:</span>
                      <span>{workflowNodes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Triggers:</span>
                      <span>{workflowNodes.filter(n => workflowBlocks.find(b => b.id === n.blockId)?.type === 'trigger').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actions:</span>
                      <span>{workflowNodes.filter(n => workflowBlocks.find(b => b.id === n.blockId)?.type === 'action').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
