'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Calendar,
  DollarSign,
  Users,
  Gift,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Play,
  Copy,
  Share2,
  Download,
  Filter,
  Search,
  Tag,
  Award,
  Flame,
  Heart,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ComposedWorkflow } from './WorkflowComposer'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'defi' | 'nft' | 'social' | 'gaming' | 'creator' | 'utility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedGas: string
  successRate: number
  popularity: number
  tags: string[]
  workflow: ComposedWorkflow
  creator: string
  createdAt: Date
  downloads: number
  rating: number
  isVerified: boolean
  isFeatured: boolean
}

interface TemplateGalleryProps {
  onTemplateSelect?: (template: WorkflowTemplate) => void
  onTemplateUse?: (template: WorkflowTemplate) => void
}

// Pre-built workflow templates
const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'auto-stake-rewards',
    name: 'Auto-Stake FLOW Rewards',
    description: 'Automatically stake your FLOW rewards daily to maximize compound returns',
    category: 'defi',
    difficulty: 'beginner',
    estimatedGas: '0.003 FLOW',
    successRate: 98,
    popularity: 95,
    tags: ['staking', 'compound', 'rewards', 'daily'],
    creator: 'FlowDeFi',
    createdAt: new Date('2024-01-15'),
    downloads: 1250,
    rating: 4.8,
    isVerified: true,
    isFeatured: true,
    workflow: {
      id: 'auto-stake-rewards',
      name: 'Auto-Stake FLOW Rewards',
      description: 'Automatically stake your FLOW rewards daily',
      nodes: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'Daily Trigger',
          description: 'Execute every 24 hours',
          parameters: { interval: '24h' },
          position: { x: 100, y: 100 },
          connections: ['action1'],
          status: 'idle',
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Check Rewards',
          description: 'Check available FLOW rewards',
          parameters: { token: 'FLOW', protocol: 'FlowStaking' },
          position: { x: 300, y: 100 },
          connections: ['condition1'],
          status: 'idle',
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Rewards Threshold',
          description: 'Check if rewards > 1 FLOW',
          parameters: { threshold: 1, operator: '>' },
          position: { x: 500, y: 100 },
          connections: ['action2', 'output2'],
          status: 'idle',
        },
        {
          id: 'action2',
          type: 'action',
          name: 'Stake Rewards',
          description: 'Stake accumulated rewards',
          parameters: { amount: 'all', autoCompound: true },
          position: { x: 700, y: 50 },
          connections: ['output1'],
          status: 'idle',
        },
        {
          id: 'output1',
          type: 'output',
          name: 'Staked Successfully',
          description: 'Rewards staked successfully',
          parameters: {},
          position: { x: 900, y: 50 },
          connections: [],
          status: 'idle',
        },
        {
          id: 'output2',
          type: 'output',
          name: 'No Action Needed',
          description: 'Rewards below threshold',
          parameters: {},
          position: { x: 700, y: 150 },
          connections: [],
          status: 'idle',
        },
      ],
      connections: [
        { id: 'conn1', from: 'trigger1', to: 'action1' },
        { id: 'conn2', from: 'action1', to: 'condition1' },
        { id: 'conn3', from: 'condition1', to: 'action2', condition: 'rewards > 1 FLOW' },
        { id: 'conn4', from: 'condition1', to: 'output2', condition: 'rewards <= 1 FLOW' },
        { id: 'conn5', from: 'action2', to: 'output1' },
      ],
      variables: { rewards: 0, stakedAmount: 0 },
      executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'output1'],
      estimatedGas: '0.003 FLOW',
      successRate: 98,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 'nft-subscriber-mint',
    name: 'Weekly NFT for Subscribers',
    description: 'Mint exclusive NFTs for your subscribers every Monday',
    category: 'creator',
    difficulty: 'intermediate',
    estimatedGas: '0.008 FLOW',
    successRate: 94,
    popularity: 87,
    tags: ['nft', 'subscribers', 'weekly', 'creator'],
    creator: 'NFTMaster',
    createdAt: new Date('2024-01-20'),
    downloads: 890,
    rating: 4.6,
    isVerified: true,
    isFeatured: true,
    workflow: {
      id: 'nft-subscriber-mint',
      name: 'Weekly NFT for Subscribers',
      description: 'Mint NFTs for subscribers every Monday',
      nodes: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'Monday Trigger',
          description: 'Execute every Monday at 9 AM',
          parameters: { interval: 'weekly', day: 'monday', time: '09:00' },
          position: { x: 100, y: 100 },
          connections: ['action1'],
          status: 'idle',
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Get Subscribers',
          description: 'Fetch active subscriber list',
          parameters: { platform: 'FlowSocial', status: 'active' },
          position: { x: 300, y: 100 },
          connections: ['condition1'],
          status: 'idle',
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Subscriber Check',
          description: 'Check if subscribers exist',
          parameters: { minSubscribers: 1 },
          position: { x: 500, y: 100 },
          connections: ['action2', 'output2'],
          status: 'idle',
        },
        {
          id: 'action2',
          type: 'action',
          name: 'Mint NFTs',
          description: 'Mint NFTs for each subscriber',
          parameters: { 
            contract: 'CreatorNFT',
            metadata: 'weekly-exclusive',
            recipients: 'subscribers'
          },
          position: { x: 700, y: 50 },
          connections: ['output1'],
          status: 'idle',
        },
        {
          id: 'output1',
          type: 'output',
          name: 'NFTs Minted',
          description: 'NFTs successfully minted',
          parameters: {},
          position: { x: 900, y: 50 },
          connections: [],
          status: 'idle',
        },
        {
          id: 'output2',
          type: 'output',
          name: 'No Subscribers',
          description: 'No active subscribers found',
          parameters: {},
          position: { x: 700, y: 150 },
          connections: [],
          status: 'idle',
        },
      ],
      connections: [
        { id: 'conn1', from: 'trigger1', to: 'action1' },
        { id: 'conn2', from: 'action1', to: 'condition1' },
        { id: 'conn3', from: 'condition1', to: 'action2', condition: 'subscribers > 0' },
        { id: 'conn4', from: 'condition1', to: 'output2', condition: 'subscribers = 0' },
        { id: 'conn5', from: 'action2', to: 'output1' },
      ],
      variables: { subscriberCount: 0, mintedNFTs: 0 },
      executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'output1'],
      estimatedGas: '0.008 FLOW',
      successRate: 94,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 'portfolio-rebalancer',
    name: 'Smart Portfolio Rebalancer',
    description: 'Automatically rebalance your portfolio based on target allocations',
    category: 'defi',
    difficulty: 'advanced',
    estimatedGas: '0.015 FLOW',
    successRate: 91,
    popularity: 78,
    tags: ['portfolio', 'rebalance', 'defi', 'advanced'],
    creator: 'DeFiPro',
    createdAt: new Date('2024-01-25'),
    downloads: 650,
    rating: 4.7,
    isVerified: true,
    isFeatured: false,
    workflow: {
      id: 'portfolio-rebalancer',
      name: 'Smart Portfolio Rebalancer',
      description: 'Automatically rebalance portfolio weekly',
      nodes: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'Weekly Trigger',
          description: 'Execute every Sunday at 6 PM',
          parameters: { interval: 'weekly', day: 'sunday', time: '18:00' },
          position: { x: 100, y: 100 },
          connections: ['action1'],
          status: 'idle',
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Analyze Portfolio',
          description: 'Get current portfolio values',
          parameters: { tokens: ['FLOW', 'USDC', 'ETH'], protocol: 'FlowDEX' },
          position: { x: 300, y: 100 },
          connections: ['condition1'],
          status: 'idle',
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Rebalance Check',
          description: 'Check if rebalancing needed',
          parameters: { threshold: 5, targetAllocation: '60% FLOW, 30% USDC, 10% ETH' },
          position: { x: 500, y: 100 },
          connections: ['action2', 'output2'],
          status: 'idle',
        },
        {
          id: 'action2',
          type: 'action',
          name: 'Execute Rebalance',
          description: 'Execute rebalancing trades',
          parameters: { 
            slippage: 0.5,
            maxGasPrice: '0.01 FLOW',
            rebalanceAmount: 'calculated'
          },
          position: { x: 700, y: 50 },
          connections: ['output1'],
          status: 'idle',
        },
        {
          id: 'output1',
          type: 'output',
          name: 'Rebalanced',
          description: 'Portfolio rebalanced successfully',
          parameters: {},
          position: { x: 900, y: 50 },
          connections: [],
          status: 'idle',
        },
        {
          id: 'output2',
          type: 'output',
          name: 'No Rebalance',
          description: 'Portfolio within target allocation',
          parameters: {},
          position: { x: 700, y: 150 },
          connections: [],
          status: 'idle',
        },
      ],
      connections: [
        { id: 'conn1', from: 'trigger1', to: 'action1' },
        { id: 'conn2', from: 'action1', to: 'condition1' },
        { id: 'conn3', from: 'condition1', to: 'action2', condition: 'deviation > 5%' },
        { id: 'conn4', from: 'condition1', to: 'output2', condition: 'deviation <= 5%' },
        { id: 'conn5', from: 'action2', to: 'output1' },
      ],
      variables: { totalValue: 0, deviation: 0, rebalanceAmount: 0 },
      executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'output1'],
      estimatedGas: '0.015 FLOW',
      successRate: 91,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 'birthday-nft-mint',
    name: 'Birthday NFT Minting',
    description: 'Automatically mint birthday NFTs for your community members',
    category: 'social',
    difficulty: 'beginner',
    estimatedGas: '0.005 FLOW',
    successRate: 96,
    popularity: 82,
    tags: ['birthday', 'nft', 'social', 'community'],
    creator: 'CommunityBuilder',
    createdAt: new Date('2024-02-01'),
    downloads: 720,
    rating: 4.5,
    isVerified: true,
    isFeatured: false,
    workflow: {
      id: 'birthday-nft-mint',
      name: 'Birthday NFT Minting',
      description: 'Mint birthday NFTs for community members',
      nodes: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'Daily Check',
          description: 'Check birthdays daily at midnight',
          parameters: { interval: '24h', time: '00:00' },
          position: { x: 100, y: 100 },
          connections: ['action1'],
          status: 'idle',
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Check Birthdays',
          description: 'Get today\'s birthdays from community',
          parameters: { platform: 'FlowSocial', date: 'today' },
          position: { x: 300, y: 100 },
          connections: ['condition1'],
          status: 'idle',
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Birthday Found',
          description: 'Check if birthdays exist today',
          parameters: { minBirthdays: 1 },
          position: { x: 500, y: 100 },
          connections: ['action2', 'output2'],
          status: 'idle',
        },
        {
          id: 'action2',
          type: 'action',
          name: 'Mint Birthday NFTs',
          description: 'Mint personalized birthday NFTs',
          parameters: { 
            contract: 'BirthdayNFT',
            metadata: 'personalized',
            recipients: 'birthdayMembers'
          },
          position: { x: 700, y: 50 },
          connections: ['output1'],
          status: 'idle',
        },
        {
          id: 'output1',
          type: 'output',
          name: 'Birthday NFTs Minted',
          description: 'Birthday NFTs minted successfully',
          parameters: {},
          position: { x: 900, y: 50 },
          connections: [],
          status: 'idle',
        },
        {
          id: 'output2',
          type: 'output',
          name: 'No Birthdays',
          description: 'No birthdays today',
          parameters: {},
          position: { x: 700, y: 150 },
          connections: [],
          status: 'idle',
        },
      ],
      connections: [
        { id: 'conn1', from: 'trigger1', to: 'action1' },
        { id: 'conn2', from: 'action1', to: 'condition1' },
        { id: 'conn3', from: 'condition1', to: 'action2', condition: 'birthdays > 0' },
        { id: 'conn4', from: 'condition1', to: 'output2', condition: 'birthdays = 0' },
        { id: 'conn5', from: 'action2', to: 'output1' },
      ],
      variables: { birthdayCount: 0, mintedNFTs: 0 },
      executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'output1'],
      estimatedGas: '0.005 FLOW',
      successRate: 96,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 'price-alert-system',
    name: 'Smart Price Alert System',
    description: 'Monitor token prices and send alerts when thresholds are reached',
    category: 'utility',
    difficulty: 'intermediate',
    estimatedGas: '0.002 FLOW',
    successRate: 97,
    popularity: 88,
    tags: ['price', 'alert', 'monitoring', 'trading'],
    creator: 'TradingBot',
    createdAt: new Date('2024-02-05'),
    downloads: 1100,
    rating: 4.9,
    isVerified: true,
    isFeatured: true,
    workflow: {
      id: 'price-alert-system',
      name: 'Smart Price Alert System',
      description: 'Monitor prices and send alerts',
      nodes: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'Price Check',
          description: 'Check prices every 5 minutes',
          parameters: { interval: '5m' },
          position: { x: 100, y: 100 },
          connections: ['action1'],
          status: 'idle',
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Get Price',
          description: 'Fetch current token price',
          parameters: { token: 'FLOW', exchange: 'FlowDEX' },
          position: { x: 300, y: 100 },
          connections: ['condition1'],
          status: 'idle',
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Price Threshold',
          description: 'Check if price crossed threshold',
          parameters: { 
            thresholds: ['upper: $1.50', 'lower: $1.20'],
            operator: 'crossed'
          },
          position: { x: 500, y: 100 },
          connections: ['action2', 'output2'],
          status: 'idle',
        },
        {
          id: 'action2',
          type: 'action',
          name: 'Send Alert',
          description: 'Send price alert notification',
          parameters: { 
            message: 'FLOW price alert!',
            channels: ['email', 'push', 'discord']
          },
          position: { x: 700, y: 50 },
          connections: ['output1'],
          status: 'idle',
        },
        {
          id: 'output1',
          type: 'output',
          name: 'Alert Sent',
          description: 'Price alert sent successfully',
          parameters: {},
          position: { x: 900, y: 50 },
          connections: [],
          status: 'idle',
        },
        {
          id: 'output2',
          type: 'output',
          name: 'No Alert',
          description: 'Price within normal range',
          parameters: {},
          position: { x: 700, y: 150 },
          connections: [],
          status: 'idle',
        },
      ],
      connections: [
        { id: 'conn1', from: 'trigger1', to: 'action1' },
        { id: 'conn2', from: 'action1', to: 'condition1' },
        { id: 'conn3', from: 'condition1', to: 'action2', condition: 'threshold crossed' },
        { id: 'conn4', from: 'condition1', to: 'output2', condition: 'within range' },
        { id: 'conn5', from: 'action2', to: 'output1' },
      ],
      variables: { currentPrice: 0, thresholdCrossed: false },
      executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'output1'],
      estimatedGas: '0.002 FLOW',
      successRate: 97,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 'gaming-rewards',
    name: 'Gaming Achievement Rewards',
    description: 'Automatically distribute rewards for gaming achievements',
    category: 'gaming',
    difficulty: 'intermediate',
    estimatedGas: '0.006 FLOW',
    successRate: 93,
    popularity: 75,
    tags: ['gaming', 'achievements', 'rewards', 'nft'],
    creator: 'GameMaster',
    createdAt: new Date('2024-02-10'),
    downloads: 580,
    rating: 4.4,
    isVerified: true,
    isFeatured: false,
    workflow: {
      id: 'gaming-rewards',
      name: 'Gaming Achievement Rewards',
      description: 'Distribute rewards for gaming achievements',
      nodes: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'Achievement Check',
          description: 'Check achievements every hour',
          parameters: { interval: '1h' },
          position: { x: 100, y: 100 },
          connections: ['action1'],
          status: 'idle',
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Check Achievements',
          description: 'Get new achievements from game',
          parameters: { game: 'FlowGame', achievements: 'new' },
          position: { x: 300, y: 100 },
          connections: ['condition1'],
          status: 'idle',
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Achievement Found',
          description: 'Check if new achievements exist',
          parameters: { minAchievements: 1 },
          position: { x: 500, y: 100 },
          connections: ['action2', 'output2'],
          status: 'idle',
        },
        {
          id: 'action2',
          type: 'action',
          name: 'Distribute Rewards',
          description: 'Distribute achievement rewards',
          parameters: { 
            rewards: 'achievement-based',
            tokens: ['FLOW', 'GAME'],
            nfts: 'achievement-badges'
          },
          position: { x: 700, y: 50 },
          connections: ['output1'],
          status: 'idle',
        },
        {
          id: 'output1',
          type: 'output',
          name: 'Rewards Distributed',
          description: 'Achievement rewards distributed',
          parameters: {},
          position: { x: 900, y: 50 },
          connections: [],
          status: 'idle',
        },
        {
          id: 'output2',
          type: 'output',
          name: 'No Achievements',
          description: 'No new achievements found',
          parameters: {},
          position: { x: 700, y: 150 },
          connections: [],
          status: 'idle',
        },
      ],
      connections: [
        { id: 'conn1', from: 'trigger1', to: 'action1' },
        { id: 'conn2', from: 'action1', to: 'condition1' },
        { id: 'conn3', from: 'condition1', to: 'action2', condition: 'achievements > 0' },
        { id: 'conn4', from: 'condition1', to: 'output2', condition: 'achievements = 0' },
        { id: 'conn5', from: 'action2', to: 'output1' },
      ],
      variables: { achievementCount: 0, rewardsDistributed: 0 },
      executionPlan: ['trigger1', 'action1', 'condition1', 'action2', 'output1'],
      estimatedGas: '0.006 FLOW',
      successRate: 93,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
]

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Zap },
  { id: 'defi', name: 'DeFi', icon: TrendingUp },
  { id: 'nft', name: 'NFT', icon: Gift },
  { id: 'social', name: 'Social', icon: Users },
  { id: 'gaming', name: 'Gaming', icon: Award },
  { id: 'creator', name: 'Creator', icon: Star },
  { id: 'utility', name: 'Utility', icon: Shield },
]

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
}

export function TemplateGallery({ onTemplateSelect, onTemplateUse }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'downloads' | 'newest'>('popularity')
  const [filteredTemplates, setFilteredTemplates] = useState(WORKFLOW_TEMPLATES)

  // Filter and sort templates
  React.useEffect(() => {
    let filtered = WORKFLOW_TEMPLATES

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }, [selectedCategory, searchQuery, sortBy])

  const handleTemplateUse = (template: WorkflowTemplate) => {
    if (onTemplateUse) {
      onTemplateUse(template)
    }
  }

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template)
    }
  }

  const TemplateCard = ({ template }: { template: WorkflowTemplate }) => {
    const CategoryIcon = CATEGORIES.find(cat => cat.id === template.category)?.icon || Zap

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CategoryIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                {template.isFeatured && (
                  <Badge variant="default" className="text-xs">
                    <Flame className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {template.isVerified && (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Gas Cost</span>
                </div>
                <div className="font-medium text-sm">{template.estimatedGas}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3" />
                  <span>Success Rate</span>
                </div>
                <div className="font-medium text-sm">{template.successRate}%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="w-3 h-3" />
                  <span>Downloads</span>
                </div>
                <div className="font-medium text-sm">{template.downloads.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  <span>Rating</span>
                </div>
                <div className="font-medium text-sm">{template.rating}/5</div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <Badge 
                variant="outline" 
                className={`text-xs ${DIFFICULTY_COLORS[template.difficulty]}`}
              >
                {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
              </Badge>
            </div>

            {/* Creator */}
            <div className="text-xs text-muted-foreground mb-4">
              by <span className="font-medium">{template.creator}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleTemplateUse(template)}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Use Template
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTemplateSelect(template)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const dataStr = JSON.stringify(template.workflow, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `${template.name}.json`
                  link.click()
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Template Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from pre-built automation templates created by the community. 
          Perfect for creators, gamers, and DeFi users on Flow.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all categories.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
