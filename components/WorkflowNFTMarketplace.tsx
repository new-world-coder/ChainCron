'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Award,
  ExternalLink,
  Copy,
  Heart,
  Share2,
  Filter,
  Search,
  Crown,
  Gem,
  Zap,
  Shield,
  Eye,
  ShoppingCart,
  Tag,
  Calendar,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

// Mock NFT data
const MOCK_WORKFLOW_NFTS = [
  {
    id: 'nft1',
    name: 'DeFi Yield Optimizer #001',
    description: 'Proven workflow with 97.8% success rate and $125K+ in earnings',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=DeFiYield',
    creator: {
      name: 'DeFiMaster',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      verified: true,
    },
    rarity: 'Legendary',
    tier: 'Legendary',
    price: 2.5,
    currency: 'ETH',
    floorPrice: 2.2,
    volume: 15.7,
    owners: 47,
    totalSupply: 100,
    remainingSupply: 53,
    performance: {
      roi: 127.5,
      successRate: 97.8,
      executions: 12456,
      totalEarnings: 125000,
      avgGasEfficiency: 94.2,
    },
    benefits: [
      'Lifetime access to workflow',
      'Pro-rata share of subscriber fees',
      'Exclusive access to future upgrades',
      'Voting rights on workflow updates',
      'Special community badge',
    ],
    history: [
      { date: '2024-06-15', price: 2.5, volume: 1.2 },
      { date: '2024-06-14', price: 2.3, volume: 0.8 },
      { date: '2024-06-13', price: 2.4, volume: 1.5 },
    ],
    isOwned: false,
    isFavorited: false,
  },
  {
    id: 'nft2',
    name: 'Portfolio Rebalancer #042',
    description: 'Automated portfolio rebalancing with risk management',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=PortfolioRebalancer',
    creator: {
      name: 'YieldOptimizer',
      address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      verified: true,
    },
    rarity: 'Rare',
    tier: 'Rare',
    price: 1.8,
    currency: 'ETH',
    floorPrice: 1.6,
    volume: 8.3,
    owners: 32,
    totalSupply: 50,
    remainingSupply: 18,
    performance: {
      roi: 89.2,
      successRate: 94.1,
      executions: 8923,
      totalEarnings: 89000,
      avgGasEfficiency: 91.5,
    },
    benefits: [
      'Lifetime access to workflow',
      'Pro-rata share of subscriber fees',
      'Exclusive access to future upgrades',
      'Voting rights on workflow updates',
    ],
    history: [
      { date: '2024-06-15', price: 1.8, volume: 0.9 },
      { date: '2024-06-14', price: 1.7, volume: 0.6 },
      { date: '2024-06-13', price: 1.9, volume: 1.1 },
    ],
    isOwned: false,
    isFavorited: true,
  },
  {
    id: 'nft3',
    name: 'Arbitrage Bot #156',
    description: 'Cross-DEX arbitrage with 89% success rate',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ArbitrageBot',
    creator: {
      name: 'TradingBot',
      address: '0xCd6789eF0123456789abcdef0123456789abcdef',
      verified: false,
    },
    rarity: 'Common',
    tier: 'Common',
    price: 0.8,
    currency: 'ETH',
    floorPrice: 0.7,
    volume: 4.2,
    owners: 28,
    totalSupply: 200,
    remainingSupply: 172,
    performance: {
      roi: 67.3,
      successRate: 89.2,
      executions: 6543,
      totalEarnings: 67000,
      avgGasEfficiency: 87.8,
    },
    benefits: [
      'Lifetime access to workflow',
      'Pro-rata share of subscriber fees',
    ],
    history: [
      { date: '2024-06-15', price: 0.8, volume: 0.5 },
      { date: '2024-06-14', price: 0.75, volume: 0.3 },
      { date: '2024-06-13', price: 0.82, volume: 0.7 },
    ],
    isOwned: true,
    isFavorited: false,
  },
]

// NFT Card Component
function WorkflowNFTCard({ nft }: { nft: typeof MOCK_WORKFLOW_NFTS[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'Rare': return 'bg-gradient-to-r from-purple-400 to-pink-500'
      case 'Common': return 'bg-gradient-to-r from-blue-400 to-cyan-500'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return <Crown className="w-4 h-4" />
      case 'Rare': return <Gem className="w-4 h-4" />
      case 'Common': return <Star className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const handleBuy = () => {
    toast.success(`Purchased ${nft.name} for ${nft.price} ${nft.currency}`)
  }

  const handleFavorite = () => {
    toast.success(nft.isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('NFT link copied to clipboard')
  }

  return (
    <motion.div
      className="group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        {/* NFT Image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-6xl">{nft.image}</div>
          </div>
          
          {/* Rarity Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getRarityColor(nft.rarity)} text-white border-0`}>
              {getRarityIcon(nft.rarity)}
              <span className="ml-1">{nft.rarity}</span>
            </Badge>
          </div>
          
          {/* Supply Indicator */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90">
              {nft.remainingSupply}/{nft.totalSupply}
            </Badge>
          </div>
          
          {/* Action Buttons */}
          <div className={`absolute bottom-3 right-3 flex gap-2 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button size="sm" variant="secondary" onClick={handleFavorite}>
              <Heart className={`w-4 h-4 ${nft.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* NFT Info */}
          <div className="mb-3">
            <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{nft.description}</p>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
              {nft.creator.name[0]}
            </div>
            <span className="text-sm font-medium">{nft.creator.name}</span>
            {nft.creator.verified && (
              <Badge variant="default" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span>{nft.performance.roi}% ROI</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-600" />
              <span>{nft.performance.successRate}% success</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-600" />
              <span>{nft.performance.avgGasEfficiency}% efficient</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-orange-600" />
              <span>${(nft.performance.totalEarnings / 1000).toFixed(0)}K earned</span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">{nft.price} {nft.currency}</div>
              <div className="text-xs text-muted-foreground">
                Floor: {nft.floorPrice} {nft.currency}
              </div>
            </div>
            
            <div className="flex gap-2">
              {nft.isOwned ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Owned
                </Badge>
              ) : (
                <Button size="sm" onClick={handleBuy}>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Buy
                </Button>
              )}
            </div>
          </div>

          {/* Volume */}
          <div className="mt-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Volume:</span>
              <span>{nft.volume} {nft.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>Owners:</span>
              <span>{nft.owners}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Main NFT Marketplace Component
export function WorkflowNFTMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [sortBy, setSortBy] = useState('price')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredNFTs = MOCK_WORKFLOW_NFTS.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRarity = selectedRarity === 'all' || nft.rarity.toLowerCase() === selectedRarity.toLowerCase()
    
    return matchesSearch && matchesRarity
  })

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price': return b.price - a.price
      case 'roi': return b.performance.roi - a.performance.roi
      case 'volume': return b.volume - a.volume
      case 'rarity': return a.rarity.localeCompare(b.rarity)
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search NFTs, creators, or workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Rarities</option>
                <option value="legendary">Legendary</option>
                <option value="rare">Rare</option>
                <option value="common">Common</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="price">Sort by Price</option>
                <option value="roi">Sort by ROI</option>
                <option value="volume">Sort by Volume</option>
                <option value="rarity">Sort by Rarity</option>
              </select>
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedNFTs.map((nft) => (
          <WorkflowNFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      {sortedNFTs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find workflow NFTs.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Market Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Market Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$2.4M</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">347</div>
              <div className="text-sm text-muted-foreground">NFTs Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.2K</div>
              <div className="text-sm text-muted-foreground">Unique Owners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2.1 ETH</div>
              <div className="text-sm text-muted-foreground">Floor Price</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
