'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  Zap,
  Calendar,
  DollarSign,
  Users,
  Gift,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Copy,
  Share2,
  Download,
  Play,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { WorkflowComposer, ComposedWorkflow, WorkflowNode } from './WorkflowComposer'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  workflow?: ComposedWorkflow
  suggestions?: string[]
}

interface AIWorkflowBuilderProps {
  onWorkflowGenerated?: (workflow: ComposedWorkflow) => void
}

// AI-powered workflow generation
const generateWorkflowFromPrompt = async (prompt: string): Promise<ComposedWorkflow> => {
  // Simulate AI processing with realistic delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Parse common patterns from the prompt
  const lowerPrompt = prompt.toLowerCase()
  
  // Extract timing information
  let interval = '24h'
  if (lowerPrompt.includes('daily') || lowerPrompt.includes('every day')) {
    interval = '24h'
  } else if (lowerPrompt.includes('weekly') || lowerPrompt.includes('every week')) {
    interval = '7d'
  } else if (lowerPrompt.includes('monthly') || lowerPrompt.includes('every month')) {
    interval = '30d'
  } else if (lowerPrompt.includes('hourly') || lowerPrompt.includes('every hour')) {
    interval = '1h'
  }
  
  // Extract action types
  const actions: WorkflowNode[] = []
  let nodeId = 1
  
  // Time trigger
  actions.push({
    id: `trigger-${nodeId++}`,
    type: 'trigger',
    name: 'Time Trigger',
    description: `Execute ${interval}`,
    parameters: { interval },
    position: { x: 100, y: 100 },
    connections: [`action-${nodeId}`],
    status: 'idle',
  })
  
  // Determine actions based on prompt
  if (lowerPrompt.includes('mint') && lowerPrompt.includes('nft')) {
    actions.push({
      id: `action-${nodeId}`,
      type: 'action',
      name: 'Mint NFT',
      description: 'Mint NFT for subscribers',
      parameters: { 
        contract: 'FlowNFT',
        recipient: 'subscribers',
        metadata: 'dynamic'
      },
      position: { x: 300, y: 100 },
      connections: [`condition-${nodeId + 1}`],
      status: 'idle',
    })
    nodeId++
  }
  
  if (lowerPrompt.includes('stake') || lowerPrompt.includes('compound')) {
    actions.push({
      id: `action-${nodeId}`,
      type: 'action',
      name: 'Auto-Stake Rewards',
      description: 'Automatically stake earned rewards',
      parameters: { 
        token: 'FLOW',
        protocol: 'FlowStaking',
        autoCompound: true
      },
      position: { x: 300, y: 100 },
      connections: [`condition-${nodeId + 1}`],
      status: 'idle',
    })
    nodeId++
  }
  
  if (lowerPrompt.includes('send') || lowerPrompt.includes('transfer')) {
    actions.push({
      id: `action-${nodeId}`,
      type: 'action',
      name: 'Send Tokens',
      description: 'Send tokens to recipients',
      parameters: { 
        token: 'USDC',
        amount: 'dynamic',
        recipients: 'subscribers'
      },
      position: { x: 300, y: 100 },
      connections: [`condition-${nodeId + 1}`],
      status: 'idle',
    })
    nodeId++
  }
  
  // Add condition if profit/reward threshold mentioned
  if (lowerPrompt.includes('profit') || lowerPrompt.includes('reward') || lowerPrompt.includes('threshold')) {
    actions.push({
      id: `condition-${nodeId}`,
      type: 'condition',
      name: 'Profit Check',
      description: 'Check if profit exceeds threshold',
      parameters: { 
        threshold: 100,
        operator: '>',
        currency: 'USDC'
      },
      position: { x: 500, y: 100 },
      connections: [`action-${nodeId + 1}`, `output-${nodeId + 2}`],
      status: 'idle',
    })
    nodeId++
    
    // Add alert action
    actions.push({
      id: `action-${nodeId}`,
      type: 'action',
      name: 'Send Alert',
      description: 'Send notification about high profit',
      parameters: { 
        message: 'High profit detected!',
        channel: 'email'
      },
      position: { x: 700, y: 50 },
      connections: [`output-${nodeId + 1}`],
      status: 'idle',
    })
    nodeId++
  }
  
  // Add output nodes
  actions.push({
    id: `output-${nodeId}`,
    type: 'output',
    name: 'Success',
    description: 'Workflow completed successfully',
    parameters: {},
    position: { x: 700, y: 150 },
    connections: [],
    status: 'idle',
  })
  
  // Generate connections
  const connections = []
  for (let i = 0; i < actions.length - 1; i++) {
    if (actions[i].connections.length > 0) {
      connections.push({
        id: `conn-${i}`,
        from: actions[i].id,
        to: actions[i].connections[0],
      })
    }
  }
  
  // Generate execution plan
  const executionPlan = actions.map(node => node.id)
  
  return {
    id: `ai-workflow-${Date.now()}`,
    name: `AI Generated: ${prompt.substring(0, 50)}...`,
    description: `Automated workflow generated from: "${prompt}"`,
    nodes: actions,
    connections,
    variables: { 
      profit: 0, 
      totalGas: 0,
      executionCount: 0,
      lastExecution: new Date()
    },
    executionPlan,
    estimatedGas: '0.005 FLOW',
    successRate: 92,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Pre-built suggestions for common workflows
const WORKFLOW_SUGGESTIONS = [
  "Every Monday, mint NFT for my subscribers",
  "Auto-stake my FLOW rewards daily",
  "Send USDC to my community every Friday",
  "Compound my DeFi yields when profit > $50",
  "Mint birthday NFTs for my followers",
  "Rebalance portfolio weekly",
  "Send alerts when token price changes 10%",
  "Auto-harvest farming rewards",
]

export function AIWorkflowBuilder({ onWorkflowGenerated }: AIWorkflowBuilderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: "Hi! I'm your AI workflow assistant. I can help you create automated blockchain workflows using natural language. What would you like to automate?",
      timestamp: new Date(),
      suggestions: WORKFLOW_SUGGESTIONS.slice(0, 4),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState<ComposedWorkflow | null>(null)
  const [showWorkflowComposer, setShowWorkflowComposer] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsGenerating(true)

    try {
      // Generate workflow from AI
      const workflow = await generateWorkflowFromPrompt(inputValue)
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: `I've created a workflow for you! Here's what I built based on your request:`,
        timestamp: new Date(),
        workflow,
        suggestions: WORKFLOW_SUGGESTIONS.filter(s => s !== inputValue).slice(0, 3),
      }

      setMessages(prev => [...prev, aiMessage])
      setGeneratedWorkflow(workflow)
      
      if (onWorkflowGenerated) {
        onWorkflowGenerated(workflow)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: "I encountered an error while generating your workflow. Please try again with a different description.",
        timestamp: new Date(),
        suggestions: WORKFLOW_SUGGESTIONS.slice(0, 3),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleWorkflowAction = (action: 'edit' | 'execute' | 'share' | 'export') => {
    if (!generatedWorkflow) return

    switch (action) {
      case 'edit':
        setShowWorkflowComposer(true)
        break
      case 'execute':
        // Execute workflow logic would go here
        console.log('Executing workflow:', generatedWorkflow)
        break
      case 'share':
        // Share workflow logic would go here
        console.log('Sharing workflow:', generatedWorkflow)
        break
      case 'export':
        const dataStr = JSON.stringify(generatedWorkflow, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${generatedWorkflow.name}.json`
        link.click()
        break
    }
  }

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    if (message.type === 'user') {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-end mb-4"
        >
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-xs">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(message.timestamp).toISOString().slice(11, 19)}
            </p>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-start mb-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-muted rounded-lg px-4 py-2 max-w-md">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(message.timestamp).toISOString().slice(11, 19)}
            </p>
            
            {/* Generated Workflow Preview */}
            {message.workflow && (
              <Card className="mt-3 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Generated Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">{message.workflow.name}</h4>
                      <p className="text-xs text-muted-foreground">{message.workflow.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-600" />
                        <span>{message.workflow.estimatedGas}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>{message.workflow.successRate}% success</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>{message.workflow.nodes.length} steps</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('edit')}
                        className="text-xs"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('execute')}
                        className="text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Execute
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('share')}
                        className="text-xs"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('export')}
                        className="text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Try these examples:</p>
                <div className="space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-auto p-2 text-left justify-start hover:bg-muted/50"
                    >
                      <ArrowRight className="w-3 h-3 mr-2" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  if (showWorkflowComposer && generatedWorkflow) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Generated Workflow</h2>
          <Button
            variant="outline"
            onClick={() => setShowWorkflowComposer(false)}
          >
            Back to Chat
          </Button>
        </div>
        <WorkflowComposer />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI Workflow Builder</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe what you want to automate in plain English, and I'll create a blockchain workflow for you. 
          Perfect for creators, gamers, and DeFi users on Flow.
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Conversational Workflow Builder
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating your workflow...</span>
                    </div>
                    <Progress value={66} className="mt-2" />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your automation... (e.g., 'Every Monday, mint NFT for my subscribers')"
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
              size="lg"
              className="self-end"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
