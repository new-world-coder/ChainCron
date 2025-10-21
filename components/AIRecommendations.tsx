'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, TrendingUp, Shield, Clock, Zap } from 'lucide-react'
import { strategyRecommender, WalletProfile, Recommendation } from '@/lib/ai/strategyRecommender'

interface AIRecommendationsProps {
  userAddress?: string
  className?: string
}

export function AIRecommendations({ userAddress, className = '' }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [walletProfile, setWalletProfile] = useState<WalletProfile | null>(null)
  const [showDetails, setShowDetails] = useState<number | null>(null)

  useEffect(() => {
    if (userAddress) {
      loadRecommendations(userAddress)
    }
  }, [userAddress])

  const loadRecommendations = async (address: string) => {
    setIsLoading(true)
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const profile = await strategyRecommender.analyzeWalletProfile(address)
      const recs = await strategyRecommender.generateRecommendations(profile)
      
      setWalletProfile(profile)
      setRecommendations(recs)
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 0.3) return 'text-green-600 bg-green-100'
    if (riskScore < 0.7) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore < 0.3) return 'Low Risk'
    if (riskScore < 0.7) return 'Medium Risk'
    return 'High Risk'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600'
    if (confidence > 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Brain className="w-6 h-6 text-purple-600" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
            </motion.div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <div className="ml-auto">
            <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-2">AI analyzing your wallet...</div>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white/50 rounded-lg p-4 border border-purple-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-purple-100 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-purple-50 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No recommendations available</div>
          <div className="text-sm text-gray-400">Connect your wallet to get personalized AI recommendations</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Brain className="w-6 h-6 text-purple-600" />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
          </motion.div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <p className="text-sm text-gray-600">Personalized strategies based on your wallet analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.workflowId}
              className="bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{rec.workflowName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.reasoning}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(rec.riskScore)}`}>
                      {getRiskLabel(rec.riskScore)}
                    </div>
                    <div className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                      {Math.round(rec.confidence * 100)}% match
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rec.expectedROI * 100}% APY</div>
                      <div className="text-xs text-gray-500">Expected ROI</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rec.estimatedGasSavings}%</div>
                      <div className="text-xs text-gray-500">Gas Savings</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rec.timeToProfit}</div>
                      <div className="text-xs text-gray-500">Time to Profit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{Math.round(rec.riskScore * 100)}%</div>
                      <div className="text-xs text-gray-500">Risk Score</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowDetails(showDetails === index ? null : index)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {showDetails === index ? 'Hide Details' : 'Why This?'}
                  </button>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      Customize
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                      Accept Recommendation
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showDetails === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-purple-100"
                    >
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 mb-2">Why this strategy?</h5>
                        <p className="text-sm text-gray-700">{rec.whyThis}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {walletProfile && (
        <div className="mt-6 pt-4 border-t border-purple-100">
          <div className="text-xs text-gray-500">
            Analysis based on: ${walletProfile.portfolioSize.toLocaleString()} portfolio, {walletProfile.riskTolerance} risk tolerance, {walletProfile.activeProtocols.length} active protocols
          </div>
        </div>
      )}
    </div>
  )
}
