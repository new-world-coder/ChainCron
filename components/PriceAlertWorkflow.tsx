'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Settings, 
  Play, 
  Pause,
  RefreshCw,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface PriceAlert {
  id: number
  tokenIn: string
  tokenOut: string
  tokenInSymbol: string
  tokenOutSymbol: string
  targetPrice: number
  amountIn: number
  isAbove: boolean
  slippageTolerance: number
  isActive: boolean
  createdAt: number
  triggeredAt: number
  currentPrice: number
}

interface TokenInfo {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function PriceAlertWorkflow() {
  const { address } = useAccount()
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [isCreatingAlert, setIsCreatingAlert] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string>('ETH')

  // Mock data for demonstration
  const mockAlerts: PriceAlert[] = [
    {
      id: 1,
      tokenIn: 'ETH',
      tokenOut: 'USDC',
      tokenInSymbol: 'ETH',
      tokenOutSymbol: 'USDC',
      targetPrice: 2200,
      amountIn: 1.5,
      isAbove: true,
      slippageTolerance: 300, // 3%
      isActive: true,
      createdAt: Date.now() - 86400000, // 1 day ago
      triggeredAt: 0,
      currentPrice: 2150
    },
    {
      id: 2,
      tokenIn: 'USDC',
      tokenOut: 'ETH',
      tokenInSymbol: 'USDC',
      tokenOutSymbol: 'ETH',
      targetPrice: 0.00045, // 1/2200
      amountIn: 3000,
      isAbove: false,
      slippageTolerance: 200, // 2%
      isActive: true,
      createdAt: Date.now() - 172800000, // 2 days ago
      triggeredAt: 0,
      currentPrice: 0.000465
    }
  ]

  const mockTokens: TokenInfo[] = [
    { symbol: 'ETH', name: 'Ethereum', price: 2150, change24h: 2.5, volume24h: 15000000 },
    { symbol: 'USDC', name: 'USD Coin', price: 1, change24h: 0.1, volume24h: 8000000 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: 45000, change24h: -1.2, volume24h: 5000000 },
    { symbol: 'LINK', name: 'Chainlink', price: 15.5, change24h: 5.8, volume24h: 2000000 }
  ]

  // Mock price history data
  const priceHistory = [
    { time: '00:00', ETH: 2100, USDC: 1.0, WBTC: 45500, LINK: 14.5 },
    { time: '04:00', ETH: 2120, USDC: 1.0, WBTC: 45200, LINK: 14.8 },
    { time: '08:00', ETH: 2140, USDC: 1.0, WBTC: 44800, LINK: 15.2 },
    { time: '12:00', ETH: 2130, USDC: 1.0, WBTC: 45100, LINK: 15.0 },
    { time: '16:00', ETH: 2150, USDC: 1.0, WBTC: 45000, LINK: 15.5 },
    { time: '20:00', ETH: 2160, USDC: 1.0, WBTC: 44900, LINK: 15.3 },
    { time: '24:00', ETH: 2150, USDC: 1.0, WBTC: 45000, LINK: 15.5 }
  ]

  useEffect(() => {
    // Load user's alerts
    setAlerts(mockAlerts)
  }, [address])

  const handleCreateAlert = async () => {
    setIsCreatingAlert(true)
    // Simulate alert creation
    setTimeout(() => {
      setIsCreatingAlert(false)
      setShowCreateForm(false)
      // Add new alert to list
    }, 2000)
  }

  const handleCancelAlert = async (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6)
    } else if (price < 1) {
      return price.toFixed(4)
    } else {
      return price.toFixed(2)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.triggeredAt > 0) {
      return { status: 'triggered', color: 'text-green-600', icon: CheckCircle }
    }
    
    const priceDiff = alert.isAbove 
      ? alert.currentPrice - alert.targetPrice
      : alert.targetPrice - alert.currentPrice
    
    if (priceDiff >= 0) {
      return { status: 'ready', color: 'text-orange-600', icon: AlertTriangle }
    }
    
    return { status: 'waiting', color: 'text-blue-600', icon: Bell }
  }

  const activeAlerts = alerts.filter(alert => alert.isActive && alert.triggeredAt === 0)
  const triggeredAlerts = alerts.filter(alert => alert.triggeredAt > 0)

  if (!address) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to create and manage price alerts.
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
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Price Alert + Auto-Swap</h2>
              <p className="text-muted-foreground">Monitor prices and execute trades automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              onClick={() => setShowCreateForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Alert
            </motion.button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Active Alerts</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {activeAlerts.length}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Triggered</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {triggeredAlerts.length}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Volume</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              $12.5K
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              98.5%
            </div>
          </div>
        </div>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Create Price Alert</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Token to Sell</label>
              <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                {mockTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Token to Buy</label>
              <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                {mockTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target Price</label>
              <input
                type="number"
                placeholder="2200"
                step="0.01"
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Amount to Swap</label>
              <input
                type="number"
                placeholder="1.5"
                step="0.01"
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Alert Condition</label>
              <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="above">Price goes above target</option>
                <option value="below">Price goes below target</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Slippage Tolerance (%)</label>
              <input
                type="number"
                placeholder="3.0"
                step="0.1"
                min="0.1"
                max="10"
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <motion.button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreateAlert}
              disabled={isCreatingAlert}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCreatingAlert ? (
                <>
                  <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Alert
                </>
              )}
            </motion.button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Active Alerts */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Active Alerts</h3>
        
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active alerts. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => {
              const status = getAlertStatus(alert)
              const StatusIcon = status.icon
              
              return (
                <div key={alert.id} className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                        <div>
                          <h4 className="font-semibold">
                            {alert.tokenInSymbol} → {alert.tokenOutSymbol}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.isAbove ? 'Above' : 'Below'} ${formatPrice(alert.targetPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold">${formatPrice(alert.currentPrice)}</div>
                        <div className="text-sm text-muted-foreground">Current Price</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">{alert.amountIn} {alert.tokenInSymbol}</div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-semibold ${status.color}`}>
                          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">Status</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          onClick={() => handleCancelAlert(alert.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Current: ${formatPrice(alert.currentPrice)}</span>
                      <span>Target: ${formatPrice(alert.targetPrice)}</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            alert.isAbove ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(
                              alert.isAbove 
                                ? ((alert.currentPrice / alert.targetPrice) * 100)
                                : ((alert.targetPrice / alert.currentPrice) * 100), 
                              100
                            )}%` 
                          }}
                        />
                      </div>
                      <div 
                        className="absolute top-0 h-2 border-r-2 border-gray-400"
                        style={{ left: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Price Chart */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Price History (24h)</h3>
          <div className="flex gap-2">
            {mockTokens.map((token, index) => (
              <motion.button
                key={token.symbol}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  selectedToken === token.symbol
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setSelectedToken(token.symbol)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {token.symbol}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toFixed(2)}`, selectedToken]}
                labelFormatter={(value) => `Time: ${value}`}
              />
              <Area 
                type="monotone" 
                dataKey={selectedToken} 
                stroke={CHART_COLORS[0]} 
                fill={CHART_COLORS[0]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Recently Triggered</h3>
          <div className="space-y-4">
            {triggeredAlerts.map((alert) => (
              <div key={alert.id} className="glass rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">
                        {alert.tokenInSymbol} → {alert.tokenOutSymbol}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Triggered at ${formatPrice(alert.currentPrice)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-800 dark:text-green-200">
                      {formatTime(alert.triggeredAt)}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Executed Successfully
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
