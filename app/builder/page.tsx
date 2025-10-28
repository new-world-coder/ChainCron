'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
  Loader2,
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
  const searchParams = useSearchParams()
  const [selectedBlock, setSelectedBlock] = useState<WorkflowBlock | null>(null)
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [workflowPrice, setWorkflowPrice] = useState('')
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showTriggerConfig, setShowTriggerConfig] = useState(false)
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [pendingNode, setPendingNode] = useState<WorkflowNode | null>(null)
  const [triggerConfig, setTriggerConfig] = useState<{ interval?: string; time?: string }>({})
  const [deployPrice, setDeployPrice] = useState('')
  const [deployCreatorFee, setDeployCreatorFee] = useState('80')
  const [isDeploying, setIsDeploying] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Load workflow for editing if ID is provided
  useEffect(() => {
    const editId = searchParams.get('edit')
    const deployId = searchParams.get('deploy')
    
    // Handle deployment request
    if (deployId) {
      try {
        const { getWorkflowById } = require('@/lib/utils/workflowStorage')
        const saved = getWorkflowById(deployId)
        if (saved) {
          setCurrentWorkflowId(saved.id)
          setWorkflowName(saved.name)
          setWorkflowDescription(saved.description)
          setShowDeployDialog(true)
        }
      } catch (error) {
        console.error('Error loading workflow for deployment:', error)
        toast.error('Failed to load workflow')
      }
    }
    
    // Handle edit request
    if (editId) {
      try {
        const { getWorkflowById, convertSavedWorkflowToComposed } = require('@/lib/utils/workflowStorage')
        const saved = getWorkflowById(editId)
        if (saved) {
          const workflow = convertSavedWorkflowToComposed(saved)
          setWorkflowName(workflow.name)
          setWorkflowDescription(workflow.description)
          setCurrentWorkflowId(saved.id) // Preserve the existing workflow ID
          // Convert workflow nodes to builder format
          // Look for blockId, otherwise match by type/name
          const nodes = workflow.nodes.map((node: any) => {
            // Check if node has blockId (from saved builder workflow)
            let blockId = node.blockId
            if (!blockId) {
              // Try to find matching block by name
              const matchingBlock = workflowBlocks.find(b => 
                b.name === node.name && b.type === node.type
              )
              blockId = matchingBlock?.id || node.id
            }
            return {
              id: node.id,
              blockId: blockId,
              position: node.position,
              config: node.parameters || {},
              connections: node.connections || [],
            }
          })
          setWorkflowNodes(nodes)
          console.log('Loaded workflow with ID:', saved.id, 'Nodes:', nodes)
          toast.success('Workflow loaded for editing')
        }
      } catch (error) {
        console.error('Error loading workflow:', error)
        toast.error('Failed to load workflow')
      }
    }
  }, [searchParams])

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
      
      // If it's a trigger, show configuration dialog
      if (blockData.type === 'trigger') {
        setPendingNode(newNode)
        setShowTriggerConfig(true)
      } else {
        // For non-triggers, add immediately
        setWorkflowNodes(prev => [...prev, newNode])
        setSelectedNode(newNode)
        toast.success(`${blockData.name} added to workflow`)
      }
    }
  }, [dragOffset])

  const handleTriggerConfigSave = useCallback(() => {
    if (!pendingNode) return
    
    // Set the trigger configuration
    const updatedNode = {
      ...pendingNode,
      config: triggerConfig,
    }
    
    setWorkflowNodes(prev => [...prev, updatedNode])
    setSelectedNode(updatedNode)
    setShowTriggerConfig(false)
    setPendingNode(null)
    setTriggerConfig({})
    toast.success('Trigger configured and added to workflow')
  }, [pendingNode, triggerConfig])

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
    
    try {
      // Save to localStorage
      const { saveWorkflow } = require('@/lib/utils/workflowStorage')
      const workflowId = currentWorkflowId || `workflow-${Date.now()}`
      if (!currentWorkflowId) {
        setCurrentWorkflowId(workflowId) // Set the ID for future saves
      }
      
      const workflow = {
        id: workflowId,
        name: workflowName,
        description: workflowDescription,
        nodes: workflowNodes.map(node => {
          const block = workflowBlocks.find(b => b.id === node.blockId)
          return {
            id: node.id,
            blockId: node.blockId, // Preserve blockId for loading
            type: block?.type || 'action',
            name: block?.name || 'Node',
            description: block?.description || '',
            parameters: node.config,
            position: node.position,
            connections: node.connections,
            status: 'idle' as const,
          }
        }),
        connections: [],
        variables: {},
        executionPlan: workflowNodes.map(n => n.id),
        estimatedGas: '0.005 ETH',
        successRate: 95,
        createdAt: currentWorkflowId ? new Date() : new Date(), // Keep original creation date if updating
        updatedAt: new Date(),
      }
      saveWorkflow(workflow)
      console.log('Saved workflow:', workflowId, 'with', workflowNodes.length, 'nodes')
      toast.success('Workflow saved successfully!')
    } catch (error) {
      console.error('Error saving workflow:', error)
      toast.error('Failed to save workflow')
    }
  }, [workflowName, workflowDescription, workflowPrice, workflowNodes, currentWorkflowId])

  const handleTestWorkflow = useCallback(() => {
    if (workflowNodes.length === 0) {
      toast.error('Please add at least one node to test')
      return
    }
    
    toast.success('Running workflow test...')
    // In a real app, this would simulate the workflow
  }, [workflowNodes])

  const handleDeployWorkflow = useCallback(async () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name')
      return
    }
    
    if (workflowNodes.length === 0) {
      toast.error('Please add at least one node to deploy')
      return
    }
    
    // Show deployment dialog
    setShowDeployDialog(true)
  }, [workflowName, workflowNodes])

  const handleDeployConfirm = useCallback(async () => {
    if (!deployPrice || parseFloat(deployPrice) <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    
    if (!deployCreatorFee || parseFloat(deployCreatorFee) < 50 || parseFloat(deployCreatorFee) > 90) {
      toast.error('Creator fee must be between 50% and 90%')
      return
    }

    setIsDeploying(true)
    
    try {
      // In a real app, this would:
      // 1. Call the CreatorTools smart contract to publish the workflow
      // 2. Update the workflow status to "published" in the database
      // 3. Register it with the workflow registry
      
      // For now, simulate the deployment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark workflow as deployed in localStorage
      const { getWorkflowById, saveWorkflow } = require('@/lib/utils/workflowStorage')
      const saved = getWorkflowById(currentWorkflowId!)
      if (saved) {
        const deployedWorkflow = {
          ...saved,
          isDeployed: true,
          deployPrice: parseFloat(deployPrice),
          deployCreatorFee: parseFloat(deployCreatorFee),
          status: 'published',
          deployedAt: new Date(),
        }
        saveWorkflow(deployedWorkflow)
        
        toast.success('Workflow deployed successfully to marketplace!')
        setShowDeployDialog(false)
        setDeployPrice('')
        setDeployCreatorFee('80')
      }
    } catch (error) {
      console.error('Error deploying workflow:', error)
      toast.error('Failed to deploy workflow')
    } finally {
      setIsDeploying(false)
    }
  }, [deployPrice, deployCreatorFee, currentWorkflowId])

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
                
                {/* Trigger-specific configuration */}
                {selectedBlock.type === 'trigger' && (
                  <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium text-sm">Trigger Settings</h4>
                    <div>
                      <Label htmlFor="trigger-interval-select" className="text-sm">Execution Interval</Label>
                      <select
                        id="trigger-interval-select"
                        className="w-full p-2 border border-border rounded-lg bg-background mt-1"
                        value={selectedNode.config.interval || ''}
                        onChange={(e) => handleNodeConfigChange(selectedNode.id, {
                          ...selectedNode.config,
                          interval: e.target.value
                        })}
                      >
                        <option value="">Select interval</option>
                        <option value="1h">Every Hour</option>
                        <option value="6h">Every 6 Hours</option>
                        <option value="12h">Every 12 Hours</option>
                        <option value="24h">Daily</option>
                        <option value="7d">Weekly</option>
                        <option value="30d">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="trigger-time-display" className="text-sm">Specific Time (Optional)</Label>
                      <Input
                        id="trigger-time-display"
                        type="time"
                        value={selectedNode.config.time || ''}
                        onChange={(e) => handleNodeConfigChange(selectedNode.id, {
                          ...selectedNode.config,
                          time: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    {selectedNode.config.interval && (
                      <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                        <p className="font-medium">Current Configuration:</p>
                        <p className="text-muted-foreground">
                          Interval: {selectedNode.config.interval}
                          {selectedNode.config.time && ` at ${selectedNode.config.time}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {selectedBlock.configurable && selectedBlock.inputs.length > 0 && (
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

      {/* Trigger Configuration Dialog */}
      <AnimatePresence>
        {showTriggerConfig && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => {
                setShowTriggerConfig(false)
                setPendingNode(null)
                setTriggerConfig({})
              }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-lg font-semibold mb-4">Configure Trigger</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Set up when and how this trigger should fire
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trigger-interval" className="text-sm mb-2">
                      Execution Interval
                    </Label>
                    <select
                      id="trigger-interval"
                      className="w-full p-2 border border-border rounded-lg bg-background"
                      value={triggerConfig.interval || ''}
                      onChange={(e) => setTriggerConfig({ ...triggerConfig, interval: e.target.value })}
                    >
                      <option value="">Select interval</option>
                      <option value="1h">Every Hour</option>
                      <option value="6h">Every 6 Hours</option>
                      <option value="12h">Every 12 Hours</option>
                      <option value="24h">Daily</option>
                      <option value="7d">Weekly</option>
                      <option value="30d">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="trigger-time" className="text-sm mb-2">
                      Specific Time (Optional)
                    </Label>
                    <Input
                      id="trigger-time"
                      type="time"
                      value={triggerConfig.time || ''}
                      onChange={(e) => setTriggerConfig({ ...triggerConfig, time: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowTriggerConfig(false)
                        setPendingNode(null)
                        setTriggerConfig({})
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleTriggerConfigSave}
                      disabled={!triggerConfig.interval}
                    >
                      Save & Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deployment Dialog */}
      <AnimatePresence>
        {showDeployDialog && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => !isDeploying && setShowDeployDialog(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-lg font-semibold mb-4">Deploy Workflow to Marketplace</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Set pricing and configuration for your workflow before deploying
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deploy-price" className="text-sm mb-2">
                      Subscription Price (ETH per month)
                    </Label>
                    <Input
                      id="deploy-price"
                      type="number"
                      step="0.001"
                      placeholder="0.01"
                      value={deployPrice}
                      onChange={(e) => setDeployPrice(e.target.value)}
                      disabled={isDeploying}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Amount users will pay per month to subscribe
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="deploy-fee" className="text-sm mb-2">
                      Creator Fee (%) 
                    </Label>
                    <Input
                      id="deploy-fee"
                      type="number"
                      step="1"
                      placeholder="80"
                      value={deployCreatorFee}
                      onChange={(e) => setDeployCreatorFee(e.target.value)}
                      disabled={isDeploying}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your share of revenue (50-90%)
                    </p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Deployment Preview:</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• Workflow will be published to marketplace</p>
                      <p>• Users can browse and subscribe</p>
                      <p>• Revenue: {deployPrice ? `${deployPrice} ETH/mo` : 'TBD'}</p>
                      <p>• Your fee: {deployCreatorFee}%</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDeployDialog(false)}
                      disabled={isDeploying}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleDeployConfirm}
                      disabled={isDeploying || !deployPrice || !deployCreatorFee}
                    >
                      {isDeploying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        'Deploy to Marketplace'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
