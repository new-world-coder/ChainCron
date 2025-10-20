'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Star,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react'
import type { Workflow } from '@/types/contracts'
import { useSubscription } from '@/hooks/useSubscription'

interface WorkflowCardProps {
  workflow: Workflow
  onSubscribe?: (workflowId: number) => void
}

export function WorkflowCard({ workflow, onSubscribe }: WorkflowCardProps) {
  const { address } = useAccount()
  const { subscribe, isSubscribing } = useSubscription()
  const [isHovered, setIsHovered] = useState(false)

  const handleSubscribe = async () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    try {
      await subscribe(workflow.id, workflow.price)
      onSubscribe?.(workflow.id)
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  const formatPrice = (price: bigint) => {
    const eth = Number(price) / 1e18
    return `${eth.toFixed(2)} ETH`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DeFi':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Trading':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Utility':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'Governance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'NFT':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DeFi':
        return <TrendingUp className="w-4 h-4" />
      case 'Trading':
        return <Zap className="w-4 h-4" />
      case 'Utility':
        return <Shield className="w-4 h-4" />
      case 'Governance':
        return <Users className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      className="glass rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(workflow.category)}`}>
            {getCategoryIcon(workflow.category)}
            {workflow.category}
          </span>
          {workflow.isActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Active
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(workflow.price)}
          </div>
          <div className="text-sm text-muted-foreground">
            per month
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-semibold mb-3 text-foreground">
        {workflow.name}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
        {workflow.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>142 subscribers</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>24h frequency</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>4.9</span>
        </div>
      </div>

      {/* Subscribe Button */}
      <motion.button
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
          isSubscribing
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'
        }`}
        onClick={handleSubscribe}
        disabled={isSubscribing}
        whileHover={!isSubscribing ? { scale: 1.02 } : {}}
        whileTap={!isSubscribing ? { scale: 0.98 } : {}}
      >
        {isSubscribing ? (
          <>
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            Subscribe Now
            <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
          </>
        )}
      </motion.button>

      {/* Creator Info */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Created by:</span>
          <span className="font-mono">
            {workflow.creator.slice(0, 6)}...{workflow.creator.slice(-4)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
