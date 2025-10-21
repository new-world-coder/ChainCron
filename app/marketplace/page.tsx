'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid, List, X } from 'lucide-react'
import { WorkflowCard } from '@/components/WorkflowCard'
import { FilterSidebar } from '@/components/FilterSidebar'
import { AIRecommendations } from '@/components/AIRecommendations'
import { mockWorkflows, getWorkflowsByCategory, searchWorkflows } from '@/lib/mockData/workflows'

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showAIRecommendations, setShowAIRecommendations] = useState(true)

  // Filter and search workflows
  const filteredWorkflows = useMemo(() => {
    let workflows = getWorkflowsByCategory(selectedCategory)
    
    if (searchQuery.trim()) {
      workflows = searchWorkflows(searchQuery)
      // Apply category filter to search results
      if (selectedCategory !== 'all') {
        workflows = workflows.filter(w => w.category === selectedCategory)
      }
    }
    
    return workflows
  }, [selectedCategory, searchQuery])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSubscribe = (workflowId: number) => {
    console.log('Subscribed to workflow:', workflowId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Workflow Marketplace
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover and subscribe to automation workflows that help you optimize your DeFi strategies and maximize returns.
          </motion.p>
        </div>

        {/* AI Recommendations Section */}
        {showAIRecommendations && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AIRecommendations userAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" />
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {selectedCategory !== 'all' || searchQuery && (
              <span className="ml-2 px-2 py-1 bg-primary-foreground/20 rounded-full text-xs">
                {selectedCategory !== 'all' ? 1 : 0} + {searchQuery ? 1 : 0}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground mr-4">
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} found
            </span>
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-muted-foreground/20'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-muted-foreground/20'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Workflows Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredWorkflows.length > 0 ? (
                <motion.div
                  key={`${selectedCategory}-${searchQuery}`}
                  className={`${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredWorkflows.map((workflow, index) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <WorkflowCard
                        workflow={workflow}
                        onSubscribe={handleSubscribe}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
