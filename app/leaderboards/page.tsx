'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, TrendingUp, Users, Star, Calendar, Filter } from 'lucide-react'
import Link from 'next/link'
import { Leaderboards } from '@/components/SocialFeatures'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function LeaderboardsPage() {
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
              <h1 className="text-4xl font-bold mb-2">Leaderboards</h1>
              <p className="text-xl text-muted-foreground">
                Discover top performers, creators, and most popular workflows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Top Earner</h3>
                    <p className="text-2xl font-bold text-yellow-600">$125K</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  DeFiMaster this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Active Creators</h3>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Building workflows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Top Workflow</h3>
                    <p className="text-2xl font-bold text-green-600">2.8K</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Subscribers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Growth Rate</h3>
                    <p className="text-2xl font-bold text-purple-600">+23%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leaderboards */}
        <Leaderboards />

        {/* Achievement System */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievement System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'First Subscription',
                  description: 'Subscribe to your first workflow',
                  icon: '🎯',
                  reward: '100 XP',
                  unlocked: true,
                },
                {
                  name: 'Power User',
                  description: 'Subscribe to 10 workflows',
                  icon: '⚡',
                  reward: '500 XP',
                  unlocked: false,
                },
                {
                  name: 'Whale',
                  description: 'Automate $10,000+ in value',
                  icon: '🐋',
                  reward: '1000 XP',
                  unlocked: false,
                },
                {
                  name: 'Creator',
                  description: 'Publish your first workflow',
                  icon: '🛠️',
                  reward: '200 XP',
                  unlocked: false,
                },
                {
                  name: 'Top Creator',
                  description: 'Reach 1000+ subscribers',
                  icon: '👑',
                  reward: '2000 XP',
                  unlocked: false,
                },
                {
                  name: 'Social Butterfly',
                  description: 'Get 100+ likes on posts',
                  icon: '🦋',
                  reward: '300 XP',
                  unlocked: false,
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50'
                      : 'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                      {achievement.reward}
                    </Badge>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-xs text-green-600 font-medium">✓ Unlocked</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Referral Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Earn by Referring</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Referral Link:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      chaincron.app/ref/yourcode
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Earnings:</span>
                    <span className="font-medium">5% for 6 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referee Discount:</span>
                    <span className="font-medium">10% off first month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Referrals:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Earned:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Referral Leaderboard</h4>
                <div className="space-y-2">
                  {[
                    { rank: 1, name: 'CryptoWhale', referrals: 47, earnings: 1250 },
                    { rank: 2, name: 'DeFiMaster', referrals: 32, earnings: 890 },
                    { rank: 3, name: 'YieldFarmer', referrals: 28, earnings: 750 },
                  ].map((ref) => (
                    <div key={ref.rank} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {ref.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{ref.name}</div>
                        <div className="text-xs text-muted-foreground">{ref.referrals} referrals</div>
                      </div>
                      <div className="text-sm font-medium">${ref.earnings}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
