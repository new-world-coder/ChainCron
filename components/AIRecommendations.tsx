'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Target, 
  Clock, 
  DollarSign,
  BarChart3,
  Shield,
  ArrowRight,
  RefreshCw,
  Brain,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface WorkflowRecommendation {
  id: string
  name: string
  description: string
  category: string
  apy: number
  risk: 'low' | 'medium' | 'high'
  popularity: number
  successRate: number
  estimatedEarnings: number
  timeSaved: string
  icon: string
  tags: string[]
}

interface AIRecommendationsProps {
  walletAddress?: string
  userPreferences?: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
    investmentAmount: number
    timeHorizon: 'short' | 'medium' | 'long'
  }
}

export function AIRecommendations({ walletAddress, userPreferences }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<WorkflowRecommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)

  const mockRecommendations: WorkflowRecommendation[] = [
    {
      id: 'auto-compound',
      name: 'Auto-Compound DeFi Yield',
      description: 'Automatically harvest and reinvest yield from your DeFi positions to maximize compound growth',
      category: 'Yield Farming',
      apy: 23.4,
      risk: 'low',
      popularity: 95,
      successRate: 98.7,
      estimatedEarnings: 92,
      timeSaved: '2 hours/week',
      icon: '📈',
      tags: ['DeFi', 'Compound', 'Yield']
    },
    {
      id: 'portfolio-rebalance',
      name: 'Dynamic Portfolio Rebalancer',
      description: 'Automatically rebalance your portfolio based on market conditions and your target allocations',
      category: 'Portfolio Management',
      apy: 15.2,
      risk: 'medium',
      popularity: 87,
      successRate: 94.3,
      estimatedEarnings: 68,
      timeSaved: '1 hour/week',
      icon: '⚖️',
      tags: ['Rebalance', 'Portfolio', 'DCA']
    },
    {
      id: 'arbitrage',
      name: 'Cross-DEX Arbitrage',
      description: 'Automatically find and execute arbitrage opportunities across different decentralized exchanges',
      category: 'Trading',
      apy: 31.8,
      risk: 'high',
      popularity: 72,
      successRate: 89.1,
      estimatedEarnings: 156,
      timeSaved: '4 hours/week',
      icon: '🔄',
      tags: ['Arbitrage', 'Trading', 'DEX']
    },
    {
      id: 'liquidity-management',
      name: 'Smart Liquidity Management',
      description: 'Automatically manage your liquidity positions to maximize fees while minimizing impermanent loss',
      category: 'Liquidity Provision',
      apy: 18.7,
      risk: 'medium',
      popularity: 81,
      successRate: 96.2,
      estimatedEarnings: 78,
      timeSaved: '3 hours/week',
      icon: '💧',
      tags: ['Liquidity', 'LP', 'Fees']
    }
  ]

  const analyzeWallet = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsAnalyzing(false)
          setRecommendations(mockRecommendations)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-4 h-4" />
      case 'medium': return <Info className="w-4 h-4" />
      case 'high': return <AlertTriangle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  useEffect(() => {
    if (walletAddress) {
      analyzeWallet()
    }
  }, [walletAddress])

    return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                AI-Powered Recommendations
                <Badge className="bg-blue-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Claude AI
                </Badge>
              </CardTitle>
              <p className="text-gray-300">
                Personalized workflow suggestions based on your wallet analysis
              </p>
          </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <span className="text-white font-semibold">Analyzing your wallet...</span>
        </div>
        
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Processing wallet data...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-400 space-y-1">
                {analysisProgress < 30 && <p>🔍 Scanning wallet addresses...</p>}
                {analysisProgress >= 30 && analysisProgress < 60 && <p>📊 Analyzing transaction history...</p>}
                {analysisProgress >= 60 && analysisProgress < 90 && <p>🤖 AI generating recommendations...</p>}
                {analysisProgress >= 90 && <p>✅ Finalizing personalized suggestions...</p>}
        </div>
      </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
      <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6" />
            Recommended for You
          </h3>

          {recommendations.map((recommendation, index) => (
            <Card 
              key={recommendation.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedRecommendation === recommendation.id
                  ? 'ring-2 ring-blue-500 bg-blue-500/20'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
              onClick={() => setSelectedRecommendation(
                selectedRecommendation === recommendation.id ? null : recommendation.id
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{recommendation.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{recommendation.name}</h4>
                      <Badge className="bg-green-600 text-white">
                        #{index + 1} Recommended
                      </Badge>
                  </div>
                    
                    <p className="text-gray-300 mb-4">{recommendation.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recommendation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-gray-300 border-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{recommendation.apy}%</div>
                        <div className="text-gray-300 text-sm">Projected APY</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">${recommendation.estimatedEarnings}</div>
                        <div className="text-gray-300 text-sm">Est. monthly earnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{recommendation.successRate}%</div>
                        <div className="text-gray-300 text-sm">Success rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{recommendation.timeSaved}</div>
                        <div className="text-gray-300 text-sm">Time saved</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getRiskColor(recommendation.risk)} border`}>
                          {getRiskIcon(recommendation.risk)}
                          <span className="ml-1 capitalize">{recommendation.risk} Risk</span>
                        </Badge>
                        <div className="text-sm text-gray-300">
                          Popularity: {recommendation.popularity}%
                  </div>
                </div>

                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        Subscribe
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                    </div>
              </CardContent>
            </Card>
          ))}
                  </div>
      )}

      {/* AI Insights */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">🎯 Why These Recommendations?</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Based on your current DeFi positions and risk tolerance</li>
                  <li>• Optimized for your investment amount and time horizon</li>
                  <li>• High success rates from similar user profiles</li>
                  <li>• Diversified across different strategies to minimize risk</li>
                </ul>
                    </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">⚡ Performance Expectations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400 font-bold">$234</div>
                    <div className="text-gray-300">Estimated monthly profit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">10 hours</div>
                    <div className="text-gray-300">Time saved per month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">94.2%</div>
                    <div className="text-gray-300">Average success rate</div>
                  </div>
                </div>
      </div>

              <div className="flex gap-4">
                <Button 
                  onClick={analyzeWallet}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  View All Workflows
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
          </div>
        </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}