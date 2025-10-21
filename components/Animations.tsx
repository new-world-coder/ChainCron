'use client'

import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface AnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

// Fade in animation
export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from left
export function SlideInLeft({ children, delay = 0, duration = 0.5, className = '' }: AnimationProps) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration, type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from right
export function SlideInRight({ children, delay = 0, duration = 0.5, className = '' }: AnimationProps) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration, type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from bottom
export function SlideInUp({ children, delay = 0, duration = 0.5, className = '' }: AnimationProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration, type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale in animation
export function ScaleIn({ children, delay = 0, duration = 0.5, className = '' }: AnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration, type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
export function StaggerContainer({ children, delay = 0.1, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hover animations
export function HoverScale({ children, scale = 1.05, className = '' }: { children: ReactNode, scale?: number, className?: string }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HoverLift({ children, y = -5, className = '' }: { children: ReactNode, y?: number, className?: string }) {
  return (
    <motion.div
      whileHover={{ y }}
      transition={{ type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Loading animations
export function LoadingSpinner({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <motion.div
      className={`border-2 border-primary border-t-transparent rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// Skeleton loader
export function SkeletonLoader({ width = '100%', height = '20px', className = '' }: { width?: string, height?: string, className?: string }) {
  return (
    <motion.div
      className={`bg-muted rounded ${className}`}
      style={{ width, height }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

// Page transition
export function PageTransition({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Modal animation
export function ModalAnimation({ children, isOpen, className = '' }: { children: ReactNode, isOpen: boolean, className?: string }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${className}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass rounded-xl p-6 max-w-md mx-auto mt-20"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Scroll-triggered animation
export function ScrollAnimation({ children, className = '' }: { children: ReactNode, className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.6, type: 'spring', damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Counter animation
export function AnimatedCounter({ value, duration = 2, className = '' }: { value: number, duration?: number, className?: string }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  )
}

// Progress bar animation
export function AnimatedProgress({ progress, className = '' }: { progress: number, className?: string }) {
  return (
    <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
      <motion.div
        className="h-2 bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}

// Typing animation
export function TypingAnimation({ text, speed = 50, className = '' }: { text: string, speed?: number, className?: string }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  )
}

// Floating animation
export function Floating({ children, intensity = 10, className = '' }: { children: ReactNode, intensity?: number, className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -intensity, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation
export function Pulse({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Shake animation
export function Shake({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      animate={{ x: [0, -10, 10, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Bounce animation
export function Bounce({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
