// AI Strategy Recommendations Engine
// Analyzes user wallet patterns and recommends optimal workflows

export interface WalletProfile {
  address: string
  portfolioSize: number
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  gasSpendingPattern: 'low' | 'medium' | 'high'
  activeProtocols: string[]
  holdingDuration: 'short' | 'medium' | 'long'
  tokenComposition: {
    stablecoins: number
    eth: number
    defi: number
    other: number
  }
  transactionFrequency: 'low' | 'medium' | 'high'
  lastActivity: Date
}

export interface Recommendation {
  workflowId: string
  workflowName: string
  expectedROI: number
  riskScore: number
  confidence: number
  reasoning: string
  whyThis: string
  estimatedGasSavings: number
  timeToProfit: string
  compatibilityScore: number
}

export interface WorkflowProfile {
  id: string
  name: string
  category: string
  minPortfolioSize: number
  maxPortfolioSize: number
  riskLevel: 'low' | 'medium' | 'high'
  gasEfficiency: number
  targetProtocols: string[]
  optimalHoldingDuration: string[]
  expectedAPY: number
  complexity: 'simple' | 'intermediate' | 'advanced'
}

// Mock AI analysis - in production, this would integrate with OpenAI API
export class StrategyRecommender {
  private workflows: WorkflowProfile[] = [
    {
      id: 'auto-compound',
      name: 'Auto-Compound DeFi Yields',
      category: 'yield-farming',
      minPortfolioSize: 1000,
      maxPortfolioSize: 1000000,
      riskLevel: 'low',
      gasEfficiency: 0.85,
      targetProtocols: ['aave', 'compound', 'yearn'],
      optimalHoldingDuration: ['medium', 'long'],
      expectedAPY: 0.12,
      complexity: 'simple'
    },
    {
      id: 'portfolio-rebalancer',
      name: 'Portfolio Rebalancer',
      category: 'portfolio-management',
      minPortfolioSize: 5000,
      maxPortfolioSize: 500000,
      riskLevel: 'medium',
      gasEfficiency: 0.75,
      targetProtocols: ['uniswap', 'sushiswap', 'curve'],
      optimalHoldingDuration: ['medium', 'long'],
      expectedAPY: 0.08,
      complexity: 'intermediate'
    },
    {
      id: 'price-alert',
      name: 'Price Alert & Auto-Swap',
      category: 'trading',
      minPortfolioSize: 500,
      maxPortfolioSize: 100000,
      riskLevel: 'high',
      gasEfficiency: 0.60,
      targetProtocols: ['uniswap', 'sushiswap'],
      optimalHoldingDuration: ['short', 'medium'],
      expectedAPY: 0.15,
      complexity: 'advanced'
    },
    {
      id: 'dca-strategy',
      name: 'Dollar-Cost Averaging',
      category: 'investment',
      minPortfolioSize: 100,
      maxPortfolioSize: 50000,
      riskLevel: 'low',
      gasEfficiency: 0.90,
      targetProtocols: ['uniswap', 'curve'],
      optimalHoldingDuration: ['long'],
      expectedAPY: 0.06,
      complexity: 'simple'
    },
    {
      id: 'liquidation-protection',
      name: 'Liquidation Protection',
      category: 'risk-management',
      minPortfolioSize: 2000,
      maxPortfolioSize: 200000,
      riskLevel: 'medium',
      gasEfficiency: 0.80,
      targetProtocols: ['aave', 'compound'],
      optimalHoldingDuration: ['medium', 'long'],
      expectedAPY: 0.05,
      complexity: 'intermediate'
    }
  ]

  async analyzeWalletProfile(address: string): Promise<WalletProfile> {
    // Mock wallet analysis - in production, this would analyze on-chain data
    const mockProfiles: WalletProfile[] = [
      {
        address,
        portfolioSize: 15000,
        riskTolerance: 'moderate',
        gasSpendingPattern: 'medium',
        activeProtocols: ['aave', 'uniswap', 'compound'],
        holdingDuration: 'medium',
        tokenComposition: {
          stablecoins: 0.3,
          eth: 0.4,
          defi: 0.2,
          other: 0.1
        },
        transactionFrequency: 'medium',
        lastActivity: new Date()
      },
      {
        address,
        portfolioSize: 5000,
        riskTolerance: 'conservative',
        gasSpendingPattern: 'low',
        activeProtocols: ['aave'],
        holdingDuration: 'long',
        tokenComposition: {
          stablecoins: 0.6,
          eth: 0.3,
          defi: 0.1,
          other: 0.0
        },
        transactionFrequency: 'low',
        lastActivity: new Date()
      },
      {
        address,
        portfolioSize: 50000,
        riskTolerance: 'aggressive',
        gasSpendingPattern: 'high',
        activeProtocols: ['uniswap', 'sushiswap', 'curve', 'yearn'],
        holdingDuration: 'short',
        tokenComposition: {
          stablecoins: 0.1,
          eth: 0.2,
          defi: 0.6,
          other: 0.1
        },
        transactionFrequency: 'high',
        lastActivity: new Date()
      }
    ]

    // Return a random profile for demo purposes
    return mockProfiles[Math.floor(Math.random() * mockProfiles.length)]
  }

  async generateRecommendations(profile: WalletProfile): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    for (const workflow of this.workflows) {
      const compatibilityScore = this.calculateCompatibility(workflow, profile)
      
      if (compatibilityScore > 0.6) { // Only recommend if compatibility > 60%
        const recommendation: Recommendation = {
          workflowId: workflow.id,
          workflowName: workflow.name,
          expectedROI: this.calculateExpectedROI(workflow, profile),
          riskScore: this.calculateRiskScore(workflow, profile),
          confidence: compatibilityScore,
          reasoning: this.generateReasoning(workflow, profile),
          whyThis: this.generateWhyThis(workflow, profile),
          estimatedGasSavings: this.calculateGasSavings(workflow, profile),
          timeToProfit: this.calculateTimeToProfit(workflow, profile),
          compatibilityScore
        }
        recommendations.push(recommendation)
      }
    }

    // Sort by compatibility score and return top 3
    return recommendations
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 3)
  }

  calculateExpectedROI(workflow: WorkflowProfile, profile: WalletProfile): number {
    let baseROI = workflow.expectedAPY
    
    // Adjust based on portfolio size
    if (profile.portfolioSize < workflow.minPortfolioSize) {
      baseROI *= 0.8 // Lower ROI for smaller portfolios
    } else if (profile.portfolioSize > workflow.maxPortfolioSize) {
      baseROI *= 0.9 // Slightly lower ROI for very large portfolios
    }

    // Adjust based on risk tolerance
    if (profile.riskTolerance === 'conservative' && workflow.riskLevel === 'high') {
      baseROI *= 0.7
    } else if (profile.riskTolerance === 'aggressive' && workflow.riskLevel === 'low') {
      baseROI *= 0.8
    }

    return Math.round(baseROI * 100) / 100
  }

  private calculateCompatibility(workflow: WorkflowProfile, profile: WalletProfile): number {
    let score = 0

    // Portfolio size compatibility (40% weight)
    if (profile.portfolioSize >= workflow.minPortfolioSize && 
        profile.portfolioSize <= workflow.maxPortfolioSize) {
      score += 0.4
    } else {
      const sizeRatio = Math.min(profile.portfolioSize / workflow.minPortfolioSize, 
                                workflow.maxPortfolioSize / profile.portfolioSize)
      score += 0.4 * Math.min(sizeRatio, 1)
    }

    // Risk tolerance compatibility (25% weight)
    const riskCompatibility = this.getRiskCompatibility(profile.riskTolerance, workflow.riskLevel)
    score += 0.25 * riskCompatibility

    // Protocol overlap (20% weight)
    const protocolOverlap = this.calculateProtocolOverlap(profile.activeProtocols, workflow.targetProtocols)
    score += 0.2 * protocolOverlap

    // Holding duration compatibility (15% weight)
    const durationCompatibility = this.getDurationCompatibility(profile.holdingDuration, workflow.optimalHoldingDuration)
    score += 0.15 * durationCompatibility

    return Math.min(score, 1)
  }

  private calculateRiskScore(workflow: WorkflowProfile, profile: WalletProfile): number {
    let riskScore = 0

    // Base workflow risk
    switch (workflow.riskLevel) {
      case 'low': riskScore = 0.2; break
      case 'medium': riskScore = 0.5; break
      case 'high': riskScore = 0.8; break
    }

    // Adjust based on user's risk tolerance
    if (profile.riskTolerance === 'conservative') {
      riskScore *= 1.2 // Perceived as riskier
    } else if (profile.riskTolerance === 'aggressive') {
      riskScore *= 0.8 // Perceived as less risky
    }

    // Adjust based on gas efficiency
    riskScore *= (1 - workflow.gasEfficiency * 0.2)

    return Math.min(Math.max(riskScore, 0), 1)
  }

  private generateReasoning(workflow: WorkflowProfile, profile: WalletProfile): string {
    const reasons = []

    if (profile.portfolioSize >= workflow.minPortfolioSize) {
      reasons.push(`Your portfolio size ($${profile.portfolioSize.toLocaleString()}) is optimal for this strategy`)
    }

    const protocolOverlap = this.calculateProtocolOverlap(profile.activeProtocols, workflow.targetProtocols)
    if (protocolOverlap > 0.5) {
      reasons.push(`You're already using compatible protocols (${Math.round(protocolOverlap * 100)}% overlap)`)
    }

    if (profile.riskTolerance === workflow.riskLevel) {
      reasons.push(`This matches your ${profile.riskTolerance} risk tolerance`)
    }

    if (workflow.gasEfficiency > 0.8) {
      reasons.push(`High gas efficiency (${Math.round(workflow.gasEfficiency * 100)}%) suits your ${profile.gasSpendingPattern} gas spending pattern`)
    }

    return reasons.join('. ') + '.'
  }

  private generateWhyThis(workflow: WorkflowProfile, profile: WalletProfile): string {
    const whyReasons = []

    if (profile.holdingDuration === 'long' && workflow.optimalHoldingDuration.includes('long')) {
      whyReasons.push('Perfect for long-term holders like you')
    }

    if (profile.transactionFrequency === 'low' && workflow.complexity === 'simple') {
      whyReasons.push('Simple automation for infrequent traders')
    }

    if (profile.tokenComposition.defi > 0.3 && workflow.category === 'yield-farming') {
      whyReasons.push('Maximizes your existing DeFi exposure')
    }

    if (profile.gasSpendingPattern === 'high' && workflow.gasEfficiency > 0.8) {
      whyReasons.push('Reduces your high gas costs significantly')
    }

    return whyReasons.length > 0 ? whyReasons.join('. ') + '.' : 'Well-suited to your portfolio characteristics.'
  }

  private calculateGasSavings(workflow: WorkflowProfile, profile: WalletProfile): number {
    const baseSavings = workflow.gasEfficiency * 100 // Base percentage savings
    
    // Adjust based on transaction frequency
    let frequencyMultiplier = 1
    switch (profile.transactionFrequency) {
      case 'low': frequencyMultiplier = 0.5; break
      case 'medium': frequencyMultiplier = 1; break
      case 'high': frequencyMultiplier = 1.5; break
    }

    return Math.round(baseSavings * frequencyMultiplier)
  }

  private calculateTimeToProfit(workflow: WorkflowProfile, profile: WalletProfile): string {
    const baseDays = Math.round(365 / (workflow.expectedAPY * 100))
    
    // Adjust based on portfolio size
    let sizeMultiplier = 1
    if (profile.portfolioSize < 1000) sizeMultiplier = 1.5
    else if (profile.portfolioSize > 50000) sizeMultiplier = 0.8

    const adjustedDays = Math.round(baseDays * sizeMultiplier)
    
    if (adjustedDays < 30) return `${adjustedDays} days`
    else if (adjustedDays < 365) return `${Math.round(adjustedDays / 30)} months`
    else return `${Math.round(adjustedDays / 365)} years`
  }

  private getRiskCompatibility(userRisk: string, workflowRisk: string): number {
    const riskLevels = { conservative: 1, moderate: 2, aggressive: 3 }
    const userLevel = riskLevels[userRisk as keyof typeof riskLevels]
    const workflowLevel = riskLevels[workflowRisk as keyof typeof riskLevels]
    
    const diff = Math.abs(userLevel - workflowLevel)
    return Math.max(0, 1 - diff * 0.5)
  }

  private calculateProtocolOverlap(userProtocols: string[], targetProtocols: string[]): number {
    const userSet = new Set(userProtocols)
    const targetSet = new Set(targetProtocols)
    const intersection = new Set([...userSet].filter(x => targetSet.has(x)))
    return intersection.size / Math.max(userSet.size, targetSet.size)
  }

  private getDurationCompatibility(userDuration: string, optimalDurations: string[]): number {
    return optimalDurations.includes(userDuration) ? 1 : 0.5
  }
}

// Export singleton instance
export const strategyRecommender = new StrategyRecommender()
