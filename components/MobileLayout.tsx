'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Zap, 
  BarChart3, 
  User, 
  Settings,
  Bell,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react'

interface MobileLayoutProps {
  children: React.ReactNode
  currentPage: string
}

export function MobileLayout({ children, currentPage }: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll to hide/show bottom navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsBottomNavVisible(false)
      } else {
        setIsBottomNavVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'marketplace', label: 'Workflows', icon: Zap, href: '/marketplace' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Mobile Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">ChainCron</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] glass border-r border-border"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        currentPage === item.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Create Workflow</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50"
        initial={{ y: 100 }}
        animate={{ y: isBottomNavVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.nav>
    </div>
  )
}

// Mobile-optimized card component
export function MobileCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      className={`glass rounded-xl p-4 mb-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Mobile-optimized button component
export function MobileButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: { 
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 active:scale-95'
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-border hover:bg-muted'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )
}

// Mobile-optimized input component
export function MobileInput({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  className = ''
}: { 
  placeholder: string
  value: string
  onChange: (value: string) => void
  type?: string
  className?: string
}) {
  return (
    <motion.input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}

// Mobile-optimized chart container
export function MobileChartContainer({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <MobileCard>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64 w-full">
        {children}
      </div>
    </MobileCard>
  )
}

// Mobile-optimized stats grid
export function MobileStatsGrid({ stats }: { 
  stats: Array<{
    label: string
    value: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
  }>
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="glass rounded-lg p-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
          {stat.change && (
            <div className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' :
              stat.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {stat.change}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Mobile-optimized list component
export function MobileList({ 
  items, 
  renderItem 
}: { 
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  )
}

// Mobile-optimized pull-to-refresh component
export function MobilePullToRefresh({ 
  onRefresh, 
  children 
}: { 
  onRefresh: () => void
  children: React.ReactNode
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    const diff = currentY - startY
    
    if (diff > 0 && window.scrollY === 0) {
      setCurrentY(diff)
      setIsPulling(true)
    }
  }

  const handleTouchEnd = () => {
    if (currentY > 100) {
      setIsRefreshing(true)
      onRefresh()
      setTimeout(() => {
        setIsRefreshing(false)
        setIsPulling(false)
        setCurrentY(0)
      }, 1000)
    } else {
      setIsPulling(false)
      setCurrentY(0)
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateY(${Math.min(currentY * 0.5, 50)}px)` }}
    >
      {isPulling && (
        <div className="flex items-center justify-center py-4">
          <motion.div
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
      {children}
    </div>
  )
}
