'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PortfolioRebalancer } from '@/components/PortfolioRebalancer'
import { ArrowLeft, ExternalLink, TrendingUp, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioRebalancerPage() {
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
              <h1 className="text-4xl font-bold mb-2">Portfolio Rebalancer</h1>
              <p className="text-xl text-muted-foreground">
                Automatically maintain optimal asset allocation across your portfolio
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold">Average Deviation</h3>
                  <p className="text-2xl font-bold text-blue-600">2.1%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                From target allocation
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold">Gas Efficiency</h3>
                  <p className="text-2xl font-bold text-green-600">92%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Savings vs manual rebalancing
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-lg">🛡️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Risk Level</h3>
                  <p className="text-2xl font-bold text-purple-600">Low</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Slippage protection enabled
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
                <h2 className="text-2xl font-bold mb-6">How Portfolio Rebalancing Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="font-semibold mb-2">1. Monitor Allocation</h3>
                    <p className="text-sm text-muted-foreground">
                      Continuously track your portfolio's current allocation vs target allocation
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-2">2. Detect Deviation</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect when assets drift beyond your rebalance threshold
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <h3 className="font-semibold mb-2">3. Execute Trades</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically buy/sell assets to restore target allocation with minimal slippage
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Benefits of Automated Rebalancing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Improved Returns</h3>
                        <p className="text-sm text-muted-foreground">
                          Studies show rebalanced portfolios outperform buy-and-hold by 0.5-1% annually
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Risk Management</h3>
                        <p className="text-sm text-muted-foreground">
                          Maintain consistent risk profile by preventing asset drift
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Gas Efficiency</h3>
                        <p className="text-sm text-muted-foreground">
                          Batch multiple trades to minimize gas costs and slippage
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⏰</span>
                      <div>
                        <h3 className="font-semibold">24/7 Monitoring</h3>
                        <p className="text-sm text-muted-foreground">
                          Never miss rebalancing opportunities, even while you sleep
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🎯</span>
                      <div>
                        <h3 className="font-semibold">Precision Control</h3>
                        <p className="text-sm text-muted-foreground">
                          Set exact thresholds and intervals for optimal rebalancing
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-lg">📈</span>
                      <div>
                        <h3 className="font-semibold">Performance Tracking</h3>
                        <p className="text-sm text-muted-foreground">
                          Detailed analytics on rebalancing performance and gas usage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Component */}
              <PortfolioRebalancer />
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Portfolio Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rebalance Threshold (%)
                    </label>
                    <input
                      type="number"
                      placeholder="5.0"
                      step="0.1"
                      min="1"
                      max="10"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Trigger rebalancing when any asset deviates by this amount
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rebalance Interval
                    </label>
                    <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="3600">1 Hour</option>
                      <option value="86400">24 Hours</option>
                      <option value="604800">7 Days</option>
                      <option value="2592000">30 Days</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum time between rebalancing attempts
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Slippage Tolerance (%)
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
                      Maximum acceptable slippage per trade
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
                      Skip rebalancing if gas prices exceed this limit
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
                <h2 className="text-2xl font-bold mb-6">Rebalancing Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-muted-foreground">Total Rebalances</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$1,250</div>
                    <div className="text-sm text-muted-foreground">Value Added</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$180</div>
                    <div className="text-sm text-muted-foreground">Gas Saved</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics charts will be available once you start using the rebalancer.
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Start Rebalancing
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
