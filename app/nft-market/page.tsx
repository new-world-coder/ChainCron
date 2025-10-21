'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Gem, Star, TrendingUp, DollarSign, Users, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'
import { WorkflowNFTMarketplace } from '@/components/WorkflowNFTMarketplace'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function NFTMarketPage() {
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
              <h1 className="text-4xl font-bold mb-2">Workflow NFT Marketplace</h1>
              <p className="text-xl text-muted-foreground">
                Trade proven DeFi workflows as NFTs with lifetime access and passive income
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
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Legendary NFTs</h3>
                    <p className="text-2xl font-bold text-yellow-600">12</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Highest tier workflows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Gem className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Rare NFTs</h3>
                    <p className="text-2xl font-bold text-purple-600">47</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Premium workflows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Common NFTs</h3>
                    <p className="text-2xl font-bold text-blue-600">288</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Accessible workflows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Volume</h3>
                    <p className="text-2xl font-bold text-green-600">$2.4M</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Trading volume
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* NFT Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Own Workflow NFTs?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔓</div>
                <h3 className="font-semibold mb-2">Lifetime Access</h3>
                <p className="text-sm text-muted-foreground">
                  Own the NFT and get lifetime access to the workflow without monthly subscriptions
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold mb-2">Passive Income</h3>
                <p className="text-sm text-muted-foreground">
                  Earn pro-rata share of subscriber fees as passive income from your NFT ownership
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-semibold mb-2">Exclusive Upgrades</h3>
                <p className="text-sm text-muted-foreground">
                  Get exclusive access to future workflow upgrades and new features
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🗳️</div>
                <h3 className="font-semibold mb-2">Voting Rights</h3>
                <p className="text-sm text-muted-foreground">
                  Vote on workflow updates, parameter changes, and future development
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-semibold mb-2">Special Badge</h3>
                <p className="text-sm text-muted-foreground">
                  Display your NFT ownership with special badges in the community
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-semibold mb-2">Price Appreciation</h3>
                <p className="text-sm text-muted-foreground">
                  NFTs can appreciate in value as workflows become more successful
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Marketplace */}
        <WorkflowNFTMarketplace />

        {/* Rarity System */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              NFT Rarity System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Legendary</h3>
                <div className="text-sm text-yellow-700 mb-3">
                  <div>• Limited to 100 NFTs</div>
                  <div>• 97%+ success rate</div>
                  <div>• $100K+ earnings</div>
                  <div>• All premium benefits</div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">2.5 ETH Floor</Badge>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Gem className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">Rare</h3>
                <div className="text-sm text-purple-700 mb-3">
                  <div>• Limited to 50 NFTs</div>
                  <div>• 94%+ success rate</div>
                  <div>• $50K+ earnings</div>
                  <div>• Most premium benefits</div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">1.8 ETH Floor</Badge>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Common</h3>
                <div className="text-sm text-blue-700 mb-3">
                  <div>• Limited to 200 NFTs</div>
                  <div>• 89%+ success rate</div>
                  <div>• $25K+ earnings</div>
                  <div>• Basic benefits</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">0.8 ETH Floor</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fractionalization */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Fractional Ownership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">How Fractionalization Works</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Expensive NFTs can be split into 100 shares</div>
                  <div>• Buy fractions (e.g., 5% ownership)</div>
                  <div>• Proportional revenue sharing</div>
                  <div>• Fraction holders vote on upgrades</div>
                  <div>• Trade fractions on secondary market</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Example: DeFi Yield Optimizer</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-medium">2.5 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shares Available:</span>
                    <span className="font-medium">100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Share:</span>
                    <span className="font-medium">0.025 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue per Share:</span>
                    <span className="font-medium">~$12.50</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
