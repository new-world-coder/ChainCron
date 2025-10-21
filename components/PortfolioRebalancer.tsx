'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  PieChart, 
  BarChart3, 
  Settings, 
  Play, 
  Pause,
  RefreshCw,
  TrendingUp,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'

interface PortfolioConfig {
  tokens: string[]
  targetAllocations: number[]
  rebalanceThreshold: number
  rebalanceInterval: number
  isActive: boolean
  totalRebalances: number
  lastRebalanceTime: number
}

interface TokenInfo {
  symbol: string
  name: string
  price: number
  balance: number
  value: number
  targetAllocation: number
  currentAllocation: number
  deviation: number
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export function PortfolioRebalancer() {
  const { address } = useAccount()
  const [config, setConfig] = useState<PortfolioConfig | null>(null)
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isRebalancing, setIsRebalancing] = useState(false)
  const [showChart, setShowChart] = useState(false)

  // Mock data for demonstration
  const mockConfig: PortfolioConfig = {
    tokens: ['ETH', 'USDC', 'WBTC', 'LINK'],
    targetAllocations: [4000, 3000, 2000, 1000], // 40%, 30%, 20%, 10%
    rebalanceThreshold: 500, // 5%
    rebalanceInterval: 86400, // 24 hours
    isActive: true,
    totalRebalances: 12,
    lastRebalanceTime: Date.now() - 3600000 // 1 hour ago
  }

  const mockTokens: TokenInfo[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2000,
      balance: 2.5,
      value: 5000,
      targetAllocation: 4000, // 40%
      currentAllocation: 4500, // 45%
      deviation: 500 // 5% over target
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      price: 1,
      balance: 3000,
      value: 3000,
      targetAllocation: 3000, // 30%
      currentAllocation: 2700, // 27%
      deviation: -300 // 3% under target
    },
    {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      price: 45000,
      balance: 0.1,
      value: 4500,
      targetAllocation: 2000, // 20%
      currentAllocation: 2025, // 20.25%
      deviation: 25 // 0.25% over target
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      price: 15,
      balance: 100,
      value: 1500,
      targetAllocation: 1000, // 10%
      currentAllocation: 775, // 7.75%
      deviation: -225 // 2.25% under target
    }
  ]

  // Mock historical rebalancing data
  const rebalanceHistory = [
    { date: '2024-01-01', totalValue: 10000, gasUsed: 150000 },
    { date: '2024-01-15', totalValue: 10500, gasUsed: 180000 },
    { date: '2024-02-01', totalValue: 11000, gasUsed: 165000 },
    { date: '2024-02-15', totalValue: 10800, gasUsed: 170000 },
    { date: '2024-03-01', totalValue: 11200, gasUsed: 160000 },
    { date: '2024-03-15', totalValue: 11500, gasUsed: 175000 },
    { date: '2024-04-01', totalValue: 11800, gasUsed: 155000 },
    { date: '2024-04-15', totalValue: 12000, gasUsed: 180000 },
    { date: '2024-05-01', totalValue: 12200, gasUsed: 165000 },
    { date: '2024-05-15', totalValue: 12500, gasUsed: 170000 },
    { date: '2024-06-01', totalValue: 12800, gasUsed: 160000 },
    { date: '2024-06-15', totalValue: 13000, gasUsed: 175000 }
  ]

  useEffect(() => {
    // Load user's portfolio configuration
    setConfig(mockConfig)
    setTokens(mockTokens)
  }, [address])

  const handleConfigure = async () => {
    setIsConfiguring(true)
    // Simulate configuration process
    setTimeout(() => {
      setIsConfiguring(false)
      // Update config with new values
    }, 2000)
  }

  const handleRebalance = async () => {
    setIsRebalancing(true)
    // Simulate rebalancing process
    setTimeout(() => {
      setIsRebalancing(false)
      // Update tokens after rebalancing
    }, 3000)
  }

  const handleTogglePortfolio = async () => {
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

  const needsRebalancing = tokens.some(token => Math.abs(token.deviation) > (config?.rebalanceThreshold || 0))

  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0)

  if (!address) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to configure and manage your portfolio rebalancing.
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
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Portfolio Rebalancer</h2>
              <p className="text-muted-foreground">Maintain optimal asset allocation automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                config?.isActive 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={handleTogglePortfolio}
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
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${totalValue.toLocaleString()}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Rebalance Threshold</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {(config?.rebalanceThreshold || 0) / 100}%
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Rebalances</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {config?.totalRebalances || 0}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {needsRebalancing ? (
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              <span className="text-sm font-medium">Status</span>
            </div>
            <div className={`text-2xl font-bold ${needsRebalancing ? 'text-orange-600' : 'text-green-600'}`}>
              {needsRebalancing ? 'Needs Rebalance' : 'Balanced'}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Current Allocation</h3>
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

        {/* Token List */}
        <div className="space-y-4 mb-6">
          {tokens.map((token, index) => (
            <div key={token.symbol} className="glass rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                       style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}>
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{token.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold">${token.value.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{token.balance} {token.symbol}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{token.currentAllocation / 100}%</div>
                    <div className="text-sm text-muted-foreground">Target: {token.targetAllocation / 100}%</div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${token.deviation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {token.deviation > 0 ? '+' : ''}{token.deviation / 100}%
                    </div>
                    <div className="text-sm text-muted-foreground">Deviation</div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(token.currentAllocation / 100, 100)}%` }}
                    />
                  </div>
                  <div 
                    className="absolute top-0 h-2 border-r-2 border-red-500"
                    style={{ left: `${token.targetAllocation / 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {showChart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Allocation Pie Chart */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Portfolio Allocation</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={tokens.map((token, index) => ({
                        name: token.symbol,
                        value: token.currentAllocation,
                        color: CHART_COLORS[index % CHART_COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value / 100}%`}
                    >
                      {tokens.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value) / 100}%`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rebalancing History */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Rebalancing History</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rebalanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'totalValue' ? `$${Number(value).toLocaleString()}` : `${Number(value).toLocaleString()} gas`,
                        name === 'totalValue' ? 'Portfolio Value' : 'Gas Used'
                      ]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalValue" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
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
          </motion.div>
        )}
      </div>

      {/* Configuration Details */}
      {config && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Configuration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Rebalance Threshold
              </label>
              <div className="p-3 bg-muted rounded-lg">
                {(config.rebalanceThreshold / 100).toFixed(1)}%
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Rebalance Interval
              </label>
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                {formatInterval(config.rebalanceInterval)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Last Rebalance
              </label>
              <div className="p-3 bg-muted rounded-lg">
                {formatTime(config.lastRebalanceTime)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Next Rebalance Check
              </label>
              <div className="p-3 bg-muted rounded-lg">
                {formatTime(config.lastRebalanceTime + config.rebalanceInterval)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Manual Actions</h3>
            <p className="text-muted-foreground">
              Execute rebalancing manually or configure your portfolio settings.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRebalance}
              disabled={isRebalancing || !config?.isActive || !needsRebalancing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRebalancing ? (
                <>
                  <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                  Rebalancing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Rebalance Now
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
