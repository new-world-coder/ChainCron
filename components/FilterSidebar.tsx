'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { categories } from '@/lib/mockData/workflows'

interface FilterSidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isMobileOpen = false,
  onMobileClose
}: FilterSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.div
              className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 lg:hidden overflow-y-auto"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={onMobileClose}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                  searchQuery={searchQuery}
                  onSearchChange={onSearchChange}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-background/50 rounded-xl p-6 glass">
        <motion.div
          className="flex items-center gap-2 mb-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <FilterContent
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function FilterContent({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}) {
  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Search Workflows
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, description, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Categories
        </label>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              onClick={() => onCategoryChange(category.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium">{category.name}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  )
}
