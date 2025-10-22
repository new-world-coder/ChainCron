'use client'

import { useState } from 'react'
import { OnboardingFlow } from '@/components/OnboardingFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, ArrowRight, Play } from 'lucide-react'

export default function OnboardingPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-white mb-4">
            Get Started with ChainCron
          </CardTitle>
          <p className="text-xl text-gray-300 mb-8">
            Set up your first automation in under 60 seconds
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 font-bold">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Connect Wallet</h3>
              <p className="text-gray-300 text-sm">Secure, non-custodial connection</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">AI Recommendations</h3>
              <p className="text-gray-300 text-sm">Personalized workflow suggestions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Start Earning</h3>
              <p className="text-gray-300 text-sm">Automation begins immediately</p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setIsOnboardingOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-gray-400 text-sm mt-4">
              7 days free • No credit card required • Cancel anytime
            </p>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Why ChainCron?</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Built on Flow's native scheduled transactions</li>
              <li>• AI-powered recommendations from Claude</li>
              <li>• Non-custodial - you control your funds</li>
              <li>• Proven track record with 98%+ success rate</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <OnboardingFlow 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  )
}