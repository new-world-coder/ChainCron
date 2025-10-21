'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  Bell,
  Settings,
  User,
  Search,
  Filter,
  Download,
  Share2,
  Heart,
  Star,
  ThumbsUp,
  MessageCircle
} from 'lucide-react'

// Toast notification component
interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`glass rounded-lg p-4 shadow-lg border-l-4 ${
        type === 'success' ? 'border-green-500' :
        type === 'error' ? 'border-red-500' :
        type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${
          type === 'success' ? 'text-green-500' :
          type === 'error' ? 'text-red-500' :
          type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
        }`} />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
        </div>
        <button
          onClick={() => onClose(id)}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Toast container
export function ToastContainer({ toasts, onClose }: { toasts: ToastProps[], onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Loading states
export function LoadingState({ message = 'Loading...', className = '' }: { message?: string, className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground">{message}</span>
      </div>
    </div>
  )
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = '' 
}: { 
  icon: any
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="p-4 bg-muted rounded-full mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
      {action && action}
    </div>
  )
}

// Interactive elements
export function InteractiveCard({ 
  children, 
  onClick, 
  className = '',
  disabled = false
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <motion.div
      className={`glass rounded-xl p-6 cursor-pointer transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
      } ${className}`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { y: -2, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

export function ActionButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = ''
}: { 
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-border hover:bg-muted',
    ghost: 'hover:bg-muted'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
    >
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </motion.button>
  )
}

// Feedback components
export function FeedbackButton({ 
  type, 
  count, 
  active = false, 
  onClick,
  className = ''
}: { 
  type: 'like' | 'heart' | 'star' | 'comment'
  count: number
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  const icons = {
    like: ThumbsUp,
    heart: Heart,
    star: Star,
    comment: MessageCircle
  }

  const Icon = icons[type]

  return (
    <motion.button
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      } ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-4 h-4 ${active ? 'fill-current' : ''}`} />
      <span className="text-sm font-medium">{count}</span>
    </motion.button>
  )
}

// Search component
export function SearchInput({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onSearch,
  className = ''
}: { 
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

// Filter component
export function FilterButton({ 
  active, 
  onClick, 
  children,
  className = ''
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
      } ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Filter className="w-4 h-4" />
      {children}
    </motion.button>
  )
}

// Progress indicator
export function ProgressIndicator({ 
  steps, 
  currentStep, 
  className = ''
}: { 
  steps: string[]
  currentStep: number
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            index <= currentStep 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-muted text-muted-foreground'
          }`}>
            {index < currentStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="text-sm font-semibold">{index + 1}</span>
            )}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            index <= currentStep ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-4 ${
              index < currentStep ? 'bg-primary' : 'bg-muted'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Tooltip component
export function Tooltip({ 
  content, 
  children, 
  position = 'top',
  className = ''
}: { 
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute z-50 px-3 py-2 bg-black text-white text-sm rounded-lg shadow-lg ${positionClasses[position]}`}
          >
            {content}
            <div className={`absolute w-2 h-2 bg-black transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Badge component
export function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = ''
}: { 
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const variantClasses = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}
