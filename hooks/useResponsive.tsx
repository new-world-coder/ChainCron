'use client'

import { useState, useEffect } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface ResponsiveConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

const defaultBreakpoints: ResponsiveConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useBreakpoint(breakpoints: ResponsiveConfig = defaultBreakpoints) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl')
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl')
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg')
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md')
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm')
      } else {
        setCurrentBreakpoint('xs')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [breakpoints])

  return currentBreakpoint
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
  const breakpoint = useBreakpoint()
  
  // Find the appropriate value for the current breakpoint
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpoints.indexOf(breakpoint)
  
  // Look for the closest breakpoint value
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpoints[i]
    if (values[bp] !== undefined) {
      return values[bp] as T
    }
  }
  
  return defaultValue
}

// Responsive component wrapper
export function ResponsiveWrapper({ 
  children, 
  breakpoints = defaultBreakpoints 
}: { 
  children: React.ReactNode
  breakpoints?: ResponsiveConfig 
}) {
  const currentBreakpoint = useBreakpoint(breakpoints)
  
  return (
    <div 
      className="responsive-wrapper"
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </div>
  )
}

// Responsive grid component
export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = { xs: 4, sm: 4, md: 6, lg: 6 }
}: { 
  children: React.ReactNode
  cols?: Partial<Record<Breakpoint, number>>
  gap?: Partial<Record<Breakpoint, number>>
}) {
  const currentBreakpoint = useBreakpoint()
  const currentCols = useResponsiveValue(cols, 1)
  const currentGap = useResponsiveValue(gap, 4)

  return (
    <div 
      className="responsive-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
        gap: `${currentGap * 0.25}rem`
      }}
    >
      {children}
    </div>
  )
}

// Responsive text component
export function ResponsiveText({ 
  children, 
  size = { xs: 'sm', sm: 'base', md: 'lg', lg: 'xl' },
  className = ''
}: { 
  children: React.ReactNode
  size?: Partial<Record<Breakpoint, string>>
  className?: string
}) {
  const currentSize = useResponsiveValue(size, 'base')
  
  return (
    <span className={`text-${currentSize} ${className}`}>
      {children}
    </span>
  )
}

// Responsive spacing component
export function ResponsiveSpacing({ 
  children, 
  padding = { xs: 4, sm: 6, md: 8, lg: 12 },
  margin = { xs: 0, sm: 0, md: 0, lg: 0 }
}: { 
  children: React.ReactNode
  padding?: Partial<Record<Breakpoint, number>>
  margin?: Partial<Record<Breakpoint, number>>
}) {
  const currentPadding = useResponsiveValue(padding, 4)
  const currentMargin = useResponsiveValue(margin, 0)
  
  return (
    <div 
      style={{
        padding: `${currentPadding * 0.25}rem`,
        margin: `${currentMargin * 0.25}rem`
      }}
    >
      {children}
    </div>
  )
}

// Hook for device detection
export function useDeviceDetection() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  
  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth
      
      if (width < 768) {
        setDevice('mobile')
      } else if (width < 1024) {
        setDevice('tablet')
      } else {
        setDevice('desktop')
      }
    }

    updateDevice()
    window.addEventListener('resize', updateDevice)
    return () => window.removeEventListener('resize', updateDevice)
  }, [])

  return device
}

// Hook for orientation detection
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')
  
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    return () => window.removeEventListener('resize', updateOrientation)
  }, [])

  return orientation
}

// Responsive image component
export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = { xs: '100vw', sm: '50vw', md: '33vw', lg: '25vw' },
  className = ''
}: { 
  src: string
  alt: string
  sizes?: Partial<Record<Breakpoint, string>>
  className?: string
}) {
  const currentSize = useResponsiveValue(sizes, '100vw')
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ width: currentSize }}
      loading="lazy"
    />
  )
}

// Responsive container component
export function ResponsiveContainer({ 
  children, 
  maxWidth = { xs: '100%', sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  padding = { xs: 4, sm: 6, md: 8, lg: 12 }
}: { 
  children: React.ReactNode
  maxWidth?: Partial<Record<Breakpoint, string>>
  padding?: Partial<Record<Breakpoint, number>>
}) {
  const currentMaxWidth = useResponsiveValue(maxWidth, '100%')
  const currentPadding = useResponsiveValue(padding, 4)
  
  return (
    <div 
      style={{
        maxWidth: currentMaxWidth,
        margin: '0 auto',
        padding: `0 ${currentPadding * 0.25}rem`
      }}
    >
      {children}
    </div>
  )
}
