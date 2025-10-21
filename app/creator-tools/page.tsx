'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreatorTools } from '@/components/CreatorTools'
import { ArrowLeft, ExternalLink, TrendingUp, Users, DollarSign, Star } from 'lucide-react'
import Link from 'next/link'

export default function CreatorToolsPage() {
  const [activeView, setActiveView] = useState<'tools' | 'guidelines' | 'support'>('tools')

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
              <h1 className="text-4xl font-bold mb-2">Creator Tools</h1>
              <p className="text-xl text-muted-foreground">
                Build, publish, and monetize your automated workflows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === 'guidelines' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveView('guidelines')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Guidelines
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === 'support' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveView('support')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Support
              </motion.button>
            </div>
          </div>

          {/* Creator Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold">Total Earnings</h3>
                  <p className="text-2xl font-bold text-green-600">$10,000</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                +25% from last month
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold">Total Subscribers</h3>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Across 5 workflows
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-lg">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold">Average Rating</h3>
                  <p className="text-2xl font-bold text-purple-600">4.8</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                89 total reviews
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 text-lg">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold">Creator Fee</h3>
                  <p className="text-2xl font-bold text-orange-600">80%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Revenue share
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
          {activeView === 'tools' && <CreatorTools />}
          
          {activeView === 'guidelines' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Creator Guidelines</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Workflow Requirements</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Workflows must be fully automated and require minimal user intervention</li>
                      <li>• All smart contracts must be audited or use audited libraries</li>
                      <li>• Clear documentation and setup instructions are required</li>
                      <li>• Workflows must have a clear value proposition for users</li>
                      <li>• Pricing must be reasonable and competitive</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Revenue Sharing</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Creators receive 80% of subscription revenue</li>
                      <li>• Platform takes 20% for infrastructure and maintenance</li>
                      <li>• Payments are made in USDC on a monthly basis</li>
                      <li>• Minimum withdrawal amount is $100</li>
                      <li>• Withdrawals are processed within 7 business days</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Quality Standards</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Maintain a minimum 95% success rate</li>
                      <li>• Respond to user feedback within 48 hours</li>
                      <li>• Keep workflows updated with latest protocol changes</li>
                      <li>• Provide clear error handling and recovery mechanisms</li>
                      <li>• Regular testing and monitoring of workflow performance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Prohibited Content</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Workflows that promote illegal activities</li>
                      <li>• Ponzi schemes or pyramid schemes</li>
                      <li>• Workflows with excessive gas consumption</li>
                      <li>• Copying other creators' work without permission</li>
                      <li>• Misleading or false advertising</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'support' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Creator Support</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Technical Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get help with smart contract development, testing, and deployment.
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Contact Technical Team
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Marketing Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get help promoting your workflows and growing your subscriber base.
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Contact Marketing Team
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Revenue Questions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Questions about payments, withdrawals, and revenue sharing.
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Contact Finance Team
                    </button>
                  </div>
                  
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Community</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join our creator community for tips, best practices, and networking.
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Join Discord
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
