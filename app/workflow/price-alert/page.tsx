'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PriceAlertWorkflow } from '@/components/PriceAlertWorkflow'
import { ArrowLeft, ExternalLink, Bell, TrendingUp, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PriceAlertPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'configuration' | 'analytics'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'configuration', label: 'Configuration', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ]

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
            <div>
              <h1 className="text-4xl font-bold mb-2">Price Alert + Auto-Swap</h1>
              <p className="text-xl text-muted-foreground">
                Monitor token prices and execute trades automatically when conditions are met
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold">Execution Speed</h3>
                  <p className="text-2xl font-bold text-blue-600">&lt;30s</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Average execution time
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold">Accuracy</h3>
                  <p className="text-2xl font-bold text-green-600">99.2%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Successful executions
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-lg">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold">Gas Savings</h3>
                  <p className="text-2xl font-bold text-purple-600">35%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                vs manual trading
              </p>
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
            <div className="space-y-6">
              {/* How It Works */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">How Price Alerts Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔔</span>
                    </div>
                    <h3 className="font-semibold mb-2">1. Set Price Alert</h3>
                    <p className="text-sm text-muted-foreground">
                      Define target price and swap conditions for any token pair
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="font-semibold mb-2">2. Monitor Prices</h3>
                    <p className="text-sm text-muted-foreground">
                      Continuously track price movements across multiple DEXs
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-2">3. Auto Execute</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically execute swap when price conditions are met
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Real-time Monitoring</h3>
                        <p className="text-sm text-muted-foreground">
                          24/7 price monitoring with sub-second execution
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Smart Execution</h3>
                        <p className="text-sm text-muted-foreground">
                          Optimal routing across multiple DEXs for best prices
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Slippage Protection</h3>
                        <p className="text-sm text-muted-foreground">
                          Configurable slippage tolerance to prevent bad trades
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⚡</span>
                      <div>
                        <h3 className="font-semibold">Gas Optimization</h3>
                        <p className="text-sm text-muted-foreground">
                          Smart gas pricing to minimize transaction costs
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-lg">📱</span>
                      <div>
                        <h3 className="font-semibold">Mobile Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when alerts trigger or execute
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-lg">📊</span>
                      <div>
                        <h3 className="font-semibold">Performance Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                          Track success rates and profitability metrics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Component */}
              <PriceAlertWorkflow />
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Alert Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Slippage Tolerance (%)
                    </label>
                    <input
                      type="number"
                      placeholder="3.0"
                      step="0.1"
                      min="0.1"
                      max="10"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum acceptable slippage for all trades
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gas Price Limit (Gwei)
                    </label>
                    <input
                      type="number"
                      placeholder="50"
                      min="1"
                      max="200"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Skip execution if gas prices exceed this limit
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Trade Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      min="10"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum trade size to execute automatically
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Feed Source
                    </label>
                    <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="chainlink">Chainlink (Recommended)</option>
                      <option value="uniswap">Uniswap V3</option>
                      <option value="multiple">Multiple Sources (Best Price)</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose your preferred price feed source
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Save Configuration
                  </button>
                  <button className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Trading Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">47</div>
                    <div className="text-sm text-muted-foreground">Alerts Triggered</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$25.5K</div>
                    <div className="text-sm text-muted-foreground">Total Volume</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$1,250</div>
                    <div className="text-sm text-muted-foreground">Profit Generated</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$180</div>
                    <div className="text-sm text-muted-foreground">Gas Saved</div>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics charts will be available once you start using price alerts.
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Create First Alert
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer Links */}
        <div className="mt-12 glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Check out our documentation or join our community for support.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Documentation
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
