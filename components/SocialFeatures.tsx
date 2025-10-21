'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  Star,
  TrendingUp,
  Users,
  Award,
  Calendar,
  ExternalLink,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  Filter,
  Search,
  Clock,
  DollarSign,
  Zap,
  Eye,
  GitFork,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

// Mock data for social features
const MOCK_CREATORS = [
  {
    id: 'creator1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    name: 'DeFiMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiMaster',
    bio: 'DeFi strategist with 5+ years experience. Building automated yield strategies.',
    followers: 2847,
    following: 156,
    workflows: 12,
    totalRevenue: 125000,
    reputation: 98,
    verified: true,
    badges: ['Top Creator', 'Verified', 'Audited'],
    joinDate: '2023-08-15',
    socialLinks: {
      twitter: 'https://twitter.com/defimaster',
      github: 'https://github.com/defimaster',
    },
  },
  {
    id: 'creator2',
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    name: 'YieldOptimizer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=YieldOptimizer',
    bio: 'Yield farming specialist focused on sustainable returns and risk management.',
    followers: 1923,
    following: 89,
    workflows: 8,
    totalRevenue: 89000,
    reputation: 94,
    verified: true,
    badges: ['Rising Star', 'Verified'],
    joinDate: '2023-10-22',
    socialLinks: {
      twitter: 'https://twitter.com/yieldoptimizer',
    },
  },
]

const MOCK_WORKFLOWS = [
  {
    id: 'workflow1',
    name: 'Auto-Compound DeFi Yields',
    description: 'Automatically compound USDC rewards from Aave with optimal timing',
    creator: MOCK_CREATORS[0],
    stars: 1247,
    forks: 89,
    subscribers: 2847,
    revenue: 125000,
    rating: 4.8,
    reviews: 156,
    tags: ['DeFi', 'Yield Farming', 'Aave', 'USDC'],
    createdAt: '2024-01-15',
    lastUpdated: '2024-06-10',
    successRate: 97.8,
    executions: 12456,
    gasEfficiency: 94.2,
    isStarred: false,
    isForked: false,
    comments: [
      {
        id: 'comment1',
        user: MOCK_CREATORS[1],
        content: 'Amazing workflow! Made 15% more yield than manual compounding.',
        createdAt: '2024-06-12',
        likes: 23,
        isLiked: false,
      },
      {
        id: 'comment2',
        user: {
          id: 'user1',
          name: 'CryptoTrader',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoTrader',
        },
        content: 'Works perfectly! Saved me hours of manual work.',
        createdAt: '2024-06-11',
        likes: 12,
        isLiked: true,
      },
    ],
  },
]

const MOCK_LEADERBOARDS = {
  topEarners: [
    { rank: 1, user: MOCK_CREATORS[0], earnings: 125000, change: '+12.5%' },
    { rank: 2, user: MOCK_CREATORS[1], earnings: 89000, change: '+8.2%' },
    { rank: 3, user: { name: 'ArbitrageBot', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArbitrageBot' }, earnings: 67000, change: '+15.3%' },
  ],
  topCreators: [
    { rank: 1, user: MOCK_CREATORS[0], revenue: 125000, subscribers: 2847 },
    { rank: 2, user: MOCK_CREATORS[1], revenue: 89000, subscribers: 1923 },
    { rank: 3, user: { name: 'TradingBot', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingBot' }, revenue: 67000, subscribers: 1654 },
  ],
  mostSubscribed: [
    { rank: 1, workflow: MOCK_WORKFLOWS[0], subscribers: 2847, category: 'DeFi' },
    { rank: 2, workflow: { name: 'Portfolio Rebalancer', id: 'workflow2' }, subscribers: 1923, category: 'Portfolio' },
    { rank: 3, workflow: { name: 'Price Alert Trader', id: 'workflow3' }, subscribers: 1654, category: 'Trading' },
  ],
}

const MOCK_FEED = [
  {
    id: 'post1',
    type: 'earnings',
    user: MOCK_CREATORS[0],
    content: 'Just earned $500 this week using my Auto-Compound workflow! 🎉',
    workflow: MOCK_WORKFLOWS[0],
    earnings: 500,
    createdAt: '2024-06-15 14:30',
    likes: 47,
    comments: 12,
    shares: 8,
    isLiked: false,
  },
  {
    id: 'post2',
    type: 'workflow',
    user: MOCK_CREATORS[1],
    content: 'Just released v2 of my Yield Optimizer with 20% lower gas costs!',
    workflow: { name: 'Yield Optimizer v2', id: 'workflow4' },
    createdAt: '2024-06-15 12:15',
    likes: 23,
    comments: 5,
    shares: 3,
    isLiked: true,
  },
  {
    id: 'post3',
    type: 'milestone',
    user: MOCK_CREATORS[0],
    content: '🎉 10,000th execution of my Auto-Compound workflow!',
    workflow: MOCK_WORKFLOWS[0],
    milestone: '10,000 executions',
    createdAt: '2024-06-15 10:45',
    likes: 89,
    comments: 18,
    shares: 15,
    isLiked: false,
  },
]

// Creator Profile Component
export function CreatorProfile({ creator }: { creator: typeof MOCK_CREATORS[0] }) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? 'Unfollowed' : 'Following')
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(creator.address)
    toast.success('Address copied to clipboard')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={creator.avatar} />
            <AvatarFallback>{creator.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{creator.name}</h2>
              {creator.verified && (
                <Badge variant="default" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground mb-3">{creator.bio}</p>
            
            <div className="flex items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{creator.followers.toLocaleString()} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                <span>{creator.workflows} workflows</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${creator.totalRevenue.toLocaleString()} revenue</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              {creator.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleFollow} variant={isFollowing ? 'outline' : 'default'}>
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                <Copy className="w-4 h-4 mr-1" />
                Copy Address
              </Button>
              {creator.socialLinks.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={creator.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// Workflow Social Features Component
export function WorkflowSocialFeatures({ workflow }: { workflow: typeof MOCK_WORKFLOWS[0] }) {
  const [isStarred, setIsStarred] = useState(workflow.isStarred)
  const [isForked, setIsForked] = useState(workflow.isForked)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const handleStar = () => {
    setIsStarred(!isStarred)
    toast.success(isStarred ? 'Unstarred' : 'Starred')
  }

  const handleFork = () => {
    setIsForked(!isForked)
    toast.success(isForked ? 'Unforked' : 'Forked')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  const handleComment = () => {
    if (newComment.trim()) {
      // Add comment logic
      setNewComment('')
      toast.success('Comment added')
    }
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{workflow.name}</h1>
                <Badge variant="outline">{workflow.successRate}% success</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{workflow.description}</p>
              
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{workflow.rating}/5 ({workflow.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{workflow.subscribers.toLocaleString()} subscribers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span>{workflow.gasEfficiency}% gas efficient</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                {workflow.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleStar}>
                <Star className={`w-4 h-4 mr-1 ${isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                {workflow.stars}
              </Button>
              <Button variant="outline" size="sm" onClick={handleFork}>
                <GitFork className="w-4 h-4 mr-1" />
                {workflow.forks}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Creator Info */}
      <CreatorProfile creator={workflow.creator} />

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Comments & Reviews</CardTitle>
            <Button variant="outline" onClick={() => setShowComments(!showComments)}>
              {showComments ? 'Hide' : 'Show'} Comments ({workflow.comments.length})
            </Button>
          </div>
        </CardHeader>
        
        {showComments && (
          <CardContent>
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleComment} disabled={!newComment.trim()}>
                  Comment
                </Button>
              </div>
              
              {/* Comments List */}
              {workflow.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-6">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

// Leaderboards Component
export function Leaderboards() {
  const [activeTab, setActiveTab] = useState<'earners' | 'creators' | 'workflows'>('earners')

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'earners', label: 'Top Earners', icon: '💰' },
          { id: 'creators', label: 'Top Creators', icon: '👑' },
          { id: 'workflows', label: 'Most Subscribed', icon: '⭐' },
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

      {/* Leaderboard Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'earners' && 'Top Earners'}
            {activeTab === 'creators' && 'Top Creators'}
            {activeTab === 'workflows' && 'Most Subscribed Workflows'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTab === 'earners' && MOCK_LEADERBOARDS.topEarners.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.rank}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.user.avatar} />
                  <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{item.user.name}</div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${item.earnings.toLocaleString()}</div>
                  <div className="text-sm text-green-600">{item.change}</div>
                </div>
              </div>
            ))}
            
            {activeTab === 'creators' && MOCK_LEADERBOARDS.topCreators.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.rank}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.user.avatar} />
                  <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{item.user.name}</div>
                  <div className="text-sm text-muted-foreground">{item.subscribers.toLocaleString()} subscribers</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${item.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
            
            {activeTab === 'workflows' && MOCK_LEADERBOARDS.mostSubscribed.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.rank}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.workflow.name}</div>
                  <div className="text-sm text-muted-foreground">{item.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{item.subscribers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Subscribers</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Social Feed Component
export function SocialFeed() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'trending'>('all')

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Activity', icon: '🌐' },
          { id: 'following', label: 'Following', icon: '👥' },
          { id: 'trending', label: 'Trending', icon: '🔥' },
        ].map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? 'default' : 'outline'}
            onClick={() => setActiveFilter(filter.id as any)}
            className="flex items-center gap-2"
          >
            <span>{filter.icon}</span>
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {MOCK_FEED.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{post.user.name}</span>
                    <span className="text-sm text-muted-foreground">{post.createdAt}</span>
                    <Badge variant="outline" className="text-xs">
                      {post.type}
                    </Badge>
                  </div>
                  
                  <p className="mb-3">{post.content}</p>
                  
                  {post.workflow && (
                    <div className="p-3 bg-muted/50 rounded-lg mb-3">
                      <div className="font-medium">{post.workflow.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {post.earnings && `Earned $${post.earnings}`}
                        {post.milestone && `Milestone: ${post.milestone}`}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
