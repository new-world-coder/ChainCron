'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Star, 
  Users, 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap,
  Play,
  Pause,
  Settings,
  ExternalLink,
  Copy,
  Share2,
  Heart,
  MessageCircle,
  BarChart3,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface WorkflowDetail {
  id: number
  name: string
  description: string
  creator: string
  creatorName: string
  price: number
  category: string
  subscribers: number
  rating: number
  reviews: number
  isActive: boolean
  createdAt: number
  lastUpdated: number
  totalExecutions: number
  successRate: number
  avgGasUsed: number
  totalVolume: number
  tags: string[]
  features: string[]
  requirements: string[]
  risks: string[]
}

interface ExecutionHistory {
  timestamp: number
  status: 'success' | 'failed' | 'pending'
  gasUsed: number
  profit: number
  details: string
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function WorkflowDetailPage() {
  const { address } = useAccount()
  const params = useParams()
  const workflowId = params?.id as string
  
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null)
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'reviews' | 'settings'>('overview')
  const [showShareModal, setShowShareModal] = useState(false)

  // Mock data based on workflow ID
  const mockWorkflows: Record<string, WorkflowDetail> = {
    '1': {
      id: 1,
      name: 'Auto-Compound DeFi Yield',
      description: 'Automatically compound your yield farming rewards to maximize returns. Monitors multiple DeFi protocols and executes compounding when optimal.',
      creator: '0x1234...5678',
      creatorName: 'DeFiMaster',
      price: 0.1,
      category: 'DeFi',
      subscribers: 1247,
      rating: 4.9,
      reviews: 89,
      isActive: true,
      createdAt: Date.now() - 2592000000, // 30 days ago
      lastUpdated: Date.now() - 86400000, // 1 day ago
      totalExecutions: 15420,
      successRate: 98.5,
      avgGasUsed: 180000,
      totalVolume: 2500000,
      tags: ['yield-farming', 'compound', 'defi', 'automation'],
      features: [
        'Multi-protocol support (Uniswap, Aave, Compound)',
        'Smart gas optimization',
        'Slippage protection',
        'Real-time APY monitoring',
        'Customizable thresholds'
      ],
      requirements: [
        'Minimum 0.1 ETH balance',
        'ERC-20 tokens for farming',
        'Sufficient gas for execution'
      ],
      risks: [
        'Smart contract risk',
        'Impermanent loss in LP positions',
        'Market volatility'
      ]
    },
    '2': {
      id: 2,
      name: 'Portfolio Rebalancer',
      description: 'Maintain optimal asset allocation by automatically rebalancing your portfolio when deviations exceed your threshold.',
      creator: '0x8765...4321',
      creatorName: 'PortfolioPro',
      price: 0.15,
      category: 'Portfolio',
      subscribers: 892,
      rating: 4.8,
      reviews: 67,
      isActive: true,
      createdAt: Date.now() - 1728000000, // 20 days ago
      lastUpdated: Date.now() - 172800000, // 2 days ago
      totalExecutions: 8920,
      successRate: 97.2,
      avgGasUsed: 220000,
      totalVolume: 1800000,
      tags: ['rebalancing', 'portfolio', 'diversification', 'risk-management'],
      features: [
        'Custom allocation targets',
        'Threshold-based triggers',
        'Multi-token support',
        'Gas-efficient batching',
        'Risk assessment'
      ],
      requirements: [
        'Multiple token holdings',
        'Minimum $1000 portfolio value',
        'DEX liquidity for swaps'
      ],
      risks: [
        'Slippage during rebalancing',
        'Market timing risk',
        'Gas cost fluctuations'
      ]
    },
    '3': {
      id: 3,
      name: 'Token Price Alert + Auto-Swap',
      description: 'Monitor token prices and automatically execute swaps when your target conditions are met.',
      creator: '0x5678...9012',
      creatorName: 'PriceHunter',
      price: 0.05,
      category: 'Trading',
      subscribers: 2156,
      rating: 4.7,
      reviews: 134,
      isActive: true,
      createdAt: Date.now() - 1209600000, // 14 days ago
      lastUpdated: Date.now() - 259200000, // 3 days ago
      totalExecutions: 28450,
      successRate: 96.8,
      avgGasUsed: 150000,
      totalVolume: 4200000,
      tags: ['price-alerts', 'trading', 'automation', 'swaps'],
      features: [
        'Real-time price monitoring',
        'Custom price targets',
        'Multi-DEX routing',
        'Slippage protection',
        'Mobile notifications'
      ],
      requirements: [
        'Token balance for swapping',
        'Gas for execution',
        'Price feed connectivity'
      ],
      risks: [
        'Price volatility',
        'Slippage risk',
        'Network congestion'
      ]
    }
  }

  const mockExecutionHistory: ExecutionHistory[] = [
    { timestamp: Date.now() - 3600000, status: 'success', gasUsed: 180000, profit: 25.50, details: 'Compounded ETH-USDC LP rewards' },
    { timestamp: Date.now() - 7200000, status: 'success', gasUsed: 175000, profit: 18.75, details: 'Compounded Aave USDC rewards' },
    { timestamp: Date.now() - 10800000, status: 'success', gasUsed: 185000, profit: 32.10, details: 'Compounded Compound ETH rewards' },
    { timestamp: Date.now() - 14400000, status: 'failed', gasUsed: 0, profit: 0, details: 'Insufficient gas for execution' },
    { timestamp: Date.now() - 18000000, status: 'success', gasUsed: 190000, profit: 28.90, details: 'Compounded Uniswap V3 rewards' }
  ]

  useEffect(() => {
    if (workflowId && mockWorkflows[workflowId]) {
      setWorkflow(mockWorkflows[workflowId])
      setExecutionHistory(mockExecutionHistory)
    }
  }, [workflowId])

  const handleSubscribe = async () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    setIsSubscribing(true)
    // Simulate subscription process
    setTimeout(() => {
      setIsSubscribing(false)
      setIsSubscribed(true)
    }, 2000)
  }

  const handleShare = () => {
    setShowShareModal(true)
    // Copy link to clipboard
    navigator.clipboard.writeText(window.location.href)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatPrice = (price: number) => {
    return `${price.toFixed(3)} ETH`
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workflow Not Found</h1>
          <Link href="/marketplace" className="text-primary hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/marketplace"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{workflow.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{workflow.rating}</span>
                  <span className="text-muted-foreground">({workflow.reviews})</span>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-4">{workflow.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{workflow.subscribers.toLocaleString()} subscribers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Created {formatTime(workflow.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{workflow.successRate}% success rate</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubscribe}
                disabled={isSubscribing || isSubscribed}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin inline mr-2" />
                    Subscribing...
                  </>
                ) : isSubscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 inline mr-2" />
                    Subscribe for {formatPrice(workflow.price)}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass rounded-xl p-2 mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Features */}
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workflow.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                  <div className="space-y-3">
                    {workflow.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Risk Assessment</h2>
                  <div className="space-y-3">
                    {workflow.risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Creator Info */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Creator</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {workflow.creatorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{workflow.creatorName}</h4>
                      <p className="text-sm text-muted-foreground">{workflow.creator}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors">
                      Follow
                    </button>
                    <button className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Executions</span>
                      <span className="font-semibold">{workflow.totalExecutions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-green-600">{workflow.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Gas Used</span>
                      <span className="font-semibold">{workflow.avgGasUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Volume</span>
                      <span className="font-semibold">${workflow.totalVolume.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {workflow.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{workflow.successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{workflow.totalExecutions.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Executions</div>
                </div>
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">${workflow.totalVolume.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{workflow.avgGasUsed.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Avg Gas Used</div>
                </div>
              </div>

              {/* Execution History */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6">Recent Executions</h3>
                <div className="space-y-4">
                  {executionHistory.map((execution, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          execution.status === 'success' ? 'bg-green-500' :
                          execution.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-semibold">{execution.details}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatTime(execution.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          execution.profit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {execution.profit > 0 ? '+' : ''}${execution.profit.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {execution.gasUsed.toLocaleString()} gas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6">Reviews ({workflow.reviews})</h3>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Reviews and ratings will be available once users start using this workflow.
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Be the First to Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6">Workflow Settings</h3>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Configuration options will be available once you subscribe to this workflow.
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Subscribe to Configure
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
