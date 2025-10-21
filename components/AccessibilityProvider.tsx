'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  screenReader: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
  announceToScreenReader: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false,
    keyboardNavigation: false,
    focusVisible: true
  })

  const [announcementQueue, setAnnouncementQueue] = useState<string[]>([])

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error)
      }
    }

    // Detect system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSettings(prev => ({ ...prev, reducedMotion: mediaQuery.matches }))

    // Detect screen reader
    const screenReaderDetected = window.navigator.userAgent.includes('NVDA') || 
                                 window.navigator.userAgent.includes('JAWS') ||
                                 window.navigator.userAgent.includes('VoiceOver')
    setSettings(prev => ({ ...prev, screenReader: screenReaderDetected }))

    // Listen for system preference changes
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }))
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement
    
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    root.setAttribute('data-font-size', settings.fontSize)
    
    // Apply font size scaling
    const fontSizeMap = { small: '14px', medium: '16px', large: '18px' }
    root.style.fontSize = fontSizeMap[settings.fontSize]

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    // Handle screen reader announcements
    if (announcementQueue.length > 0) {
      const message = announcementQueue[0]
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
        setAnnouncementQueue(prev => prev.slice(1))
      }, 1000)
    }
  }, [announcementQueue])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const announceToScreenReader = (message: string) => {
    setAnnouncementQueue(prev => [...prev, message])
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Screen reader only class
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Skip link component
export function SkipLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="skip-link"
      onFocus={(e) => e.target.classList.add('focus-visible')}
      onBlur={(e) => e.target.classList.remove('focus-visible')}
    >
      {children}
    </a>
  )
}

// Focus trap component
export function FocusTrap({ children, active }: { children: React.ReactNode, active: boolean }) {
  useEffect(() => {
    if (!active) return

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstFocusableElement = document.querySelector(focusableElements) as HTMLElement
    const focusableContent = document.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstFocusableElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [active])

  return <>{children}</>
}

// Accessibility Settings Component
export function AccessibilitySettings({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const { settings, updateSettings } = useAccessibility()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Accessibility Settings</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="highContrast" className="text-sm font-medium">
              High Contrast Mode
            </label>
            <input
              id="highContrast"
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSettings({ highContrast: e.target.checked })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="reducedMotion" className="text-sm font-medium">
              Reduce Motion
            </label>
            <input
              id="reducedMotion"
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="fontSize" className="text-sm font-medium">
              Font Size
            </label>
            <select
              id="fontSize"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
              className="rounded px-2 py-1"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="screenReader" className="text-sm font-medium">
              Screen Reader Support
            </label>
            <input
              id="screenReader"
              type="checkbox"
              checked={settings.screenReader}
              onChange={(e) => updateSettings({ screenReader: e.target.checked })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="keyboardNavigation" className="text-sm font-medium">
              Enhanced Keyboard Navigation
            </label>
            <input
              id="keyboardNavigation"
              type="checkbox"
              checked={settings.keyboardNavigation}
              onChange={(e) => updateSettings({ keyboardNavigation: e.target.checked })}
              className="rounded"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
