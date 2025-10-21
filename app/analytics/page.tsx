'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { EnhancedAnalytics } from '@/components/EnhancedAnalytics'
import { ArrowLeft, Settings, Download, Share2, BarChart3, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState<'analytics' | 'reports' | 'alerts'>('analytics')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Advanced Analytics</h1>
              <p className="text-xl text-muted-foreground">
                Deep insights into your automation performance and risk analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === 'reports' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveView('reports')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Reports
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === 'alerts' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveView('alerts')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Alerts
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold">Performance Score</h3>
                  <p className="text-2xl font-bold text-green-600">94.5%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Above average efficiency
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">⚠️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Risk Level</h3>
                  <p className="text-2xl font-bold text-blue-600">Low</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                3.2/10 risk score
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-lg">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold">Success Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">97.8%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                1,247 total executions
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 text-lg">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold">Growth Rate</h3>
                  <p className="text-2xl font-bold text-orange-600">+8.2%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Monthly growth
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
          {activeView === 'analytics' && <EnhancedAnalytics />}
          
          {activeView === 'reports' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Analytics Reports</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Performance Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive analysis of your workflow performance over time
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Generate PDF Report
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed risk analysis and recommendations for your portfolio
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Generate Risk Report
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Earnings Summary</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed breakdown of earnings and ROI across all workflows
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Generate Earnings Report
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Custom Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a custom report with specific metrics and time ranges
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Create Custom Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'alerts' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Analytics Alerts</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-100 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">Performance Above Target</h3>
                      <p className="text-sm text-green-700">
                        Your ROI is 12.5%, exceeding the 10% target by 25%
                      </p>
                    </div>
                    <span className="text-xs text-green-600">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-yellow-100 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800">Gas Price Alert</h3>
                      <p className="text-sm text-yellow-700">
                        Gas prices have increased by 15% - consider delaying non-critical executions
                      </p>
                    </div>
                    <span className="text-xs text-yellow-600">1 hour ago</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800">Risk Level Change</h3>
                      <p className="text-sm text-blue-700">
                        Market volatility has increased - risk score updated to 3.2/10
                      </p>
                    </div>
                    <span className="text-xs text-blue-600">30 minutes ago</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-100 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-800">Efficiency Milestone</h3>
                      <p className="text-sm text-purple-700">
                        Gas efficiency has reached 94.5% - congratulations on the optimization!
                      </p>
                    </div>
                    <span className="text-xs text-purple-600">1 day ago</span>
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
