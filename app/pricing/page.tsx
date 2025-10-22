'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check, Sparkles, Zap, Rocket, Building, Palette, Star, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const pricingTiers = [
    {
      id: 'free',
      name: 'Starter',
      icon: Rocket,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out automation',
      badge: null,
      features: [
        '1 workflow for 7 days',
        '10 executions',
        'Community support',
        'Browse all workflows',
        'No wallet needed to browse'
      ],
      cta: 'Start Free',
      popular: false,
      gradient: 'from-gray-900 to-gray-800'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      price: { monthly: 29, yearly: 290 },
      description: 'For serious DeFi automation',
      badge: 'MOST POPULAR',
      features: [
        'Unlimited workflows',
        'AI recommendations powered by Claude',
        'Advanced analytics dashboard',
        'Flow Actions composability',
        'Scheduled executions',
        '24/7 auto-execution',
        'Priority support',
        'API access'
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
      gradient: 'from-blue-900 to-purple-900'
    },
    {
      id: 'creator',
      name: 'Creator',
      icon: Palette,
      price: { monthly: 0, yearly: 0 },
      description: 'Build and monetize workflows',
      badge: 'VERIFIED',
      features: [
        'All Pro features',
        'Publish unlimited workflows',
        'Creator analytics',
        'Featured placement',
        'Verified badge',
        'Co-marketing support',
        '80% revenue share'
      ],
      cta: 'Apply to Create',
      popular: false,
      gradient: 'from-purple-900 to-pink-900'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building,
      price: { monthly: null, yearly: null },
      description: 'Custom solutions for protocols',
      badge: null,
      features: [
        'White-label solution',
        'Custom Flow Actions',
        'Dedicated support',
        'SLA guarantees',
        'Custom integrations',
        'Volume discounts'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-slate-900 to-gray-800'
    }
  ]

  const flowFeatures = [
    {
      icon: '🔗',
      title: 'Flow Actions',
      description: 'Composable LEGO blocks for DeFi'
    },
    {
      icon: '⏰',
      title: 'Scheduled Transactions',
      description: 'Set it and forget it automation'
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Claude recommends optimal strategies'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Automate DeFi.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pay What Feels Right.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands earning passively on Flow. Start free, scale as you grow.
            </p>
            
            {/* Trust Signal */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Join 1,247 users earning $142K monthly</span>
            </div>

            {/* Price Toggle */}
            <div className="flex items-center justify-center gap-4 mb-16">
              <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Yearly
                {isYearly && <Badge className="ml-2 bg-green-600">Save 17%</Badge>}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon
              const isHovered = hoveredCard === tier.id
              
              return (
                <Card
                  key={tier.id}
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    tier.popular
                      ? 'scale-105 border-2 border-blue-500 shadow-2xl shadow-blue-500/20'
                      : 'hover:scale-105 hover:shadow-2xl'
                  } ${isHovered ? 'shadow-2xl' : ''}`}
                  onMouseEnter={() => setHoveredCard(tier.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-90`} />
                  
                  {/* Popular Badge */}
                  {tier.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold animate-pulse">
                        {tier.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="relative z-10 text-center">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-white/10 backdrop-blur-sm">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                    <p className="text-gray-300">{tier.description}</p>
                    
                    {/* Pricing */}
                    <div className="mt-4">
                      {tier.price.monthly === null ? (
                        <div className="text-3xl font-bold text-white">Custom</div>
                      ) : tier.price.monthly === 0 ? (
                        <div>
                          <div className="text-4xl font-bold text-white">FREE</div>
                          {tier.id === 'creator' && (
                            <div className="text-sm text-gray-300">Earn 80% revenue share</div>
                          )}
                          {tier.id === 'free' && (
                            <div className="text-sm text-gray-300">Forever</div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl font-bold text-white">
                            ${isYearly ? tier.price.yearly : tier.price.monthly}
                            {!isYearly && <span className="text-lg text-gray-300">/mo</span>}
                            {isYearly && <span className="text-lg text-gray-300">/year</span>}
                          </div>
                          {isYearly && tier.price.monthly && (
                            <div className="text-sm text-gray-300">
                              ${Math.round(tier.price.yearly / 12)}/month
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        tier.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                      size="lg"
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {/* Social Proof */}
                    {tier.id === 'pro' && (
                      <p className="text-center text-sm text-gray-400 mt-4">
                        487 users on Pro plan
                      </p>
                    )}
                    {tier.id === 'creator' && (
                      <p className="text-center text-sm text-gray-400 mt-4">
                        Avg creator earns $420/mo
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Flow-Specific Features */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Built on Flow's Forte Upgrade</h2>
          <p className="text-xl text-gray-300 mb-16">Native scheduled transactions. No external bots needed.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flowFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Price Calculator */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white">ROI Calculator</CardTitle>
              <p className="text-gray-300">See how much you could save with automation</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-white font-semibold mb-4">How much do you want to automate?</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-white">$1,000</span>
                      <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        defaultValue="50000"
                        className="flex-1"
                      />
                      <span className="text-white">$100,000</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">$50,000</div>
                      <div className="text-gray-300">Automation amount</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                    <div className="text-3xl font-bold text-green-400 mb-2">$1,200</div>
                    <div className="text-green-300">Estimated monthly savings</div>
                    <div className="text-sm text-gray-300 mt-2">Gas + time saved</div>
                  </div>
                  
                  <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400 mb-2">$14,400</div>
                    <div className="text-blue-300">Annual ROI</div>
                    <div className="text-sm text-gray-300 mt-2">12-month projection</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Start saving now
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <Badge className="bg-blue-600 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Built on Flow
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Forte Hacks Winner
            </Badge>
            <Badge className="bg-green-600 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Non-custodial
            </Badge>
            <Badge className="bg-orange-600 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Audited
            </Badge>
            <Badge className="bg-gray-600 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Open Source
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">1,247</div>
            <div className="text-xl text-gray-300">executions happening now</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to automate everything?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands earning passively on Flow</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-4">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10 px-8 py-4">
              Watch Demo (30s)
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white"></div>
              ))}
            </div>
            <span className="text-white ml-4">23 people started today</span>
          </div>
        </div>
      </section>
    </div>
  )
}
