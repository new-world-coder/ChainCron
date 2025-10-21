'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Clock,
  ChevronDown,
  ChevronUp,
  Calculator,
  BarChart3,
  Activity
} from 'lucide-react'

export interface RiskFactors {
  smartContractRisk: {
    score: number
    auditStatus: 'audited' | 'unaudited' | 'partially-audited'
    age: number // days
    tvl: number
    details: string
  }
  marketVolatilityRisk: {
    score: number
    volatility: number
    correlation: number
    details: string
  }
  gasCostRisk: {
    score: number
    networkCongestion: number
    gasPrice: number
    details: string
  }
  slippageRisk: {
    score: number
    liquidityDepth: number
    tradeSize: number
    details: string
  }
  liquidationRisk: {
    score: number
    collateralRatio: number
    healthFactor: number
    details: string
  }
}

export interface WorkflowRiskProfile {
  id: string
  name: string
  overallRiskScore: number
  riskFactors: RiskFactors
  historicalRisk: number[]
  riskAdjustedROI: number
  lastUpdated: Date
}

interface RiskAnalysisProps {
  workflowId?: string
  className?: string
}

export function RiskAnalysis({ workflowId, className = '' }: RiskAnalysisProps) {
  const [riskProfile, setRiskProfile] = useState<WorkflowRiskProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null)
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulatorParams, setSimulatorParams] = useState({
    portfolioSize: 10000,
    gasPrice: 20,
    slippageTolerance: 0.5,
    collateralRatio: 0.8
  })

  useEffect(() => {
    if (workflowId) {
      loadRiskProfile(workflowId)
    }
  }, [workflowId])

  const loadRiskProfile = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock risk profile data
      const mockProfile: WorkflowRiskProfile = {
        id,
        name: 'Auto-Compound DeFi Yields',
        overallRiskScore: 0.35,
        riskFactors: {
          smartContractRisk: {
            score: 0.2,
            auditStatus: 'audited',
            age: 365,
            tvl: 50000000,
            details: 'Contract has been audited by ConsenSys and has been live for over a year with $50M TVL'
          },
          marketVolatilityRisk: {
            score: 0.4,
            volatility: 0.25,
            correlation: 0.7,
            details: 'Moderate correlation with ETH price movements. Volatility within acceptable range for yield farming'
          },
          gasCostRisk: {
            score: 0.3,
            networkCongestion: 0.4,
            gasPrice: 25,
            details: 'Gas costs are moderate. Network congestion typically peaks during high volatility periods'
          },
          slippageRisk: {
            score: 0.5,
            liquidityDepth: 0.8,
            tradeSize: 0.3,
            details: 'High liquidity depth reduces slippage risk. Small trade sizes minimize impact'
          },
          liquidationRisk: {
            score: 0.2,
            collateralRatio: 0.85,
            healthFactor: 1.5,
            details: 'Conservative collateral ratio and healthy factor provide strong liquidation protection'
          }
        },
        historicalRisk: [0.3, 0.35, 0.4, 0.32, 0.38, 0.35, 0.33],
        riskAdjustedROI: 0.12,
        lastUpdated: new Date()
      }
      
      setRiskProfile(mockProfile)
    } catch (error) {
      console.error('Failed to load risk profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 0.3) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Low Risk' }
    if (score < 0.7) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Medium Risk' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'High Risk' }
  }

  const getRiskIcon = (score: number) => {
    if (score < 0.3) return <Shield className="w-4 h-4" />
    if (score < 0.7) return <AlertTriangle className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  const calculateSimulatedRisk = () => {
    if (!riskProfile) return 0
    
    let simulatedScore = riskProfile.overallRiskScore
    
    // Adjust based on portfolio size
    if (simulatorParams.portfolioSize > 50000) {
      simulatedScore *= 1.1 // Larger portfolios have slightly higher risk
    } else if (simulatorParams.portfolioSize < 1000) {
      simulatedScore *= 0.9 // Smaller portfolios have slightly lower risk
    }
    
    // Adjust based on gas price
    if (simulatorParams.gasPrice > 50) {
      simulatedScore *= 1.2 // High gas prices increase risk
    } else if (simulatorParams.gasPrice < 10) {
      simulatedScore *= 0.8 // Low gas prices decrease risk
    }
    
    // Adjust based on slippage tolerance
    if (simulatorParams.slippageTolerance > 1.0) {
      simulatedScore *= 1.15 // High slippage tolerance increases risk
    }
    
    // Adjust based on collateral ratio
    if (simulatorParams.collateralRatio < 0.7) {
      simulatedScore *= 1.3 // Low collateral ratio significantly increases risk
    }
    
    return Math.min(Math.max(simulatedScore, 0), 1)
  }

  if (isLoading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!riskProfile) {
    return (
      <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-2">No risk data available</div>
          <div className="text-sm text-gray-400">Select a workflow to view risk analysis</div>
        </div>
      </div>
    )
  }

  const riskColor = getRiskColor(riskProfile.overallRiskScore)
  const simulatedRisk = calculateSimulatedRisk()

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-gray-700" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Risk Analysis</h3>
            <p className="text-sm text-gray-600">{riskProfile.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${riskColor.text} bg-gray-100`}>
            {riskColor.label}
          </div>
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Calculator className="w-4 h-4" />
            What-if Simulator
          </button>
        </div>
      </div>

      {/* Overall Risk Gauge */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Overall Risk Score</h4>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(riskProfile.overallRiskScore * 100)}%
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${riskColor.bg} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${riskProfile.overallRiskScore * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Low Risk</span>
            <span>Medium Risk</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Risk Factors</h4>
        
        {Object.entries(riskProfile.riskFactors).map(([key, factor]) => {
          const factorColor = getRiskColor(factor.score)
          const isExpanded = expandedFactor === key
          
          return (
            <motion.div
              key={key}
              className="border border-gray-200 rounded-lg overflow-hidden"
              initial={false}
              animate={{ height: 'auto' }}
            >
              <button
                onClick={() => setExpandedFactor(isExpanded ? null : key)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRiskIcon(factor.score)}
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-600">{factor.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${factorColor.text} bg-gray-100`}>
                      {Math.round(factor.score * 100)}%
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 border-t border-gray-100"
                  >
                    <div className="pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(factor).map(([subKey, value]) => {
                          if (subKey === 'details' || subKey === 'score') return null
                          return (
                            <div key={subKey}>
                              <span className="text-gray-500 capitalize">
                                {subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                              </span>
                              <span className="ml-2 font-medium text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* What-if Simulator */}
      <AnimatePresence>
        {showSimulator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <h4 className="font-medium text-gray-900 mb-4">What-if Risk Simulator</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Size ($)
                </label>
                <input
                  type="number"
                  value={simulatorParams.portfolioSize}
                  onChange={(e) => setSimulatorParams(prev => ({ ...prev, portfolioSize: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gas Price (Gwei)
                </label>
                <input
                  type="number"
                  value={simulatorParams.gasPrice}
                  onChange={(e) => setSimulatorParams(prev => ({ ...prev, gasPrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={simulatorParams.slippageTolerance}
                  onChange={(e) => setSimulatorParams(prev => ({ ...prev, slippageTolerance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collateral Ratio
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={simulatorParams.collateralRatio}
                  onChange={(e) => setSimulatorParams(prev => ({ ...prev, collateralRatio: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Simulated Risk Score</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(simulatedRisk * 100)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Change from baseline</div>
                  <div className={`text-lg font-semibold ${
                    simulatedRisk > riskProfile.overallRiskScore ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {simulatedRisk > riskProfile.overallRiskScore ? '+' : ''}
                    {Math.round((simulatedRisk - riskProfile.overallRiskScore) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historical Risk Chart */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Historical Risk Trend</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="w-4 h-4" />
            Last 7 days
          </div>
        </div>
        
        <div className="h-32 flex items-end gap-2">
          {riskProfile.historicalRisk.map((risk, index) => {
            const height = risk * 100
            const color = getRiskColor(risk)
            return (
              <motion.div
                key={index}
                className={`flex-1 ${color.bg} rounded-t`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Risk-Adjusted ROI */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Risk-Adjusted ROI</h4>
            <p className="text-sm text-gray-600">Expected return considering risk factors</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(riskProfile.riskAdjustedROI * 100)}%
            </div>
            <div className="text-sm text-gray-500">Annual</div>
          </div>
        </div>
      </div>
    </div>
  )
}
