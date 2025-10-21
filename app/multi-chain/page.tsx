'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, Zap, Shield, TrendingUp, Settings } from 'lucide-react'
import Link from 'next/link'
import { ChainSelector } from '@/components/ChainSelector'
import { CrossChainWorkflowMarketplace } from '@/components/CrossChainWorkflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SUPPORTED_CHAINS, CHAIN_LOGOS, getAllChains, getOnlineChains } from '@/lib/chains/registry'

export default function MultiChainPage() {
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'marketplace' | 'create' | 'monitor'>('marketplace')

  const allChains = getAllChains()
  const onlineChains = getOnlineChains()

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
              <h1 className="text-4xl font-bold mb-2">Multi-Chain Workflows</h1>
              <p className="text-xl text-muted-foreground">
                Execute workflows across multiple blockchains with seamless cross-chain automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Chain Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Supported Chains</h3>
                    <p className="text-2xl font-bold text-blue-600">{allChains.length}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Multi-chain ecosystem
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
                    <h3 className="font-semibold">Online Chains</h3>
                    <p className="text-2xl font-bold text-green-600">{onlineChains.length}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Ready for execution
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Bridge Protocols</h3>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Secure cross-chain bridges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Success Rate</h3>
                    <p className="text-2xl font-bold text-orange-600">94.2%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Cross-chain executions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chain Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Select Supported Chains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChainSelector
              selectedChains={selectedChains}
              onChainsChange={setSelectedChains}
              multiSelect={true}
              showGasPrices={true}
              showStatus={true}
            />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
            { id: 'create', label: 'Create Workflow', icon: '🛠️' },
            { id: 'monitor', label: 'Monitor', icon: '📊' },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <span>{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'marketplace' && <CrossChainWorkflowMarketplace />}
          
          {activeTab === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle>Create Multi-Chain Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛠️</div>
                  <h3 className="text-xl font-semibold mb-2">Workflow Builder Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">
                    Create custom multi-chain workflows with our visual builder
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">
                      <span className="mr-2">📋</span>
                      Use Template
                    </Button>
                    <Button>
                      <span className="mr-2">🚀</span>
                      Start Building
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'monitor' && (
            <Card>
              <CardHeader>
                <CardTitle>Multi-Chain Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Chain Status */}
                  <div>
                    <h4 className="font-semibold mb-3">Chain Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allChains.map((chain) => (
                        <div key={chain.name} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{CHAIN_LOGOS[chain.name.toLowerCase()]}</span>
                              <span className="font-medium">{chain.name}</span>
                            </div>
                            <Badge
                              variant={chain.status === 'online' ? 'default' : 'secondary'}
                              className={chain.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                            >
                              {chain.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Gas: {chain.gasPrice} {chain.nativeCurrency.symbol}</div>
                            <div>DEX Routers: {chain.dexRouters.length}</div>
                            <div>Bridges: {chain.bridgeContracts.length}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Executions */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Cross-Chain Executions</h4>
                    <div className="space-y-3">
                      {[
                        {
                          id: 1,
                          workflow: 'Bridge USDC from Ethereum to Polygon',
                          chains: ['ethereum', 'polygon'],
                          status: 'success',
                          time: '2 minutes ago',
                          gas: '0.004 ETH',
                        },
                        {
                          id: 2,
                          workflow: 'Multi-Chain Arbitrage',
                          chains: ['ethereum', 'polygon', 'arbitrum'],
                          status: 'success',
                          time: '5 minutes ago',
                          gas: '0.007 ETH',
                        },
                        {
                          id: 3,
                          workflow: 'Cross-Chain Yield Farming',
                          chains: ['ethereum', 'base'],
                          status: 'pending',
                          time: '8 minutes ago',
                          gas: '0.003 ETH',
                        },
                      ].map((execution) => (
                        <div key={execution.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${
                            execution.status === 'success' ? 'bg-green-500' : 
                            execution.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div className="flex-1">
                            <div className="font-medium">{execution.workflow}</div>
                            <div className="text-sm text-muted-foreground">
                              {execution.chains.map(chain => CHAIN_LOGOS[chain]).join(' → ')} • {execution.time}
                            </div>
                          </div>
                          <div className="text-sm font-mono">{execution.gas}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
