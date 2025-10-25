'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Sparkles,
  Zap,
  Users,
  Share2,
  Play,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Crown,
  Flame,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AIWorkflowBuilder } from '@/components/AIWorkflowBuilder'
import { TemplateGallery } from '@/components/TemplateGallery'
import { SocialFeatures } from '@/components/SocialFeatures'
import { WorkflowComposer } from '@/components/WorkflowComposer'

type TabType = 'ai-builder' | 'templates' | 'community' | 'composer'

export default function AIZapierPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ai-builder')
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)

  const tabs = [
    {
      id: 'ai-builder' as TabType,
      label: 'AI Builder',
      icon: Bot,
      description: 'Create workflows with natural language',
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 'templates' as TabType,
      label: 'Templates',
      icon: Sparkles,
      description: 'Pre-built automation recipes',
      color: 'from-green-500 to-blue-600',
    },
    {
      id: 'community' as TabType,
      label: 'Community',
      icon: Users,
      description: 'Discover shared workflows',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'composer' as TabType,
      label: 'Composer',
      icon: Zap,
      description: 'Visual workflow builder',
      color: 'from-orange-500 to-red-600',
    },
  ]

  const handleWorkflowGenerated = (workflow: any) => {
    setSelectedWorkflow(workflow)
    setActiveTab('composer')
  }

  const handleTemplateUse = (template: any) => {
    setSelectedWorkflow(template.workflow)
    setActiveTab('composer')
  }

  const handleWorkflowUse = (workflow: any) => {
    setSelectedWorkflow(workflow.workflow)
    setActiveTab('composer')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-builder':
        return <AIWorkflowBuilder onWorkflowGenerated={handleWorkflowGenerated} />
      case 'templates':
        return <TemplateGallery onTemplateUse={handleTemplateUse} />
      case 'community':
        return <SocialFeatures onWorkflowUse={handleWorkflowUse} />
      case 'composer':
        return <WorkflowComposer />
      default:
        return <AIWorkflowBuilder onWorkflowGenerated={handleWorkflowGenerated} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Zapier for Flow
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                The first conversational AI automation platform for Flow blockchain. 
                Create workflows with natural language, discover community recipes, 
                and automate your Web3 tasks like never before.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <Card className="border-2 hover:border-primary/20 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Workflow Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe your automation in plain English and watch AI create the perfect workflow
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/20 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Template Gallery</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from pre-built automations for staking, NFT minting, and DeFi strategies
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/20 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Recipes</h3>
                  <p className="text-sm text-muted-foreground">
                    Share, fork, and discover automation recipes created by the community
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => setActiveTab('ai-builder')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Bot className="w-5 h-5 mr-2" />
                Start with AI Builder
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setActiveTab('templates')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Browse Templates
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 ${
                      activeTab === tab.id 
                        ? `bg-gradient-to-r ${tab.color} text-white border-0` 
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Flow?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of creators, gamers, and DeFi users who are already automating their blockchain tasks with ChainCron.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setActiveTab('ai-builder')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Play className="w-5 h-5 mr-2" />
              Create Your First Workflow
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setActiveTab('community')}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Explore Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
