'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FadeIn, 
  SlideInLeft, 
  SlideInRight, 
  SlideInUp, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem,
  HoverScale,
  HoverLift,
  Floating,
  Pulse,
  ScrollAnimation,
  TypingAnimation
} from '@/components/Animations'
import { 
  ActionButton, 
  InteractiveCard, 
  Badge, 
  Tooltip,
  FeedbackButton,
  EmptyState
} from '@/components/VisualPolish'
import { 
  Zap, 
  BarChart3, 
  Users, 
  Shield, 
  ArrowRight, 
  Play, 
  Star,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  Rocket,
  Globe,
  Lock
} from 'lucide-react'

export function PolishedLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: Zap,
      title: 'Automated DeFi Strategies',
      description: 'Set up complex DeFi workflows that run automatically, 24/7',
      stats: '98% Success Rate'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track performance with detailed analytics and risk assessment',
      stats: '+15% Average ROI'
    },
    {
      icon: Users,
      title: 'Creator Marketplace',
      description: 'Monetize your strategies or discover proven workflows',
      stats: '$2.5M+ Creator Earnings'
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'All executions are verifiable on-chain with full transparency',
      stats: '100% On-Chain'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Total Volume', value: '$125M+', icon: DollarSign },
    { label: 'Workflows Created', value: '2.5K+', icon: Zap },
    { label: 'Success Rate', value: '97.8%', icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'DeFi Trader',
      content: 'ChainCron has revolutionized how I manage my DeFi portfolio. The automation saves me hours every day.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Yield Farmer',
      content: 'The analytics dashboard gives me insights I never had before. My ROI increased by 40% in just 3 months.',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Elena Volkov',
      role: 'Crypto Investor',
      content: 'Finally, a platform that makes DeFi accessible. The creator marketplace is a game-changer.',
      rating: 5,
      avatar: 'EV'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <FadeIn delay={0.2}>
                <Badge variant="info" className="mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Now Live on Forte Chain
                </Badge>
              </FadeIn>
              
              <SlideInLeft delay={0.4}>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Automate Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    DeFi Future
                  </span>
                </h1>
              </SlideInLeft>
              
              <SlideInLeft delay={0.6}>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  ChainCron is the first decentralized automation platform that lets you create, 
                  share, and monetize DeFi workflows. Set it and forget it.
                </p>
              </SlideInLeft>
              
              <StaggerContainer delay={0.1}>
                <StaggerItem>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <ActionButton size="lg" className="flex-1">
                      <Rocket className="w-5 h-5" />
                      Start Automating
                      <ArrowRight className="w-4 h-4" />
                    </ActionButton>
                    <ActionButton variant="outline" size="lg" className="flex-1">
                      <Play className="w-5 h-5" />
                      Watch Demo
                    </ActionButton>
                  </div>
                </StaggerItem>
                
                <StaggerItem>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      No coding required
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Fully decentralized
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Creator rewards
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
            
            <div className="relative">
              <Floating intensity={20}>
                <div className="glass rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Live Dashboard</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-green-500">Live</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {stats.slice(0, 4).map((stat, index) => (
                        <motion.div
                          key={index}
                          className="text-center p-4 bg-muted/50 rounded-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-Compound Yield</span>
                        <span className="text-sm font-semibold text-green-500">+$247.50</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '78%' }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Floating>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SlideInUp>
              <h2 className="text-4xl font-bold mb-4">Why Choose ChainCron?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The only platform that combines automation, analytics, and creator monetization 
                in a fully decentralized ecosystem.
              </p>
            </SlideInUp>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <HoverLift key={index} y={-10}>
                <InteractiveCard
                  className={`transition-all duration-300 ${
                    activeFeature === index ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="text-center space-y-4">
                    <div className={`p-4 rounded-full mx-auto w-fit ${
                      activeFeature === index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Badge variant="success" size="sm">
                      {feature.stats}
                    </Badge>
                  </div>
                </InteractiveCard>
              </HoverLift>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">
                        <TypingAnimation text={stat.value} speed={100} />
                      </div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SlideInUp>
              <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users who are already automating their DeFi strategies
              </p>
            </SlideInUp>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation key={index}>
                <InteractiveCard className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </div>
                </InteractiveCard>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <ScaleIn>
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold">
                Ready to Automate Your DeFi Strategy?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join the future of decentralized automation. Start building, earning, and growing today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ActionButton size="lg" className="flex-1 max-w-xs">
                  <Rocket className="w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </ActionButton>
                <ActionButton variant="outline" size="lg" className="flex-1 max-w-xs">
                  <Globe className="w-5 h-5" />
                  Explore Marketplace
                </ActionButton>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Secure & Audited
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  No Lock-in Period
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Setup in 5 Minutes
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>
    </div>
  )
}
