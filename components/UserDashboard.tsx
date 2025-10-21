'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Zap,
  Settings,
  Bell,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface DashboardStats {
  totalValue: number
  totalEarnings: number
  activeWorkflows: number
  totalExecutions: number
  successRate: number
  gasSaved: number
  avgROI: number
  monthlyGrowth: number
}

interface WorkflowPerformance {
  id: number
  name: string
  category: string
  earnings: number
  executions: number
  successRate: number
  status: 'active' | 'paused' | 'error'
  lastExecution: number
}

interface ExecutionHistory {
  timestamp: number
  workflowName: string
  status: 'success' | 'failed' | 'pending'
  earnings: number
  gasUsed: number
  txHash: string
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export function UserDashboard() {
  const { address } = useAccount()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [workflows, setWorkflows] = useState<WorkflowPerformance[]>([])
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'analytics' | 'settings'>('overview')

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalValue: 125000,
    totalEarnings: 8750,
    activeWorkflows: 8,
    totalExecutions: 1247,
    successRate: 97.8,
    gasSaved: 1250,
    avgROI: 12.5,
    monthlyGrowth: 8.2
  }

  const mockWorkflows: WorkflowPerformance[] = [
    { id: 1, name: 'Auto-Compound DeFi Yield', category: 'DeFi', earnings: 3250, executions: 156, successRate: 98.5, status: 'active', lastExecution: Date.now() - 3600000 },
    { id: 2, name: 'Portfolio Rebalancer', category: 'Portfolio', earnings: 2100, executions: 89, successRate: 97.2, status: 'active', lastExecution: Date.now() - 7200000 },
    { id: 3, name: 'Price Alert + Auto-Swap', category: 'Trading', earnings: 1800, executions: 234, successRate: 96.8, status: 'active', lastExecution: Date.now() - 1800000 },
    { id: 4, name: 'DCA Bitcoin Strategy', category: 'DCA', earnings: 950, executions: 67, successRate: 99.1, status: 'paused', lastExecution: Date.now() - 86400000 },
    { id: 5, name: 'Yield Farming Optimizer', category: 'DeFi', earnings: 650, executions: 45, successRate: 95.5, status: 'active', lastExecution: Date.now() - 10800000 }
  ]

  const mockExecutionHistory: ExecutionHistory[] = [
    { timestamp: Date.now() - 3600000, workflowName: 'Auto-Compound DeFi Yield', status: 'success', earnings: 25.50, gasUsed: 180000, txHash: '0x1234...5678' },
    { timestamp: Date.now() - 7200000, workflowName: 'Portfolio Rebalancer', status: 'success', earnings: 18.75, gasUsed: 220000, txHash: '0x8765...4321' },
    { timestamp: Date.now() - 10800000, workflowName: 'Price Alert + Auto-Swap', status: 'success', earnings: 32.10, gasUsed: 150000, txHash: '0x5678...9012' },
    { timestamp: Date.now() - 14400000, workflowName: 'Auto-Compound DeFi Yield', status: 'failed', earnings: 0, gasUsed: 0, txHash: '0x3456...7890' },
    { timestamp: Date.now() - 18000000, workflowName: 'Yield Farming Optimizer', status: 'success', earnings: 28.90, gasUsed: 190000, txHash: '0x9012...3456' }
  ]

  // Mock performance data
  const performanceData = [
    { date: '2024-01-01', earnings: 1000, executions: 50, gasUsed: 5000000 },
    { date: '2024-01-15', earnings: 1250, executions: 75, gasUsed: 6000000 },
    { date: '2024-02-01', earnings: 1500, executions: 100, gasUsed: 7000000 },
    { date: '2024-02-15', earnings: 1750, executions: 125, gasUsed: 8000000 },
    { date: '2024-03-01', earnings: 2000, executions: 150, gasUsed: 9000000 },
    { date: '2024-03-15', earnings: 2250, executions: 175, gasUsed: 10000000 },
    { date: '2024-04-01', earnings: 2500, executions: 200, gasUsed: 11000000 },
    { date: '2024-04-15', earnings: 2750, executions: 225, gasUsed: 12000000 },
    { date: '2024-05-01', earnings: 3000, executions: 250, gasUsed: 13000000 },
    { date: '2024-05-15', earnings: 3250, executions: 275, gasUsed: 14000000 },
    { date: '2024-06-01', earnings: 3500, executions: 300, gasUsed: 15000000 },
    { date: '2024-06-15', earnings: 3750, executions: 325, gasUsed: 16000000 },
    { date: '2024-07-01', earnings: 4000, executions: 350, gasUsed: 17000000 },
    { date: '2024-07-15', earnings: 4250, executions: 375, gasUsed: 18000000 },
    { date: '2024-08-01', earnings: 4500, executions: 400, gasUsed: 19000000 },
    { date: '2024-08-15', earnings: 4750, executions: 425, gasUsed: 20000000 },
    { date: '2024-09-01', earnings: 5000, executions: 450, gasUsed: 21000000 },
    { date: '2024-09-15', earnings: 5250, executions: 475, gasUsed: 22000000 },
    { date: '2024-10-01', earnings: 5500, executions: 500, gasUsed: 23000000 },
    { date: '2024-10-15', earnings: 5750, executions: 525, gasUsed: 24000000 },
    { date: '2024-11-01', earnings: 6000, executions: 550, gasUsed: 25000000 },
    { date: '2024-11-15', earnings: 6250, executions: 575, gasUsed: 26000000 },
    { date: '2024-12-01', earnings: 6500, executions: 600, gasUsed: 27000000 },
    { date: '2024-12-15', earnings: 6750, executions: 625, gasUsed: 28000000 },
    { date: '2025-01-01', earnings: 7000, executions: 650, gasUsed: 29000000 },
    { date: '2025-01-15', earnings: 7250, executions: 675, gasUsed: 30000000 },
    { date: '2025-02-01', earnings: 7500, executions: 700, gasUsed: 31000000 },
    { date: '2025-02-15', earnings: 7750, executions: 725, gasUsed: 32000000 },
    { date: '2025-03-01', earnings: 8000, executions: 750, gasUsed: 33000000 },
    { date: '2025-03-15', earnings: 8250, executions: 775, gasUsed: 34000000 },
    { date: '2025-04-01', earnings: 8500, executions: 800, gasUsed: 35000000 },
    { date: '2025-04-15', earnings: 8750, executions: 825, gasUsed: 36000000 }
  ]

  const categoryData = [
    { name: 'DeFi', value: 45, color: CHART_COLORS[0] },
    { name: 'Trading', value: 25, color: CHART_COLORS[1] },
    { name: 'Portfolio', value: 20, color: CHART_COLORS[2] },
    { name: 'DCA', value: 10, color: CHART_COLORS[3] }
  ]

  useEffect(() => {
    setStats(mockStats)
    setWorkflows(mockWorkflows)
    setExecutionHistory(mockExecutionHistory)
  }, [address])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'workflows', label: 'Workflows', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  if (!address) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to view your dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your automation overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export Data
            </motion.button>
            <motion.button
              className="px-4 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4 inline mr-2" />
              Share
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats?.totalValue || 0)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +{stats?.monthlyGrowth || 0}% this month
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats?.totalEarnings || 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats?.avgROI || 0}% avg ROI
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Active Workflows</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.activeWorkflows || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats?.totalExecutions || 0} total executions
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.successRate || 0}%
            </div>
            <div className="text-sm text-muted-foreground">
              ${stats?.gasSaved || 0} gas saved
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass rounded-xl p-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Earnings Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'earnings' ? formatCurrency(Number(value)) : Number(value).toLocaleString(),
                        name === 'earnings' ? 'Earnings' : 'Executions'
                      ]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Workflow Categories */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Workflow Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Executions */}
            <div className="glass rounded-xl p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Recent Executions</h3>
              <div className="space-y-3">
                {executionHistory.slice(0, 5).map((execution, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        execution.status === 'success' ? 'bg-green-500' :
                        execution.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <div className="font-semibold">{execution.workflowName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(execution.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        execution.earnings > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {execution.earnings > 0 ? '+' : ''}{formatCurrency(execution.earnings)}
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

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Your Workflows</h3>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          workflow.status === 'active' ? 'bg-green-500' :
                          workflow.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{workflow.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {workflow.category} • Last execution: {formatTime(workflow.lastExecution)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            {formatCurrency(workflow.earnings)}
                          </div>
                          <div className="text-sm text-muted-foreground">Earnings</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">{workflow.executions}</div>
                          <div className="text-sm text-muted-foreground">Executions</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">
                            {workflow.successRate}%
                          </div>
                          <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                        
                        <div className="flex gap-2">
                          <motion.button
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Settings className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Execution Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [Number(value).toLocaleString(), 'Executions']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Bar dataKey="executions" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Gas Usage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [Number(value).toLocaleString(), 'Gas Used']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gasUsed" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Dashboard Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Time Range</label>
                  <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Currency Display</label>
                  <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="USD">USD</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-sm text-muted-foreground">Receive updates about your workflows</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Mobile Push Notifications</label>
                    <p className="text-sm text-muted-foreground">Get notified on your mobile device</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Save Settings
                </button>
                <button className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
