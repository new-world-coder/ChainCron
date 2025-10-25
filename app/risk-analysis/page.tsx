'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiskAnalysis } from '@/components/RiskAnalysis'
import { mockWorkflows } from '@/lib/mockData/workflows'

export default function RiskAnalysisPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('1')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Risk Analysis Dashboard
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Comprehensive risk assessment for all workflows. Make informed decisions with AI-powered risk analysis.
          </motion.p>
        </div>

        {/* Workflow Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Workflow for Risk Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockWorkflows.map((workflow) => (
              <motion.button
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id.toString())}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedWorkflow === workflow.id.toString()
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-semibold text-lg mb-2">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {workflow.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {workflow.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(workflow as any).subscribers || 0} subscribers
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Risk Analysis Component */}
        <motion.div
          key={selectedWorkflow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RiskAnalysis workflowId={selectedWorkflow} />
        </motion.div>
      </div>
    </div>
  )
}
