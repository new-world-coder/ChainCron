'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings, 
  Play, 
  Pause,
  Edit,
  Eye,
  Download,
  Share2,
  BarChart3,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface CreatorStats {
  totalWorkflows: number
  totalSubscribers: number
  totalRevenue: number
  totalEarnings: number
  pendingWithdrawals: number
  avgRating: number
  totalReviews: number
}

interface WorkflowData {
  id: number
  name: string
  description: string
  price: number
  subscribers: number
  revenue: number
  earnings: number
  rating: number
  reviews: number
  status: 'active' | 'paused' | 'draft'
  createdAt: number
  lastUpdated: number
}

interface RevenueData {
  date: string
  revenue: number
  subscribers: number
  earnings: number
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function CreatorTools() {
  const { address } = useAccount()
  const [stats, setStats] = useState<CreatorStats | null>(null)
  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'analytics' | 'earnings'>('overview')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock data for demonstration
  const mockStats: CreatorStats = {
    totalWorkflows: 5,
    totalSubscribers: 1247,
    totalRevenue: 12500,
    totalEarnings: 10000,
    pendingWithdrawals: 2500,
    avgRating: 4.8,
    totalReviews: 89
  }

  const mockWorkflows: WorkflowData[] = [
    {
      id: 1,
      name: 'Auto-Compound DeFi Yield',
      description: 'Automatically compound your yield farming rewards to maximize returns',
      price: 0.1,
      subscribers: 456,
      revenue: 4560,
      earnings: 3648,
      rating: 4.9,
      reviews: 34,
      status: 'active',
      createdAt: Date.now() - 2592000000,
      lastUpdated: Date.now() - 86400000
    },
    {
      id: 2,
      name: 'Portfolio Rebalancer',
      description: 'Maintain optimal asset allocation by automatically rebalancing your portfolio',
      price: 0.15,
      subscribers: 234,
      revenue: 3510,
      earnings: 2808,
      status: 'active',
      rating: 4.7,
      reviews: 28,
      createdAt: Date.now() - 1728000000,
      lastUpdated: Date.now() - 172800000
    },
    {
      id: 3,
      name: 'Price Alert + Auto-Swap',
      description: 'Monitor token prices and automatically execute swaps when conditions are met',
      price: 0.05,
      subscribers: 567,
      revenue: 2835,
      earnings: 2268,
      rating: 4.8,
      reviews: 27,
      status: 'active',
      createdAt: Date.now() - 1209600000,
      lastUpdated: Date.now() - 259200000
    }
  ]

  const mockRevenueData: RevenueData[] = [
    { date: '2024-01-01', revenue: 500, subscribers: 25, earnings: 400 },
    { date: '2024-01-15', revenue: 750, subscribers: 38, earnings: 600 },
    { date: '2024-02-01', revenue: 1000, subscribers: 50, earnings: 800 },
    { date: '2024-02-15', revenue: 1250, subscribers: 63, earnings: 1000 },
    { date: '2024-03-01', revenue: 1500, subscribers: 75, earnings: 1200 },
    { date: '2024-03-15', revenue: 1750, subscribers: 88, earnings: 1400 },
    { date: '2024-04-01', revenue: 2000, subscribers: 100, earnings: 1600 },
    { date: '2024-04-15', revenue: 2250, subscribers: 113, earnings: 1800 },
    { date: '2024-05-01', revenue: 2500, subscribers: 125, earnings: 2000 },
    { date: '2024-05-15', revenue: 2750, subscribers: 138, earnings: 2200 },
    { date: '2024-06-01', revenue: 3000, subscribers: 150, earnings: 2400 },
    { date: '2024-06-15', revenue: 3250, subscribers: 163, earnings: 2600 },
    { date: '2024-07-01', revenue: 3500, subscribers: 175, earnings: 2800 },
    { date: '2024-07-15', revenue: 3750, subscribers: 188, earnings: 3000 },
    { date: '2024-08-01', revenue: 4000, subscribers: 200, earnings: 3200 },
    { date: '2024-08-15', revenue: 4250, subscribers: 213, earnings: 3400 },
    { date: '2024-09-01', revenue: 4500, subscribers: 225, earnings: 3600 },
    { date: '2024-09-15', revenue: 4750, subscribers: 238, earnings: 3800 },
    { date: '2024-10-01', revenue: 5000, subscribers: 250, earnings: 4000 },
    { date: '2024-10-15', revenue: 5250, subscribers: 263, earnings: 4200 },
    { date: '2024-11-01', revenue: 5500, subscribers: 275, earnings: 4400 },
    { date: '2024-11-15', revenue: 5750, subscribers: 288, earnings: 4600 },
    { date: '2024-12-01', revenue: 6000, subscribers: 300, earnings: 4800 },
    { date: '2024-12-15', revenue: 6250, subscribers: 313, earnings: 5000 },
    { date: '2025-01-01', revenue: 6500, subscribers: 325, earnings: 5200 },
    { date: '2025-01-15', revenue: 6750, subscribers: 338, earnings: 5400 },
    { date: '2025-02-01', revenue: 7000, subscribers: 350, earnings: 5600 },
    { date: '2025-02-15', revenue: 7250, subscribers: 363, earnings: 5800 },
    { date: '2025-03-01', revenue: 7500, subscribers: 375, earnings: 6000 },
    { date: '2025-03-15', revenue: 7750, subscribers: 388, earnings: 6200 },
    { date: '2025-04-01', revenue: 8000, subscribers: 400, earnings: 6400 },
    { date: '2025-04-15', revenue: 8250, subscribers: 413, earnings: 6600 },
    { date: '2025-05-01', revenue: 8500, subscribers: 425, earnings: 6800 },
    { date: '2025-05-15', revenue: 8750, subscribers: 438, earnings: 7000 },
    { date: '2025-06-01', revenue: 9000, subscribers: 450, earnings: 7200 },
    { date: '2025-06-15', revenue: 9250, subscribers: 463, earnings: 7400 },
    { date: '2025-07-01', revenue: 9500, subscribers: 475, earnings: 7600 },
    { date: '2025-07-15', revenue: 9750, subscribers: 488, earnings: 7800 },
    { date: '2025-08-01', revenue: 10000, subscribers: 500, earnings: 8000 },
    { date: '2025-08-15', revenue: 10250, subscribers: 513, earnings: 8200 },
    { date: '2025-09-01', revenue: 10500, subscribers: 525, earnings: 8400 },
    { date: '2025-09-15', revenue: 10750, subscribers: 538, earnings: 8600 },
    { date: '2025-10-01', revenue: 11000, subscribers: 550, earnings: 8800 },
    { date: '2025-10-15', revenue: 11250, subscribers: 563, earnings: 9000 },
    { date: '2025-11-01', revenue: 11500, subscribers: 575, earnings: 9200 },
    { date: '2025-11-15', revenue: 11750, subscribers: 588, earnings: 9400 },
    { date: '2025-12-01', revenue: 12000, subscribers: 600, earnings: 9600 },
    { date: '2025-12-15', revenue: 12250, subscribers: 613, earnings: 9800 },
    { date: '2026-01-01', revenue: 12500, subscribers: 625, earnings: 10000 }
  ]

  const categoryData = [
    { name: 'DeFi', value: 60, color: CHART_COLORS[0] },
    { name: 'Trading', value: 25, color: CHART_COLORS[1] },
    { name: 'Portfolio', value: 15, color: CHART_COLORS[2] }
  ]

  useEffect(() => {
    setStats(mockStats)
    setWorkflows(mockWorkflows)
    setRevenueData(mockRevenueData)
  }, [address])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const handleWithdraw = async () => {
    // Simulate withdrawal process
    console.log('Withdrawing earnings...')
  }

  const handleCreateWorkflow = async () => {
    setShowCreateForm(true)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'workflows', label: 'Workflows', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'earnings', label: 'Earnings', icon: '💰' }
  ]

  if (!address) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to access creator tools.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Creator Tools</h2>
              <p className="text-muted-foreground">Manage your workflows and track your earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              onClick={handleCreateWorkflow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Workflow
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +15.2% this month
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats?.totalEarnings || 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(stats?.pendingWithdrawals || 0)} pending
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Subscribers</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.totalSubscribers.toLocaleString() || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats?.totalWorkflows || 0} workflows
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Average Rating</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.avgRating || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats?.totalReviews || 0} reviews
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
            {/* Revenue Chart */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Revenue Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData.slice(-12)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : Number(value).toLocaleString(),
                        name === 'revenue' ? 'Revenue' : 'Subscribers'
                      ]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
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

            {/* Recent Activity */}
            <div className="glass rounded-xl p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {workflows.slice(0, 3).map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        workflow.status === 'active' ? 'bg-green-500' :
                        workflow.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <div className="font-semibold">{workflow.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.subscribers} subscribers • Last updated: {formatTime(workflow.lastUpdated)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(workflow.earnings)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {workflow.rating} ⭐ ({workflow.reviews} reviews)
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
                          workflow.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{workflow.name}</h4>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold">{workflow.subscribers}</div>
                          <div className="text-sm text-muted-foreground">Subscribers</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            {formatCurrency(workflow.earnings)}
                          </div>
                          <div className="text-sm text-muted-foreground">Earnings</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">{workflow.rating} ⭐</div>
                          <div className="text-sm text-muted-foreground">{workflow.reviews} reviews</div>
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
                            <Edit className="w-4 h-4" />
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
                <h3 className="text-xl font-semibold mb-4">Subscriber Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [Number(value).toLocaleString(), 'Subscribers']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Bar dataKey="subscribers" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Earnings Distribution</h3>
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
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Earnings Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(stats?.totalEarnings || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
                
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(stats?.pendingWithdrawals || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Withdrawal</div>
                </div>
                
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">80%</div>
                  <div className="text-sm text-muted-foreground">Creator Fee</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  onClick={handleWithdraw}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Withdraw All Earnings
                </motion.button>
                <button className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                  View Transaction History
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
