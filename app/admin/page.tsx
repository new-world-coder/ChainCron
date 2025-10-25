'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const mockUsers = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2 hours ago',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      address: '0x1234567890123456789012345678901234567890',
      role: 'creator',
      status: 'active',
      createdAt: '2024-02-01',
      lastLogin: '1 day ago',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      address: '0x9876543210987654321098765432109876543210',
      role: 'subscriber',
      status: 'pending',
      createdAt: '2024-02-15',
      lastLogin: 'Never',
    },
  ]

  const mockWorkflows = [
    {
      id: '1',
      name: 'Auto-Compound DeFi Yields',
      creator: 'Bob Smith',
      status: 'approved',
      subscribers: 142,
      revenue: 2.84,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Portfolio Rebalancer',
      creator: 'Bob Smith',
      status: 'pending',
      subscribers: 89,
      revenue: 1.78,
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'Price Alert System',
      creator: 'Alice Johnson',
      status: 'rejected',
      subscribers: 67,
      revenue: 1.34,
      createdAt: '2024-02-15',
    },
  ]

  const stats = {
    totalUsers: 1247,
    totalCreators: 89,
    totalSubscribers: 1158,
    totalWorkflows: 156,
    pendingApprovals: 12,
    totalRevenue: 45.67,
    activeWorkflows: 144,
  }

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredWorkflows = mockWorkflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.creator.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Manage users, moderate workflows, and monitor platform analytics.
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
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
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
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
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
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalRevenue} ETH</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
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
                <p className="text-sm text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeWorkflows}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'User Management' },
              { id: 'workflows', label: 'Workflow Moderation' },
              { id: 'analytics', label: 'Analytics & Reports' },
              { id: 'settings', label: 'System Settings' },
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
              {/* Recent Activity */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New workflow submitted', user: 'Bob Smith', time: '2 hours ago', type: 'workflow' },
                    { action: 'User registered', user: 'Carol Davis', time: '4 hours ago', type: 'user' },
                    { action: 'Workflow approved', user: 'Alice Johnson', time: '6 hours ago', type: 'approval' },
                    { action: 'Revenue generated', user: 'System', time: '8 hours ago', type: 'revenue' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'workflow' ? 'bg-blue-500' :
                          activity.type === 'user' ? 'bg-green-500' :
                          activity.type === 'approval' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Smart Contracts</p>
                      <p className="text-sm text-green-600">All systems operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">API Services</p>
                      <p className="text-sm text-green-600">Running smoothly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Database</p>
                      <p className="text-sm text-yellow-600">High load detected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Monitoring</p>
                      <p className="text-sm text-green-600">All checks passed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="glass rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">User</th>
                        <th className="text-left py-3 px-4 font-medium">Role</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Last Login</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground font-mono">{user.address}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'creator' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {user.lastLogin}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-6">
              {/* Workflow Moderation */}
              <div className="glass rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Workflow Moderation</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                      Approved: {mockWorkflows.filter(w => w.status === 'approved').length}
                    </button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                      Pending: {mockWorkflows.filter(w => w.status === 'pending').length}
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                      Rejected: {mockWorkflows.filter(w => w.status === 'rejected').length}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredWorkflows.map((workflow) => (
                    <div key={workflow.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{workflow.name}</h4>
                          <p className="text-sm text-muted-foreground">by {workflow.creator}</p>
                          <p className="text-xs text-muted-foreground">Created {workflow.createdAt}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.status === 'approved' ? 'bg-green-100 text-green-800' :
                          workflow.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {workflow.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Subscribers</p>
                          <p className="font-semibold">{workflow.subscribers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-semibold">{workflow.revenue} ETH</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-semibold capitalize">{workflow.status}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 px-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                <p className="text-sm text-muted-foreground">Track detailed platform metrics and user behavior</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">System Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="ChainCron"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Default Creator Fee</label>
                  <input
                    type="number"
                    defaultValue="80"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Platform Fee</label>
                  <input
                    type="number"
                    defaultValue="20"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
