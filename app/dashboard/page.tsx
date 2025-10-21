'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserDashboard } from '@/components/UserDashboard'
import { ArrowLeft, Bell, Settings, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'notifications' | 'export'>('dashboard')

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
              <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Monitor your automated workflows and track your earnings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className={`p-2 rounded-lg transition-colors ${
                  activeView === 'notifications' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveView('notifications')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                className={`p-2 rounded-lg transition-colors ${
                  activeView === 'export' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveView('export')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold">Total Earnings</h3>
                  <p className="text-2xl font-bold text-green-600">$8,750</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                +12.5% from last month
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold">Active Workflows</h3>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                1,247 total executions
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold">Success Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">97.8%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                $1,250 gas saved
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'dashboard' && <UserDashboard />}
          
          {activeView === 'notifications' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Auto-Compound DeFi Yield executed successfully</h3>
                      <p className="text-sm text-muted-foreground">
                        Earned $25.50 • 2 minutes ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Portfolio Rebalancer triggered</h3>
                      <p className="text-sm text-muted-foreground">
                        Rebalanced ETH allocation • 1 hour ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Price Alert + Auto-Swap paused</h3>
                      <p className="text-sm text-muted-foreground">
                        Insufficient gas for execution • 3 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'export' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Export Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Transaction History</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export all your workflow executions and transactions
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Download CSV
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Performance Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a detailed performance report
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Generate PDF
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Tax Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export data for tax reporting purposes
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Download Tax CSV
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Analytics Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export raw analytics data for analysis
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Download JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}