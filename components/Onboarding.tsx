'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Star,
  Wallet,
  Sparkles,
  Target,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  ChevronRight,
  X,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'

interface OnboardingStep {
  id: number
  title: string
  description: string
  duration: number // in seconds
  component: React.ComponentType<any>
}

interface OnboardingProps {
  onComplete?: () => void
  onSkip?: () => void
}

// Step 1: Welcome
function WelcomeStep({ onNext }: { onNext: () => void }) {
  const benefits = [
    {
      icon: Zap,
      title: 'Automate DeFi',
      description: 'Set up automated strategies that work 24/7',
      color: 'text-yellow-500',
    },
    {
      icon: TrendingUp,
      title: 'Maximize Returns',
      description: 'Optimize your portfolio with AI-powered recommendations',
      color: 'text-green-500',
    },
    {
      icon: Shield,
      title: 'Reduce Risk',
      description: 'Smart risk management and automated protection',
      color: 'text-blue-500',
    },
  ]

  return (
    <motion.div
      className="text-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-4">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome to ChainCron!
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's get you automated in 60 seconds. Transform your DeFi strategy with intelligent automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.title}
              className="p-6 bg-card border border-border rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Icon className={`w-8 h-8 ${benefit.color} mx-auto mb-4`} />
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button size="lg" onClick={onNext} className="px-8">
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

// Step 2: Use Case Selection
function UseCaseStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)

  const useCases = [
    {
      id: 'auto-compound',
      title: 'Auto-Compound Yields',
      description: 'Automatically compound your DeFi yields to maximize returns',
      icon: TrendingUp,
      color: 'bg-green-500',
      popular: true,
    },
    {
      id: 'rebalance',
      title: 'Rebalance Portfolio',
      description: 'Maintain your target asset allocations automatically',
      icon: BarChart3,
      color: 'bg-blue-500',
      popular: true,
    },
    {
      id: 'price-alerts',
      title: 'Price Alerts',
      description: 'Get notified and execute trades when prices hit targets',
      icon: Target,
      color: 'bg-purple-500',
    },
    {
      id: 'dca',
      title: 'DCA Strategy',
      description: 'Dollar-cost average into your favorite tokens',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
    {
      id: 'harvest',
      title: 'Harvest Rewards',
      description: 'Automatically harvest and reinvest rewards',
      icon: Activity,
      color: 'bg-pink-500',
    },
    {
      id: 'dao-votes',
      title: 'DAO Management',
      description: 'Automate your governance participation',
      icon: Users,
      color: 'bg-indigo-500',
    },
  ]

  const handleContinue = () => {
    if (selectedUseCase) {
      toast.success(`Great choice! ${useCases.find(uc => uc.id === selectedUseCase)?.title} is perfect for automation.`)
    }
    onNext()
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">What do you want to automate?</h2>
        <p className="text-muted-foreground text-lg">
          Choose your automation goal or browse all options
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {useCases.map((useCase, index) => {
          const Icon = useCase.icon
          const isSelected = selectedUseCase === useCase.id
          
          return (
            <motion.div
              key={useCase.id}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setSelectedUseCase(useCase.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${useCase.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {useCase.popular && (
                  <Badge variant="secondary" className="text-xs">
                    Popular
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
              <p className="text-muted-foreground text-sm">{useCase.description}</p>
              
              {isSelected && (
                <motion.div
                  className="mt-4 flex items-center text-primary text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Selected
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onSkip}>
          Skip, I'll browse
        </Button>
        <Button onClick={handleContinue} disabled={!selectedUseCase}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

// Step 3: Wallet Connection
function WalletStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      toast.success('Wallet connected successfully!')
      setTimeout(onNext, 1000)
    }
  }, [isConnected, onNext])

  const wallets = [
    { name: 'MetaMask', icon: '🦊', description: 'Most popular Web3 wallet' },
    { name: 'Rainbow', icon: '🌈', description: 'Beautiful, simple wallet' },
    { name: 'Coinbase', icon: '🔵', description: 'Trusted by millions' },
    { name: 'WalletConnect', icon: '🔗', description: 'Connect any wallet' },
  ]

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center space-y-4">
        <motion.div
          className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Wallet className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect your wallet to start automating your DeFi strategies. We need this to execute workflows on your behalf.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Why do we need this?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Execute automated transactions
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Monitor your portfolio
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Provide personalized recommendations
              </div>
            </div>
            
            <div className="pt-4">
              <ConnectButton />
            </div>
            
            {isConnected && (
              <motion.div
                className="flex items-center justify-center gap-2 text-green-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Wallet Connected!</span>
              </motion.div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        {!isConnected && (
          <Button disabled>
            Connect Wallet to Continue
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// Step 4: Personalized Recommendation
function RecommendationStep({ onNext, onCustomize }: { onNext: () => void; onCustomize: () => void }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const recommendation = {
    name: 'Auto-Compound DeFi Yields',
    description: 'Automatically compound your yields from Aave, Compound, and other protocols to maximize returns.',
    expectedEarnings: '$150-300/month',
    cost: '0.02 ETH/month',
    riskLevel: 'Low',
    compatibility: '95%',
    features: [
      'Compound yields every 24 hours',
      'Multi-protocol support',
      'Gas optimization',
      'Risk monitoring',
    ],
  }

  if (isLoading) {
    return (
      <motion.div
        className="text-center space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold">AI Analyzing Your Profile...</h2>
          <p className="text-muted-foreground text-lg">
            Finding the perfect automation strategy for you
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing wallet history</span>
              <span>✓</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calculating risk profile</span>
              <span>✓</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating recommendations</span>
              <span>⏳</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center space-y-4">
        <motion.div
          className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold">Perfect Match Found!</h2>
        <p className="text-muted-foreground text-lg">
          Based on your profile, here's the ideal workflow for you
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{recommendation.name}</h3>
              <p className="text-muted-foreground">{recommendation.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="font-semibold text-green-700 dark:text-green-300">
                  {recommendation.expectedEarnings}
                </div>
                <div className="text-sm text-muted-foreground">Expected Monthly</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  {recommendation.riskLevel} Risk
                </div>
                <div className="text-sm text-muted-foreground">Safety Level</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">What this workflow does:</h4>
              <div className="grid grid-cols-2 gap-2">
                {recommendation.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-semibold">Cost: {recommendation.cost}</div>
                <div className="text-sm text-muted-foreground">Compatibility: {recommendation.compatibility}</div>
              </div>
              <Badge variant="secondary">Pre-configured</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCustomize}>
          Customize First
        </Button>
        <Button size="lg" onClick={onNext}>
          Subscribe Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

// Step 5: Success
function SuccessStep({ onComplete }: { onComplete: () => void }) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="text-center space-y-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        {/* Confetti animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 30 * Math.PI / 180) * 100],
                y: [0, Math.sin(i * 30 * Math.PI / 180) * 100],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.5 + i * 0.05,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          You're All Set! 🎉
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your workflow is now running and will start executing automatically. 
          Sit back and watch your DeFi strategy work for you!
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">First Execution</h3>
              <div className="text-3xl font-bold text-primary">
                {countdown > 0 ? `${countdown}s` : 'Running!'}
              </div>
              <p className="text-sm text-muted-foreground">
                Your workflow will execute in the next few minutes
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span>Next execution:</span>
                <span>~2 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Monitoring:</span>
                <span>24/7</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button size="lg" onClick={onComplete} className="px-8">
          View Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome',
      description: 'Get started with ChainCron',
      duration: 15,
      component: WelcomeStep,
    },
    {
      id: 1,
      title: 'Use Case',
      description: 'Choose your automation goal',
      duration: 20,
      component: UseCaseStep,
    },
    {
      id: 2,
      title: 'Wallet',
      description: 'Connect your wallet',
      duration: 10,
      component: WalletStep,
    },
    {
      id: 3,
      title: 'Recommendation',
      description: 'Get personalized suggestions',
      duration: 15,
      component: RecommendationStep,
    },
    {
      id: 4,
      title: 'Success',
      description: 'You\'re all set!',
      duration: 0,
      component: SuccessStep,
    },
  ]

  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100)
  }, [currentStep, steps.length])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete?.()
    }, 300)
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(() => {
      onSkip?.()
    }, 300)
  }

  const handleCustomize = () => {
    // Navigate to builder
    window.location.href = '/builder'
  }

  if (!isVisible) {
    return null
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FC</span>
            </div>
            <span className="font-bold text-lg">ChainCron</span>
          </div>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Tour
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                onComplete={handleComplete}
                onCustomize={handleCustomize}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
