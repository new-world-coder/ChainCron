'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Settings, 
  Play, 
  Pause,
  RefreshCw,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AutoCompoundConfig {
  yieldToken: string
  rewardToken: string
  minRewardThreshold: number
  compoundInterval: number
  isActive: boolean
  totalCompounded: number
  compoundCount: number
  lastCompoundTime: number
}

interface WorkflowStats {
  currentAPY: number
  pendingRewards: number
  yieldTokenBalance: number
  projectedEarnings: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function AutoCompoundWorkflow() {
  const { address } = useAccount()
  const [config, setConfig] = useState<AutoCompoundConfig | null>(null)
  const [stats, setStats] = useState<WorkflowStats | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [showChart, setShowChart] = useState(false)

  // Mock data for demonstration
  const mockConfig: AutoCompoundConfig = {
    yieldToken: '0x1234...5678',
    rewardToken: '0x8765...4321',
    minRewardThreshold: 10, // $10 minimum
    compoundInterval: 86400, // 24 hours
    isActive: true,
    totalCompounded: 1250.50,
    compoundCount: 45,
    lastCompoundTime: Date.now() - 3600000 // 1 hour ago
  }

  const mockStats: WorkflowStats = {
    currentAPY: 12.5,
    pendingRewards: 25.75,
    yieldTokenBalance: 5000,
    projectedEarnings: {
      daily: 1.71,
      weekly: 12.0,
      monthly: 52.08,
      yearly: 625
    }
  }

  // Mock historical data for charts
  const historicalData = [
    { date: '2024-01-01', balance: 1000, rewards: 0 },
    { date: '2024-01-15', balance: 1050, rewards: 50 },
    { date: '2024-02-01', balance: 1102, rewards: 102 },
    { date: '2024-02-15', balance: 1157, rewards: 157 },
    { date: '2024-03-01', balance: 1215, rewards: 215 },
    { date: '2024-03-15', balance: 1276, rewards: 276 },
    { date: '2024-04-01', balance: 1340, rewards: 340 },
    { date: '2024-04-15', balance: 1407, rewards: 407 },
    { date: '2024-05-01', balance: 1477, rewards: 477 },
    { date: '2024-05-15', balance: 1551, rewards: 551 },
    { date: '2024-06-01', balance: 1628, rewards: 628 },
    { date: '2024-06-15', balance: 1709, rewards: 709 },
    { date: '2024-07-01', balance: 1795, rewards: 795 },
    { date: '2024-07-15', balance: 1885, rewards: 885 },
    { date: '2024-08-01', balance: 1979, rewards: 979 },
    { date: '2024-08-15', balance: 2078, rewards: 1078 },
    { date: '2024-09-01', balance: 2182, rewards: 1182 },
    { date: '2024-09-15', balance: 2291, rewards: 1291 },
    { date: '2024-10-01', balance: 2406, rewards: 1406 },
    { date: '2024-10-15', balance: 2526, rewards: 1526 },
    { date: '2024-11-01', balance: 2652, rewards: 1652 },
    { date: '2024-11-15', balance: 2785, rewards: 1785 },
    { date: '2024-12-01', balance: 2924, rewards: 1924 },
    { date: '2024-12-15', balance: 3070, rewards: 2070 },
    { date: '2025-01-01', balance: 3224, rewards: 2224 },
    { date: '2025-01-15', balance: 3385, rewards: 2385 },
    { date: '2025-02-01', balance: 3554, rewards: 2554 },
    { date: '2025-02-15', balance: 3732, rewards: 2732 },
    { date: '2025-03-01', balance: 3919, rewards: 2919 },
    { date: '2025-03-15', balance: 4115, rewards: 3115 },
    { date: '2025-04-01', balance: 4321, rewards: 3321 },
    { date: '2025-04-15', balance: 4537, rewards: 3537 },
    { date: '2025-05-01', balance: 4764, rewards: 3764 },
    { date: '2025-05-15', balance: 5002, rewards: 4002 }
  ]

  const allocationData = [
    { name: 'ETH-USDC LP', value: 60, color: CHART_COLORS[0] },
    { name: 'ETH Rewards', value: 25, color: CHART_COLORS[1] },
    { name: 'USDC Rewards', value: 15, color: CHART_COLORS[2] }
  ]

  useEffect(() => {
    // Load user's workflow configuration
    setConfig(mockConfig)
    setStats(mockStats)
  }, [address])

  const handleConfigure = async () => {
    setIsConfiguring(true)
    // Simulate configuration process
    setTimeout(() => {
      setIsConfiguring(false)
      // Update config with new values
    }, 2000)
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    // Simulate execution process
    setTimeout(() => {
      setIsExecuting(false)
      // Update stats after execution
    }, 3000)
  }

  const handleToggleWorkflow = async () => {
    if (config) {
      setConfig({
        ...config,
        isActive: !config.isActive
      })
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatInterval = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''}`
    }
  }

  if (!address) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to configure and manage your Auto-Compound workflow.
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
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Auto-Compound DeFi Yield</h2>
              <p className="text-muted-foreground">Automatically compound your yield farming rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                config?.isActive 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={handleToggleWorkflow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {config?.isActive ? (
                <>
                  <Pause className="w-4 h-4 inline mr-2" />
                  Active
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 inline mr-2" />
                  Paused
                </>
              )}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              onClick={() => setIsConfiguring(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configure
            </motion.button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Current APY</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {stats?.currentAPY.toFixed(2)}%
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Pending Rewards</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.pendingRewards.toFixed(2)}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Compounded</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ${config?.totalCompounded.toFixed(2)}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Compounds</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {config?.compoundCount}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      {config && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Workflow Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Yield Token
              </label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                {config.yieldToken}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Reward Token
              </label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                {config.rewardToken}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Minimum Reward Threshold
              </label>
              <div className="p-3 bg-muted rounded-lg">
                ${config.minRewardThreshold}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Compound Interval
              </label>
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatInterval(config.compoundInterval)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Last Compound
              </label>
              <div className="p-3 bg-muted rounded-lg">
                {formatTime(config.lastCompoundTime)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Next Compound
              </label>
              <div className="p-3 bg-muted rounded-lg">
                {formatTime(config.lastCompoundTime + config.compoundInterval)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projected Earnings */}
      {stats && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Projected Earnings</h3>
            <motion.button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              onClick={() => setShowChart(!showChart)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              {showChart ? 'Hide' : 'Show'} Chart
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${stats.projectedEarnings.daily.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${stats.projectedEarnings.weekly.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Weekly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${stats.projectedEarnings.monthly.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${stats.projectedEarnings.yearly.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Yearly</div>
            </div>
          </div>

          {showChart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Growth Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Portfolio Growth Over Time</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `$${Number(value).toFixed(2)}`, 
                          name === 'balance' ? 'Portfolio Value' : 'Total Rewards'
                        ]}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rewards" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Allocation Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Current Allocation</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Manual Actions</h3>
            <p className="text-muted-foreground">
              Execute compounding manually or configure your workflow settings.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExecute}
              disabled={isExecuting || !config?.isActive}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 inline mr-2" />
                  Execute Now
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
