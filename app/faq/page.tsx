'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Zap, 
  DollarSign, 
  Users, 
  Shield, 
  MessageCircle, 
  Mail, 
  BookOpen, 
  Play,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const categories = [
    { id: 'getting-started', label: '🚀 Getting Started', icon: Zap },
    { id: 'flow-tech', label: '⚡ Flow Technology', icon: Zap },
    { id: 'pricing', label: '💰 Pricing & Payments', icon: DollarSign },
    { id: 'creators', label: '🎨 For Creators', icon: Users },
    { id: 'security', label: '🔒 Security & Privacy', icon: Shield }
  ]

  const faqData = {
    'getting-started': [
      {
        id: 'what-is-chaincron',
        question: 'What is ChainCron?',
        answer: 'ChainCron is the first automation marketplace built on Flow blockchain. Think of it as "Zapier for DeFi" - you subscribe to pre-built workflows that automatically manage your crypto 24/7. Whether it\'s compounding yields, rebalancing portfolios, or setting price alerts, ChainCron handles it while you sleep.',
        popular: true
      },
      {
        id: 'need-signup',
        question: 'Do I need to sign up?',
        answer: 'No signup required to browse! You can explore all workflows, check performance metrics, and read reviews without connecting a wallet. When you\'re ready to subscribe, just connect your wallet - no email, no password, no forms. That\'s it!'
      },
      {
        id: 'different-from-bot',
        question: 'How is this different from using a bot?',
        answer: '🎯 Key difference: Flow\'s Forte upgrade enables **native scheduled transactions**. This means: ✅ No external servers or bots ✅ Runs directly on blockchain (trustless) ✅ Can\'t be shut down or paused ✅ Transparent execution history ✅ Lower costs (no middleman fees). Traditional bots require trusted operators. ChainCron runs on Flow\'s protocol layer.'
      }
    ],
    'flow-tech': [
      {
        id: 'what-are-flow-actions',
        question: 'What are Flow Actions?',
        answer: 'Flow Actions (FLIP-338) are like LEGO blocks for DeFi. Each Action is a reusable, composable building block that represents a specific operation (swap, stake, lend, etc.). ChainCron workflows combine multiple Actions into automated strategies.'
      },
      {
        id: 'scheduled-transactions',
        question: 'What are Scheduled Transactions?',
        answer: 'Flow\'s native feature that lets smart contracts execute code at a future time WITHOUT needing an external trigger. Traditional blockchains need someone/something to call your contract. Flow can schedule: "Execute this workflow every 24 hours" and it happens automatically at the protocol level.'
      },
      {
        id: 'why-flow-better',
        question: 'Why is Flow better for automation?',
        answer: 'Flow was purpose-built for consumer apps. Benefits: 🚄 Fast (sub-second finality) 💰 Low fees (cents, not dollars) 🔒 Secure (resource-oriented programming) 🤝 Composable (Actions + Cadence) 🌐 EVM compatible (works with Ethereum tools)'
      }
    ],
    'pricing': [
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer: 'Primary: USDC (on Flow). Also accepted: ETH, FORTE token. Coming soon: Credit card via Stripe. Why USDC first? It\'s stable, fast, and widely held by DeFi users.'
      },
      {
        id: 'free-trial',
        question: 'How does the free trial work?',
        answer: '7 days, fully featured, no credit card required. 1. Connect wallet (any Web3 wallet) 2. Choose 1 workflow 3. Configure and activate 4. Trial starts immediately. After 7 days: Upgrade to Pro ($29/mo) or workflows pause. Your data stays safe - reactivate anytime.'
      },
      {
        id: 'refunds',
        question: 'Can I get a refund?',
        answer: 'Yes! 14-day money-back guarantee. - Pro-rated refunds for monthly/annual plans - Instant on-chain refunds (no waiting) - No questions asked policy'
      }
    ],
    'creators': [
      {
        id: 'become-creator',
        question: 'How do I become a workflow creator?',
        answer: 'Simple 3-step process: 1. Build your workflow (use our Builder or code in Cadence) 2. Test on testnet (we help with this) 3. Submit for review (1-2 day approval). Requirements: ✅ Workflow must solve a real problem ✅ Tested execution history ✅ Clear documentation ✅ Security review passed'
      },
      {
        id: 'how-much-earn',
        question: 'How much can I earn?',
        answer: 'Creators earn 80% of subscription fees. Example: Your workflow costs $10/month - 50 subscribers = $400/month to you - 200 subscribers = $1,600/month - Top creators earn $3K+/month'
      },
      {
        id: 'successful-workflow',
        question: 'What makes a successful workflow?',
        answer: 'Top-performing workflows share: 1. 💡 Solve specific pain (not generic) 2. 📊 Proven track record (show results) 3. 📝 Clear description (users understand it) 4. 🎯 Optimized gas (lower costs) 5. 🔄 Regular updates (maintain quality)'
      }
    ],
    'security': [
      {
        id: 'crypto-safe',
        question: 'Is my crypto safe?',
        answer: 'Absolutely. ChainCron is **non-custodial**: ✅ You control your private keys ✅ We never touch your funds ✅ Smart contracts are audited ✅ Permissions are granular (you approve each action) ✅ Open source (verify yourself)'
      },
      {
        id: 'data-collection',
        question: 'What data do you collect?',
        answer: 'Minimal: - On-chain: Wallet address, subscriptions, executions (public blockchain data) - Off-chain (optional): Email for notifications. We DON\'T collect: ❌ Personal information ❌ Browsing history ❌ Private keys ❌ Transaction details beyond what\'s on-chain'
      }
    ]
  }

  const allFAQs = Object.values(faqData).flat()

  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return faqData[activeCategory as keyof typeof faqData] || []
    
    return allFAQs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, activeCategory, allFAQs])

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const quickLinks = [
    { href: '#getting-started', label: '🚀 Getting Started', count: 12 },
    { href: '#pricing', label: '💰 Pricing', count: 8 },
    { href: '#flow-tech', label: '⚡ Flow Technology', count: 15 },
    { href: '#creators', label: '🎨 For Creators', count: 10 }
  ]

  const popularQuestions = [
    'What is ChainCron?',
    'How does the free trial work?',
    'Is my crypto safe?',
    'What are Flow Actions?',
    'How much can creators earn?'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Everything you need to know about automating on Flow
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {quickLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className="text-white hover:bg-white/10 border border-white/20"
              >
                {link.label}
                <Badge className="ml-2 bg-blue-600 text-white">{link.count}</Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    const count = faqData[category.id as keyof typeof faqData]?.length || 0
                    
                    return (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? 'default' : 'ghost'}
                        className={`w-full justify-start text-left ${
                          activeCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {category.label}
                        <Badge className="ml-auto bg-white/20 text-white">{count}</Badge>
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Popular Questions */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-sm">🔥 Most asked this week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {popularQuestions.slice(0, 5).map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left text-gray-300 hover:bg-white/10 hover:text-white text-sm"
                        onClick={() => {
                          setSearchQuery(question)
                          setActiveCategory('getting-started')
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-white">
                    Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {filteredFAQs.map((faq) => {
                  const isExpanded = expandedItems[faq.id]
                  
                  return (
                    <Card key={faq.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <CardContent className="p-0">
                        <button
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                          onClick={() => toggleExpanded(faq.id)}
                        >
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                            {faq.popular && (
                              <Badge className="bg-yellow-500 text-black text-xs">POPULAR</Badge>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="px-6 pb-6 border-t border-white/10">
                            <div className="pt-4 text-gray-300 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Still can't find what you're looking for?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Chat with us</h3>
                <p className="text-gray-300 mb-4">Live support (avg response: 2 min)</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Email us</h3>
                <p className="text-gray-300 mb-4">support@chaincron.app</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Send email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Read docs</h3>
                <p className="text-gray-300 mb-4">Technical documentation</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  View docs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Play className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Watch tutorials</h3>
                <p className="text-gray-300 mb-4">Video guides & demos</p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Watch now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Chat Widget (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Claude AI Assistant</div>
                <div className="text-white/80 text-xs">Ask me anything about automation!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
