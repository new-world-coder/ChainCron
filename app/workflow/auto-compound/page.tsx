'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AutoCompoundWorkflow } from '@/components/AutoCompoundWorkflow'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AutoCompoundPage() {
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
              <h1 className="text-4xl font-bold mb-2">Auto-Compound DeFi Yield</h1>
              <p className="text-xl text-muted-foreground">
                Automatically compound your yield farming rewards to maximize returns
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold">Average APY</h3>
                  <p className="text-2xl font-bold text-green-600">12.5%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on current DeFi protocols
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold">Gas Efficiency</h3>
                  <p className="text-2xl font-bold text-blue-600">85%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Savings vs manual compounding
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
                Audited smart contracts
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
                <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <h3 className="font-semibold mb-2">1. Monitor Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Continuously monitor your yield farming rewards across DeFi protocols
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-2">2. Auto Compound</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically harvest and reinvest rewards when threshold is met
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="font-semibold mb-2">3. Maximize Returns</h3>
                    <p className="text-sm text-muted-foreground">
                      Compound interest effect increases your yield exponentially over time
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Protocols */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Supported Protocols</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Uniswap V3', logo: '🦄', apy: '8-15%' },
                    { name: 'Aave', logo: '👻', apy: '5-12%' },
                    { name: 'Compound', logo: '🔷', apy: '4-10%' },
                    { name: 'Curve', logo: '🌊', apy: '6-18%' }
                  ].map((protocol) => (
                    <div key={protocol.name} className="glass rounded-lg p-4 text-center">
                      <div className="text-3xl mb-2">{protocol.logo}</div>
                      <h3 className="font-semibold mb-1">{protocol.name}</h3>
                      <p className="text-sm text-muted-foreground">{protocol.apy} APY</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Workflow Component */}
              <AutoCompoundWorkflow />
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Configuration Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Yield Token Address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reward Token Address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Reward Threshold ($)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Compound Interval
                    </label>
                    <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="3600">1 Hour</option>
                      <option value="86400">24 Hours</option>
                      <option value="604800">7 Days</option>
                      <option value="2592000">30 Days</option>
                    </select>
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
                <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+$1,250</div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <div className="text-sm text-muted-foreground">Compounds</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$45</div>
                    <div className="text-sm text-muted-foreground">Gas Saved</div>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics charts will be available once you start using the workflow.
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Start Workflow
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
