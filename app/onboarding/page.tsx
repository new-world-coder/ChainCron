'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Onboarding } from '@/components/Onboarding'
import { Play, ArrowRight, Users, Zap, Shield } from 'lucide-react'

export default function OnboardingDemoPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleStartOnboarding = () => {
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    // Redirect to dashboard or marketplace
    window.location.href = '/dashboard'
  }

  const handleOnboardingSkip = () => {
    setShowOnboarding(false)
    // Redirect to marketplace
    window.location.href = '/marketplace'
  }

  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            One-Click Onboarding
          </motion.h1>
          
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience our frictionless onboarding flow that gets users automated in just 60 seconds.
            See how we transform complex DeFi automation into a simple, guided experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" onClick={handleStartOnboarding} className="px-8">
              <Play className="w-5 h-5 mr-2" />
              Try Onboarding Flow
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Step-by-Step Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clear, intuitive steps that guide users from welcome to their first automated workflow.
                  No technical knowledge required.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI-Powered Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalized workflow suggestions based on user's wallet history and preferences.
                  Smart matching for optimal results.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Instant Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pre-configured workflows with sensible defaults. Users can start earning immediately
                  or customize later.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Onboarding Flow Features</h2>
              <p className="text-muted-foreground text-lg">
                Our 5-step onboarding process designed for maximum conversion and user satisfaction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Welcome & Benefits</h3>
                    <p className="text-muted-foreground text-sm">
                      Introduce ChainCron with clear value propositions and animated benefits showcase.
                      Duration: 15 seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Use Case Selection</h3>
                    <p className="text-muted-foreground text-sm">
                      Interactive cards for common automation goals. Users choose their primary objective
                      or skip to browse. Duration: 20 seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Wallet Connection</h3>
                    <p className="text-muted-foreground text-sm">
                      Seamless wallet connection with clear explanations of why it's needed.
                      Supports all major wallets. Duration: 10 seconds
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">AI Recommendation</h3>
                    <p className="text-muted-foreground text-sm">
                      Personalized workflow suggestion with expected earnings, risk level,
                      and pre-configured settings. Duration: 15 seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Success & Launch</h3>
                    <p className="text-muted-foreground text-sm">
                      Confetti celebration with first execution countdown. Clear next steps
                      and dashboard access. Duration: Instant
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Time:</span>
                    <span className="text-primary font-bold">~60 seconds</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Completion Rate:</span>
                    <span className="text-sm font-medium">85%+</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button size="lg" onClick={handleStartOnboarding} className="px-8">
              Experience the Flow
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
