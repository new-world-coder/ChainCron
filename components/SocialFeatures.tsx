'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2,
  Heart,
  Eye,
  GitFork,
  Star,
  Copy,
  Download,
  ExternalLink,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  Flag,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Award,
  Flame,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SharedWorkflow {
  id: string
  shareId: string
  title: string
  description: string
  creator: {
    id: string
    name: string
    avatar?: string
    verified: boolean
    followers: number
  }
  workflow: {
    id: string
    name: string
    description: string
    estimatedGas: string
    successRate: number
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    tags: string[]
  }
  stats: {
    views: number
    likes: number
    forks: number
    downloads: number
    rating: number
  }
  social: {
    isLiked: boolean
    isBookmarked: boolean
    isFollowing: boolean
  }
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  isFeatured: boolean
  isTrending: boolean
}

interface SocialFeaturesProps {
  onWorkflowUse?: (workflow: SharedWorkflow) => void
  onWorkflowFork?: (workflow: SharedWorkflow) => void
}

// Mock shared workflows data
const MOCK_SHARED_WORKFLOWS: SharedWorkflow[] = [
  {
    id: 'workflow-1',
    shareId: 'share-abc123',
    title: 'Auto-Stake FLOW Rewards Daily',
    description: 'Automatically stake your FLOW rewards every day to maximize compound returns. Perfect for DeFi enthusiasts!',
    creator: {
      id: 'user-1',
      name: 'FlowDeFi',
      avatar: '/avatars/flowdefi.jpg',
      verified: true,
      followers: 12500,
    },
    workflow: {
      id: 'workflow-1',
      name: 'Auto-Stake FLOW Rewards',
      description: 'Automatically stake your FLOW rewards daily',
      estimatedGas: '0.003 FLOW',
      successRate: 98,
      category: 'defi',
      difficulty: 'beginner',
      tags: ['staking', 'compound', 'rewards', 'daily'],
    },
    stats: {
      views: 2847,
      likes: 156,
      forks: 23,
      downloads: 445,
      rating: 4.8,
    },
    social: {
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isVerified: true,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'workflow-2',
    shareId: 'share-def456',
    title: 'Weekly NFT Drops for Subscribers',
    description: 'Mint exclusive NFTs for your subscribers every Monday. Great for content creators and NFT projects!',
    creator: {
      id: 'user-2',
      name: 'NFTMaster',
      avatar: '/avatars/nftmaster.jpg',
      verified: true,
      followers: 8900,
    },
    workflow: {
      id: 'workflow-2',
      name: 'Weekly NFT for Subscribers',
      description: 'Mint NFTs for subscribers every Monday',
      estimatedGas: '0.008 FLOW',
      successRate: 94,
      category: 'creator',
      difficulty: 'intermediate',
      tags: ['nft', 'subscribers', 'weekly', 'creator'],
    },
    stats: {
      views: 1923,
      likes: 89,
      forks: 15,
      downloads: 234,
      rating: 4.6,
    },
    social: {
      isLiked: true,
      isBookmarked: false,
      isFollowing: false,
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    isVerified: true,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 'workflow-3',
    shareId: 'share-ghi789',
    title: 'Smart Portfolio Rebalancer',
    description: 'Advanced portfolio rebalancing system that automatically adjusts your allocations based on market conditions.',
    creator: {
      id: 'user-3',
      name: 'DeFiPro',
      avatar: '/avatars/defipro.jpg',
      verified: true,
      followers: 15600,
    },
    workflow: {
      id: 'workflow-3',
      name: 'Smart Portfolio Rebalancer',
      description: 'Automatically rebalance portfolio weekly',
      estimatedGas: '0.015 FLOW',
      successRate: 91,
      category: 'defi',
      difficulty: 'advanced',
      tags: ['portfolio', 'rebalance', 'defi', 'advanced'],
    },
    stats: {
      views: 3456,
      likes: 234,
      forks: 45,
      downloads: 567,
      rating: 4.7,
    },
    social: {
      isLiked: false,
      isBookmarked: true,
      isFollowing: true,
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01'),
    isVerified: true,
    isFeatured: true,
    isTrending: true,
  },
]

// Export individual components for use in other pages
export function SocialFeed() {
  return <SocialFeatures onWorkflowUse={() => {}} onWorkflowFork={() => {}} />
}

export function Leaderboards() {
  return <SocialFeatures onWorkflowUse={() => {}} onWorkflowFork={() => {}} />
}

export function SocialFeatures({ onWorkflowUse, onWorkflowFork }: SocialFeaturesProps) {
  const [workflows, setWorkflows] = useState<SharedWorkflow[]>(MOCK_SHARED_WORKFLOWS)
  const [selectedWorkflow, setSelectedWorkflow] = useState<SharedWorkflow | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareTitle, setShareTitle] = useState('')
  const [shareDescription, setShareDescription] = useState('')
  const [filter, setFilter] = useState<'trending' | 'recent' | 'popular' | 'verified'>('trending')

  const handleLike = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? {
            ...workflow,
            social: { ...workflow.social, isLiked: !workflow.social.isLiked },
            stats: { 
              ...workflow.stats, 
              likes: workflow.social.isLiked 
                ? workflow.stats.likes - 1 
                : workflow.stats.likes + 1 
            }
          }
        : workflow
    ))
  }

  const handleBookmark = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, social: { ...workflow.social, isBookmarked: !workflow.social.isBookmarked } }
        : workflow
    ))
  }

  const handleFollow = (creatorId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.creator.id === creatorId 
        ? { 
            ...workflow, 
            social: { ...workflow.social, isFollowing: !workflow.social.isFollowing },
            creator: {
              ...workflow.creator,
              followers: workflow.social.isFollowing 
                ? workflow.creator.followers - 1 
                : workflow.creator.followers + 1
            }
          }
        : workflow
    ))
  }

  const handleShare = async (workflow: SharedWorkflow) => {
    try {
      const response = await fetch('/api/workflows/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: workflow.id,
          title: shareTitle || workflow.title,
          description: shareDescription || workflow.description,
          shareType: 'public'
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Copy share URL to clipboard
        await navigator.clipboard.writeText(result.shareUrl)
        alert('Share link copied to clipboard!')
        setShowShareModal(false)
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  const handleFork = async (workflow: SharedWorkflow) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Fork of: ${workflow.title}`,
          workflowData: workflow.workflow
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Update fork count
        setWorkflows(prev => prev.map(w => 
          w.id === workflow.id 
            ? { ...w, stats: { ...w.stats, forks: w.stats.forks + 1 } }
            : w
        ))
        
        if (onWorkflowFork) {
          onWorkflowFork(workflow)
        }
      }
    } catch (error) {
      console.error('Fork error:', error)
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    switch (filter) {
      case 'trending':
        return workflow.isTrending
      case 'recent':
        return new Date(workflow.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      case 'popular':
        return workflow.stats.likes > 100
      case 'verified':
        return workflow.isVerified
      default:
        return true
    }
  })

  const WorkflowCard = ({ workflow }: { workflow: SharedWorkflow }) => {
    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
        case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={workflow.creator.avatar} />
                  <AvatarFallback>{workflow.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{workflow.creator.name}</h3>
                    {workflow.creator.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {workflow.creator.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {workflow.isFeatured && (
                  <Badge variant="default" className="text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {workflow.isTrending && (
                  <Badge variant="outline" className="text-xs">
                    <Flame className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
            </div>
            
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {workflow.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {workflow.description}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Workflow Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Gas Cost</span>
                </div>
                <div className="font-medium text-sm">{workflow.workflow.estimatedGas}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3" />
                  <span>Success Rate</span>
                </div>
                <div className="font-medium text-sm">{workflow.workflow.successRate}%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>Views</span>
                </div>
                <div className="font-medium text-sm">{workflow.stats.views.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  <span>Rating</span>
                </div>
                <div className="font-medium text-sm">{workflow.stats.rating}/5</div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <Badge 
                variant="outline" 
                className={`text-xs ${getDifficultyColor(workflow.workflow.difficulty)}`}
              >
                {workflow.workflow.difficulty.charAt(0).toUpperCase() + workflow.workflow.difficulty.slice(1)}
              </Badge>
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleLike(workflow.id)}
                  className={`flex items-center gap-1 ${workflow.social.isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${workflow.social.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{workflow.stats.likes}</span>
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBookmark(workflow.id)}
                  className={`flex items-center gap-1 ${workflow.social.isBookmarked ? 'text-blue-500' : ''}`}
                >
                  <Bookmark className={`w-4 h-4 ${workflow.social.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleFork(workflow)}
                  className="flex items-center gap-1"
                >
                  <GitFork className="w-4 h-4" />
                  <span className="text-xs">{workflow.stats.forks}</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (onWorkflowUse) {
                      onWorkflowUse(workflow)
                    }
                  }}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Use
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Community Workflows</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and share automation recipes created by the ChainCron community. 
          Follow creators, fork workflows, and build amazing automations together.
        </p>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'trending', label: 'Trending', icon: Flame },
              { id: 'recent', label: 'Recent', icon: Clock },
              { id: 'popular', label: 'Popular', icon: TrendingUp },
              { id: 'verified', label: 'Verified', icon: CheckCircle },
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={filter === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Share Workflow</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder={selectedWorkflow.title}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={shareDescription}
                    onChange={(e) => setShareDescription(e.target.value)}
                    placeholder={selectedWorkflow.description}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleShare(selectedWorkflow)}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowShareModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}