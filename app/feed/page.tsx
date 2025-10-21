'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, TrendingUp, Calendar, Filter, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { SocialFeed } from '@/components/SocialFeatures'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function FeedPage() {
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
              <h1 className="text-4xl font-bold mb-2">Strategy Feed</h1>
              <p className="text-xl text-muted-foreground">
                Stay updated with the latest workflow activities and community insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Following</h3>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Creators & users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Posts Today</h3>
                    <p className="text-2xl font-bold text-green-600">47</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Community activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Posts</h3>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This month
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
                    <h3 className="font-semibold">Engagement</h3>
                    <p className="text-2xl font-bold text-orange-600">89%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Avg engagement rate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts, workflows, or users..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Feed */}
        <SocialFeed />

        {/* Trending Topics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                '#DeFi',
                '#YieldFarming',
                '#AutoCompound',
                '#PortfolioRebalancing',
                '#Arbitrage',
                '#LiquidityMining',
                '#Staking',
                '#CrossChain',
                '#RiskManagement',
                '#TaxOptimization',
              ].map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">✅ Do's</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Share your workflow successes and learnings</li>
                  <li>• Provide helpful feedback and suggestions</li>
                  <li>• Use appropriate tags and categories</li>
                  <li>• Respect other community members</li>
                  <li>• Share educational content and tutorials</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">❌ Don'ts</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Spam or promote unrelated content</li>
                  <li>• Share misleading or false information</li>
                  <li>• Use inappropriate language or content</li>
                  <li>• Violate others' intellectual property</li>
                  <li>• Engage in harassment or bullying</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
