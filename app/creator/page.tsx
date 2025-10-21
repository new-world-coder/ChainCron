'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings,
  Upload,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function CreatorPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const mockWorkflows = [
    {
      id: 1,
      name: 'Auto-Compound DeFi Yields',
      subscribers: 142,
      revenue: 2.84,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Portfolio Rebalancer',
      subscribers: 89,
      revenue: 1.78,
      status: 'active',
      createdAt: '2024-02-01'
    },
    {
      id: 3,
      name: 'Price Alert System',
      subscribers: 67,
      revenue: 1.34,
      status: 'paused',
      createdAt: '2024-02-15'
    }
  ]

  const stats = {
    totalRevenue: 5.96,
    totalSubscribers: 298,
    activeWorkflows: 2,
    totalEarnings: 12.45
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Creator Dashboard
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Manage your workflows, track earnings, and grow your automation business.
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">{stats.totalRevenue} ETH</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSubscribers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeWorkflows}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalEarnings} ETH</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'workflows', label: 'My Workflows' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
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
              {/* Quick Actions */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Create New Workflow</p>
                      <p className="text-sm text-muted-foreground">Build and deploy automation</p>
                    </div>
                  </motion.button>

                  <motion.button
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">Upload Template</p>
                      <p className="text-sm text-muted-foreground">Import workflow template</p>
                    </div>
                  </motion.button>

                  <motion.button
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm text-muted-foreground">Performance insights</p>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New subscriber', workflow: 'Auto-Compound DeFi Yields', time: '2 hours ago' },
                    { action: 'Revenue earned', workflow: 'Portfolio Rebalancer', time: '4 hours ago' },
                    { action: 'Workflow updated', workflow: 'Price Alert System', time: '1 day ago' },
                    { action: 'New subscriber', workflow: 'Auto-Compound DeFi Yields', time: '2 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.workflow}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">My Workflows</h3>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Create Workflow
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockWorkflows.map((workflow) => (
                  <motion.div
                    key={workflow.id}
                    className="glass rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">Created {workflow.createdAt}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Subscribers</p>
                        <p className="font-semibold">{workflow.subscribers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-semibold">{workflow.revenue} ETH</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics coming soon...</p>
                <p className="text-sm text-muted-foreground">Track detailed performance metrics for your workflows</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Creator Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Creator Name</label>
                  <input
                    type="text"
                    defaultValue="DeFi Automation Pro"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Experienced DeFi developer creating automated strategies for maximum yield."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="creator@example.com"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <motion.button
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Settings
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}