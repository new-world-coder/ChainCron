'use client'

import { useState } from 'react'
import { AccessibilityProvider, AccessibilitySettings } from '@/components/AccessibilityProvider'
import { 
  FadeIn, 
  SlideInLeft, 
  ScaleIn, 
  HoverScale, 
  LoadingSpinner,
  SkeletonLoader,
  StaggerContainer,
  StaggerItem
} from '@/components/Animations'
import { 
  ActionButton, 
  InteractiveCard, 
  ToastContainer,
  Badge,
  Tooltip,
  FeedbackButton
} from '@/components/VisualPolish'
import { ResponsiveContainer, ResponsiveGrid } from '@/hooks/useResponsive'

export default function FeatureTestPage() {
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [toasts, setToasts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message, onClose: (id: string) => setToasts(prev => prev.filter(t => t.id !== id)) }])
  }

  const testLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <FadeIn>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">🎉 New Features Test Page</h1>
              <p className="text-xl text-muted-foreground">
                Test all the new features from Prompts 14 & 15
              </p>
              <div className="flex gap-4 justify-center">
                <ActionButton onClick={() => setShowAccessibility(true)}>
                  🔧 Accessibility Settings
                </ActionButton>
                <ActionButton variant="outline" onClick={() => addToast('success', 'Test Toast', 'This is a test notification!')}>
                  🔔 Test Toast
                </ActionButton>
                <ActionButton variant="secondary" onClick={testLoading}>
                  ⏳ Test Loading
                </ActionButton>
              </div>
            </div>
          </FadeIn>

          {/* Accessibility Settings */}
          <AccessibilitySettings isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />

          {/* Toast Container */}
          <ToastContainer toasts={toasts} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

          {/* Loading Test */}
          {loading && (
            <div className="glass rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Loading Test</h3>
              <LoadingSpinner size={48} />
              <p className="mt-4 text-muted-foreground">Loading for 3 seconds...</p>
            </div>
          )}

          {/* Animation Showcase */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">🎬 Animation Showcase</h2>
            
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StaggerItem>
                  <SlideInLeft>
                    <InteractiveCard className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Slide In Left</h3>
                      <p className="text-muted-foreground">This card slides in from the left</p>
                    </InteractiveCard>
                  </SlideInLeft>
                </StaggerItem>
                
                <StaggerItem>
                  <ScaleIn>
                    <InteractiveCard className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Scale In</h3>
                      <p className="text-muted-foreground">This card scales in from center</p>
                    </InteractiveCard>
                  </ScaleIn>
                </StaggerItem>
                
                <StaggerItem>
                  <HoverScale>
                    <InteractiveCard className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Hover Scale</h3>
                      <p className="text-muted-foreground">Hover to see scale effect</p>
                    </InteractiveCard>
                  </HoverScale>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </section>

          {/* Interactive Components */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">🎮 Interactive Components</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Action Buttons</h3>
                <div className="space-y-4">
                  <ActionButton size="lg" onClick={() => addToast('success', 'Primary Button', 'Clicked!')}>
                    Primary Button
                  </ActionButton>
                  <ActionButton variant="secondary" size="lg" onClick={() => addToast('info', 'Secondary Button', 'Clicked!')}>
                    Secondary Button
                  </ActionButton>
                  <ActionButton variant="outline" size="lg" onClick={() => addToast('warning', 'Outline Button', 'Clicked!')}>
                    Outline Button
                  </ActionButton>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Feedback Components</h3>
                <div className="space-y-4">
                  <FeedbackButton type="like" count={42} active={false} />
                  <FeedbackButton type="heart" count={128} active={true} />
                  <FeedbackButton type="star" count={5} active={false} />
                  <FeedbackButton type="comment" count={23} active={false} />
                </div>
              </div>
            </div>
          </section>

          {/* Badges and Tooltips */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">🏷️ Badges & Tooltips</h2>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Tooltip content="This is a default badge">
                <Badge>Default</Badge>
              </Tooltip>
              <Tooltip content="Success badge">
                <Badge variant="success">Success</Badge>
              </Tooltip>
              <Tooltip content="Warning badge">
                <Badge variant="warning">Warning</Badge>
              </Tooltip>
              <Tooltip content="Error badge">
                <Badge variant="error">Error</Badge>
              </Tooltip>
              <Tooltip content="Info badge">
                <Badge variant="info">Info</Badge>
              </Tooltip>
            </div>
          </section>

          {/* Responsive Test */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">📱 Responsive Test</h2>
            
            <ResponsiveContainer>
              <ResponsiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <InteractiveCard key={i} className="text-center">
                    <h3 className="font-semibold">Card {i}</h3>
                    <p className="text-sm text-muted-foreground">Responsive grid item</p>
                  </InteractiveCard>
                ))}
              </ResponsiveGrid>
            </ResponsiveContainer>
          </section>

          {/* Skeleton Loaders */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">💀 Skeleton Loaders</h2>
            
            <div className="space-y-4">
              <SkeletonLoader width="100%" height="60px" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SkeletonLoader width="100%" height="200px" />
                <SkeletonLoader width="100%" height="200px" />
                <SkeletonLoader width="100%" height="200px" />
              </div>
            </div>
          </section>

          {/* Test Instructions */}
          <section className="glass rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">🧪 Test Instructions</h2>
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Accessibility:</strong> Click "Accessibility Settings" to test high contrast, font scaling, and reduced motion</p>
              <p><strong>Animations:</strong> Hover over cards to see hover effects, scroll to see staggered animations</p>
              <p><strong>Responsive:</strong> Resize your browser window to see responsive grid changes</p>
              <p><strong>Interactive:</strong> Click buttons to see toast notifications and loading states</p>
              <p><strong>Mobile:</strong> Visit <code>/mobile-dashboard</code> to test mobile-specific features</p>
            </div>
          </section>
        </div>
      </div>
    </AccessibilityProvider>
  )
}
