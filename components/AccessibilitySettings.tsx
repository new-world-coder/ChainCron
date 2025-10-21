'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  X, 
  Eye, 
  Volume2, 
  Keyboard, 
  Type, 
  Contrast,
  Monitor,
  Smartphone,
  Tablet,
  Check
} from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

interface AccessibilitySettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const { settings, updateSettings, announceToScreenReader } = useAccessibility()
  const [activeTab, setActiveTab] = useState<'visual' | 'interaction' | 'display'>('visual')

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    announceToScreenReader(`${key} setting updated`)
  }

  const tabs = [
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'interaction', label: 'Interaction', icon: Keyboard },
    { id: 'display', label: 'Display', icon: Monitor }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-96 max-w-[90vw] glass border-l border-border"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Accessibility Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close accessibility settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'visual' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Visual Settings</h3>
                      
                      {/* High Contrast */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Contrast className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">High Contrast</div>
                            <div className="text-sm text-muted-foreground">
                              Increase contrast for better visibility
                            </div>
                          </div>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.highContrast ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                          aria-label={`${settings.highContrast ? 'Disable' : 'Enable'} high contrast`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Reduce Motion</div>
                            <div className="text-sm text-muted-foreground">
                              Minimize animations and transitions
                            </div>
                          </div>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.reducedMotion ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                          aria-label={`${settings.reducedMotion ? 'Disable' : 'Enable'} reduced motion`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Focus Visible */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Keyboard className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Focus Indicators</div>
                            <div className="text-sm text-muted-foreground">
                              Show focus outlines for keyboard navigation
                            </div>
                          </div>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.focusVisible ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => handleSettingChange('focusVisible', !settings.focusVisible)}
                          aria-label={`${settings.focusVisible ? 'Disable' : 'Enable'} focus indicators`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.focusVisible ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'interaction' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Interaction Settings</h3>
                      
                      {/* Keyboard Navigation */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Keyboard className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Keyboard Navigation</div>
                            <div className="text-sm text-muted-foreground">
                              Enhanced keyboard navigation support
                            </div>
                          </div>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.keyboardNavigation ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => handleSettingChange('keyboardNavigation', !settings.keyboardNavigation)}
                          aria-label={`${settings.keyboardNavigation ? 'Disable' : 'Enable'} keyboard navigation`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Screen Reader */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Screen Reader Support</div>
                            <div className="text-sm text-muted-foreground">
                              Optimize for screen readers
                            </div>
                          </div>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.screenReader ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => handleSettingChange('screenReader', !settings.screenReader)}
                          aria-label={`${settings.screenReader ? 'Disable' : 'Enable'} screen reader support`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'display' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Display Settings</h3>
                      
                      {/* Font Size */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Type className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Font Size</div>
                            <div className="text-sm text-muted-foreground">
                              Adjust text size for better readability
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                              key={size}
                              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                settings.fontSize === size
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted hover:bg-muted/80'
                              }`}
                              onClick={() => handleSettingChange('fontSize', size)}
                            >
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Device Preview */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Device Preview</div>
                            <div className="text-sm text-muted-foreground">
                              Preview how the app looks on different devices
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                            <Smartphone className="w-6 h-6" />
                            <span className="text-xs">Mobile</span>
                          </button>
                          <button className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                            <Tablet className="w-6 h-6" />
                            <span className="text-xs">Tablet</span>
                          </button>
                          <button className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                            <Monitor className="w-6 h-6" />
                            <span className="text-xs">Desktop</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Reset Button */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
                  onClick={() => {
                    updateSettings({
                      highContrast: false,
                      reducedMotion: false,
                      fontSize: 'medium',
                      screenReader: false,
                      keyboardNavigation: false,
                      focusVisible: true
                    })
                    announceToScreenReader('Accessibility settings reset to default')
                  }}
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
