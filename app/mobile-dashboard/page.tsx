'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  MobileLayout, 
  MobileCard, 
  MobileButton, 
  MobileStatsGrid,
  MobileChartContainer,
  MobileList,
  MobilePullToRefresh
} from '@/components/MobileLayout'
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Clock,
  Users,
  Download,
  Share2,
  RefreshCw,
  Bell,
  Settings
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

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

const performanceData = [
  { date: '2024-01-01', earnings: 1000, executions: 50 },
  { date: '2024-01-15', earnings: 1250, executions: 75 },
  { date: '2024-02-01', earnings: 1500, executions: 100 },
  { date: '2024-02-15', earnings: 1750, executions: 125 },
  { date: '2024-03-01', earnings: 2000, executions: 150 },
  { date: '2024-03-15', earnings: 2250, executions: 175 },
  { date: '2024-04-01', earnings: 2500, executions: 200 },
  { date: '2024-04-15', earnings: 2750, executions: 225 },
  { date: '2024-05-01', earnings: 3000, executions: 250 },
  { date: '2024-05-15', earnings: 3250, executions: 275 },
  { date: '2024-06-01', earnings: 3500, executions: 300 },
  { date: '2024-06-15', earnings: 3750, executions: 325 }
]

export default function MobileDashboard() {
  const { address } = useAccount()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [workflows, setWorkflows] = useState<WorkflowPerformance[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setStats(mockStats)
    setWorkflows(mockWorkflows)
  }, [address])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!address) {
    return (
      <MobileLayout currentPage="dashboard">
        <div className="p-4">
          <MobileCard>
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to view your dashboard.
              </p>
              <MobileButton variant="primary" size="lg">
                Connect Wallet
              </MobileButton>
            </div>
          </MobileCard>
        </div>
      </MobileLayout>
    )
  }

  const statsData = [
    {
      label: 'Total Value',
      value: formatCurrency(stats?.totalValue || 0),
      change: `+${stats?.monthlyGrowth || 0}%`,
      changeType: 'positive' as const
    },
    {
      label: 'Earnings',
      value: formatCurrency(stats?.totalEarnings || 0),
      change: `${stats?.avgROI || 0}% ROI`,
      changeType: 'positive' as const
    },
    {
      label: 'Workflows',
      value: stats?.activeWorkflows?.toString() || '0',
      change: `${stats?.totalExecutions || 0} exec`,
      changeType: 'neutral' as const
    },
    {
      label: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      change: `$${stats?.gasSaved || 0} saved`,
      changeType: 'positive' as const
    }
  ]

  return (
    <MobileLayout currentPage="dashboard">
      <MobilePullToRefresh onRefresh={handleRefresh}>
        <div className="p-4">
          {/* Quick Stats */}
          <MobileStatsGrid stats={statsData} />

          {/* Performance Chart */}
          <MobileChartContainer title="Earnings Over Time">
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
          </MobileChartContainer>

          {/* Active Workflows */}
          <MobileCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Workflows</h3>
              <MobileButton variant="outline" size="sm">
                View All
              </MobileButton>
            </div>
            
            <MobileList
              items={workflows.slice(0, 3)}
              renderItem={(workflow, index) => (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      workflow.status === 'active' ? 'bg-green-500' :
                      workflow.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-semibold text-sm">{workflow.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {workflow.category} • {workflow.executions} exec
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-600 text-sm">
                      {formatCurrency(workflow.earnings)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {workflow.successRate}% success
                    </div>
                  </div>
                </div>
              )}
            />
          </MobileCard>

          {/* Quick Actions */}
          <MobileCard>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <MobileButton variant="primary" size="lg">
                <Zap className="w-4 h-4 inline mr-2" />
                Create Workflow
              </MobileButton>
              <MobileButton variant="outline" size="lg">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                View Analytics
              </MobileButton>
            </div>
          </MobileCard>

          {/* Recent Activity */}
          <MobileCard>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <MobileList
              items={workflows.slice(0, 3)}
              renderItem={(workflow, index) => (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{workflow.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Executed • {formatTime(workflow.lastExecution)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      +{formatCurrency(workflow.earnings / workflow.executions)}
                    </div>
                  </div>
                </div>
              )}
            />
          </MobileCard>

          {/* Notifications */}
          <MobileCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-800">
                    Auto-Compound executed successfully
                  </div>
                  <div className="text-xs text-green-700">
                    Earned $25.50 • 2 minutes ago
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-blue-800">
                    Portfolio rebalanced
                  </div>
                  <div className="text-xs text-blue-700">
                    ETH allocation adjusted • 1 hour ago
                  </div>
                </div>
              </div>
            </div>
          </MobileCard>
        </div>
      </MobilePullToRefresh>
    </MobileLayout>
  )
}
