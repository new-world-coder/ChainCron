'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, GitBranch, Zap, CheckCircle, Clock, Settings } from 'lucide-react'
import Link from 'next/link'
import { WorkflowComposer } from '@/components/WorkflowComposer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ComposePage() {
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
              <h1 className="text-4xl font-bold mb-2">Workflow Composer</h1>
              <p className="text-xl text-muted-foreground">
                Create complex workflows by chaining multiple automation steps together
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GitBranch className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Composed Workflows</h3>
                    <p className="text-2xl font-bold text-blue-600">47</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Multi-step automations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Avg Steps</h3>
                    <p className="text-2xl font-bold text-green-600">5.2</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Per workflow
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Success Rate</h3>
                    <p className="text-2xl font-bold text-purple-600">96.8%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Execution success
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Avg Duration</h3>
                    <p className="text-2xl font-bold text-orange-600">12m</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Execution time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Workflow Composition Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="font-semibold mb-2">Drag & Drop Chaining</h3>
                <p className="text-sm text-muted-foreground">
                  Connect workflows with visual flow lines and conditional routing
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Variable Passing</h3>
                <p className="text-sm text-muted-foreground">
                  Pass data between workflows with type checking and transformations
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🧪</div>
                <h3 className="font-semibold mb-2">Testing & Simulation</h3>
                <p className="text-sm text-muted-foreground">
                  Test entire workflows with dry-run mode and execution simulation
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="font-semibold mb-2">Reusable Components</h3>
                <p className="text-sm text-muted-foreground">
                  Create sub-workflows and templates for common automation patterns
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">Execution Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized execution order with dependency resolution and validation
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🏪</div>
                <h3 className="font-semibold mb-2">Marketplace Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Publish composed workflows to the marketplace with pricing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Composer */}
        <WorkflowComposer />

        {/* Popular Compositions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Popular Workflow Compositions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'DeFi Yield Optimizer',
                  description: 'Auto-compound → Rebalance → Alert on high profits',
                  steps: 4,
                  successRate: 97,
                  gas: '0.012 ETH',
                  users: 1247,
                },
                {
                  name: 'Portfolio Manager',
                  description: 'Monitor → Rebalance → Tax optimization → Reporting',
                  steps: 5,
                  successRate: 94,
                  gas: '0.018 ETH',
                  users: 892,
                },
                {
                  name: 'Arbitrage Bot',
                  description: 'Price monitor → Cross-DEX swap → Profit tracking',
                  steps: 3,
                  successRate: 89,
                  gas: '0.008 ETH',
                  users: 654,
                },
                {
                  name: 'Risk Manager',
                  description: 'Risk assessment → Position adjustment → Emergency stop',
                  steps: 4,
                  successRate: 96,
                  gas: '0.010 ETH',
                  users: 432,
                },
                {
                  name: 'Tax Optimizer',
                  description: 'Transaction tracking → Loss harvesting → Reporting',
                  steps: 6,
                  successRate: 98,
                  gas: '0.015 ETH',
                  users: 321,
                },
                {
                  name: 'Liquidity Manager',
                  description: 'LP monitoring → Fee collection → Compound rewards',
                  steps: 4,
                  successRate: 92,
                  gas: '0.011 ETH',
                  users: 567,
                },
              ].map((composition, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{composition.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{composition.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4 text-blue-600" />
                        <span>{composition.steps} steps</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{composition.successRate}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span>{composition.gas}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {composition.users} users
                      </Badge>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

