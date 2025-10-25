'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { 
  Zap, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  Vote, 
  DollarSign, 
  Target,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Play,
  Share2,
  Plus,
  Gift
} from 'lucide-react'

interface OnboardingFlowProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingFlow({ isOpen, onClose }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [automationAmount, setAutomationAmount] = useState(80)
  const [isActivating, setIsActivating] = useState(false)
  const [isProcessingSelection, setIsProcessingSelection] = useState(false)

  const totalSteps = 5

  const goals = [
    {
      id: 'compound',
      title: 'Auto-Compound Yields',
      description: 'Maximize returns automatically',
      icon: TrendingUp,
      popular: true
    },
    {
      id: 'rebalance',
      title: 'Rebalance Portfolio',
      description: 'Maintain target allocations',
      icon: BarChart3
    },
    {
      id: 'alerts',
      title: 'Price Alerts & Swaps',
      description: 'Execute at perfect timing',
      icon: Bell
    },
    {
      id: 'dao',
      title: 'DAO Governance',
      description: 'Never miss a vote',
      icon: Vote
    },
    {
      id: 'dca',
      title: 'Dollar-Cost Average',
      description: 'Buy regularly, reduce risk',
      icon: DollarSign
    },
    {
      id: 'custom',
      title: 'Custom Automation',
      description: 'I have something specific',
      icon: Target
    }
  ]

  const wallets = [
    { name: 'MetaMask', icon: '/wallets/metamask.svg', recommended: true },
    { name: 'Rainbow', icon: '/wallets/rainbow.svg' },
    { name: 'Coinbase Wallet', icon: '/wallets/coinbase.svg' },
    { name: 'WalletConnect', icon: '/wallets/walletconnect.svg' }
  ]

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    onClose()
  }

  const activateWorkflow = async () => {
    setIsActivating(true)
    // Simulate activation
    setTimeout(() => {
      setIsActivating(false)
      nextStep()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {currentStep === 1 && 'Welcome to ChainCron! 👋'}
                {currentStep === 2 && 'What do you want to automate?'}
                {currentStep === 3 && 'Connect your wallet'}
                {currentStep === 4 && 'AI Recommendation'}
                {currentStep === 5 && 'Configure your automation'}
                {currentStep === 6 && '🎉 You\'re all set!'}
              </h2>
              <p className="text-gray-300">
                {currentStep === 1 && 'Let\'s get you automated in 60 seconds'}
                {currentStep === 2 && 'Choose one to get personalized recommendations'}
                {currentStep === 3 && 'We need this to run automations on your behalf'}
                {currentStep === 4 && 'Based on your wallet analysis'}
                {currentStep === 5 && 'We\'ve pre-filled optimal settings. Adjust if needed.'}
                {currentStep === 6 && 'Your automation is now running on Flow'}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-300">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-16 h-16 text-white" />
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-center gap-4 text-white">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Set up in under a minute</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-white">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <span>Non-custodial & secure</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-white">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <span>Start earning immediately</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={nextStep} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Let's go! <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="ghost" onClick={skipOnboarding} className="text-white hover:bg-white/10">
                  Skip, I'll explore
                </Button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">Keyboard shortcut: Press Enter</p>
            </div>
          )}

          {/* Step 2: Goal Selection */}
          {currentStep === 2 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {goals.map((goal) => {
                  const Icon = goal.icon
                  return (
                    <Card
                      key={goal.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedGoal === goal.id
                          ? 'ring-2 ring-blue-500 bg-blue-500/20'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                      onClick={() => {
                        if (isProcessingSelection) return // Prevent multiple clicks
                        setIsProcessingSelection(true)
                        setSelectedGoal(goal.id)
                        // Auto-progress to next step after a short delay for visual feedback
                        setTimeout(() => {
                          nextStep()
                          setIsProcessingSelection(false)
                        }, 800)
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          {goal.popular && (
                            <Badge className="bg-yellow-500 text-black mb-2">POPULAR</Badge>
                          )}
                        </div>
                        <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">{goal.title}</h3>
                        <p className="text-gray-300">{goal.description}</p>
                        {isProcessingSelection && selectedGoal === goal.id && (
                          <div className="mt-3 flex items-center justify-center gap-2 text-blue-400">
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Processing...</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    {selectedGoal ? 'Selected! Auto-advancing...' : 'Click any option above to continue'}
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={nextStep} 
                    className="text-white hover:bg-white/10"
                    disabled={isProcessingSelection}
                  >
                    Skip this step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Wallet Connection */}
          {currentStep === 3 && (
            <div>
              <Card className="bg-green-500/20 border-green-500/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-400" />
                    <div>
                      <strong className="text-green-400">Your crypto is safe</strong>
                      <p className="text-gray-300 text-sm">Non-custodial. You stay in control.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {wallets.map((wallet) => (
                  <Card
                    key={wallet.name}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      walletConnected
                        ? 'ring-2 ring-green-500 bg-green-500/20'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                    onClick={() => setWalletConnected(true)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div>
                          <h3 className="text-white font-semibold">{wallet.name}</h3>
                          {wallet.recommended && (
                            <Badge className="bg-blue-600 text-white text-xs">RECOMMENDED</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-300">
                  Don't have a wallet yet?{' '}
                  <Button variant="link" className="text-blue-400 p-0 h-auto">
                    Set one up (2 min) <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={nextStep} 
                  disabled={!walletConnected}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: AI Recommendation */}
          {currentStep === 4 && (
            <div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <Badge className="bg-blue-600 text-white">AI Recommended</Badge>
                </div>
                
                <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-white">Auto-Compound DeFi Yield</h3>
                        <p className="text-gray-300">
                          Based on your wallet, you have $4,700 in DeFi protocols.
                          This workflow will automatically harvest and reinvest your yields.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">23.4%</div>
                        <div className="text-gray-300 text-sm">Projected APY</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">$92</div>
                        <div className="text-gray-300 text-sm">Est. monthly earnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">30 min/week</div>
                        <div className="text-gray-300 text-sm">Time saved</div>
                      </div>
                    </div>

                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                      <h4 className="text-white font-semibold mb-2">Why this workflow?</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>✅ You're already in DeFi (Aave, Compound detected)</li>
                        <li>✅ Your balance is optimal for compounding</li>
                        <li>✅ High success rate (98.7% of 1,247 users)</li>
                        <li>✅ Low risk profile matches your activity</li>
                      </ul>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        size="lg"
                      >
                        Subscribe with 1-Click <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="ghost" className="text-white hover:bg-white/10">
                        Browse all workflows
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Configuration */}
          {currentStep === 5 && (
            <div>
              <div className="space-y-6 mb-8">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Execution Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white font-semibold mb-2 block">How often?</label>
                        <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                          <option value="6hours">Every 6 hours</option>
                          <option value="daily" selected>Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <p className="text-blue-400 text-sm">💡 Daily is optimal for compound interest growth</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Amount to Automate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">$3,760</div>
                        <div className="text-gray-300">80% of your balance</div>
                      </div>
                      <Slider
                        value={[automationAmount]}
                        onValueChange={(value) => setAutomationAmount(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                      <p className="text-yellow-400 text-sm">We recommend automating 80% and keeping 20% liquid</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Safety Limits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="gas-limit" defaultChecked />
                        <label htmlFor="gas-limit" className="text-white">Pause if gas &gt; $5</label>
                        <span className="text-gray-400 text-sm">Saves you money during network congestion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alerts" defaultChecked />
                        <label htmlFor="alerts" className="text-white">Alert me on failures</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="retry" defaultChecked />
                        <label htmlFor="retry" className="text-white">Auto-retry failed executions</label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Subscription</span>
                        <span className="text-white">$29/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Gas (estimated)</span>
                        <span className="text-white">~$2/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Platform fee</span>
                        <span className="text-white">Included</span>
                      </div>
                      <div className="border-t border-white/20 pt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-white">Total</span>
                          <span className="text-white">~$31/month</span>
                        </div>
                      </div>
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mt-4">
                        <div className="font-bold text-green-400">Expected monthly earnings: $92</div>
                        <div className="text-green-300">Net profit: $61/month 🎉</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button
                  onClick={activateWorkflow}
                  loading={isActivating}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isActivating ? 'Activating...' : 'Activate Automation'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-gray-400 text-sm mt-4">
                  Free for 7 days. Cancel anytime. No credit card required.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {currentStep === 6 && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">🎉 You're all set!</h2>
              <p className="text-xl text-gray-300 mb-8">Your automation is now running on Flow</p>

              <Card className="bg-white/10 border-white/20 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">First execution in 5:00 minutes</div>
                      <div className="text-gray-300">We'll compound your yield automatically</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">View Dashboard</h3>
                    <p className="text-gray-300 text-sm">Track your automation</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Plus className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Add Another Workflow</h3>
                    <p className="text-gray-300 text-sm">Automate more strategies</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Invite Friends</h3>
                    <p className="text-gray-300 text-sm">Get $10 credit each</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 6 && (
          <div className="p-6 border-t border-white/10 flex justify-between">
            <Button 
              variant="ghost" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="ghost" 
              onClick={skipOnboarding}
              className="text-white hover:bg-white/10"
            >
              Skip onboarding
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
