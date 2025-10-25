'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Zap, BarChart3, Users, Settings, Bot, TestTube } from 'lucide-react'
import { TESTNET_CONFIG } from '@/lib/testnet'
import { Badge } from '@/components/ui/badge'

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Primary navigation items - most important and frequently used
  const primaryNavItems = [
    { href: '/ai-zapier', label: 'AI-Zapier', icon: Bot, featured: true },
    { href: '/marketplace', label: 'Marketplace', icon: Zap },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/creator', label: 'Creator', icon: Users },
  ]

  // Grouped secondary items in dropdowns
  const navGroups = [
    {
      label: 'Build',
      icon: Settings,
      items: [
        { href: '/builder', label: 'Builder' },
        { href: '/compose', label: 'Compose' },
        { href: '/onboarding', label: 'Onboarding' },
      ]
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      items: [
        { href: '/analytics', label: 'Analytics' },
        { href: '/risk-analysis', label: 'Risk Analysis' },
        { href: '/transparency', label: 'Transparency' },
      ]
    },
    {
      label: 'Community',
      icon: Users,
      items: [
        { href: '/leaderboards', label: 'Leaderboards' },
        { href: '/feed', label: 'Feed' },
        { href: '/nft-market', label: 'NFT Market' },
        { href: '/multi-chain', label: 'Multi-Chain' },
      ]
    },
    {
      label: 'More',
      icon: Settings,
      items: [
        { href: '/pricing', label: 'Pricing' },
        { href: '/faq', label: 'FAQ' },
      ]
    }
  ]

  // All items for mobile menu
  const allNavItems = [
    ...primaryNavItems,
    ...navGroups.flatMap(group => group.items.map(item => ({ ...item, group: group.label })))
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FC</span>
            </div>
            <span className="font-bold text-xl">Forte Cron</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {/* Primary navigation items */}
            {primaryNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item flex items-center space-x-1 transition-colors hover:text-primary whitespace-nowrap text-sm px-3 py-2 rounded-md navbar-focus ${
                    pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:bg-muted'
                  } ${item.featured ? 'font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.featured && (
                    <span className="ml-1 text-xs">✨</span>
                  )}
                </Link>
              )
            })}
            
            {/* Dropdown groups */}
            {navGroups.map((group) => {
              const Icon = group.icon
              const isActive = group.items.some(item => pathname === item.href)
              return (
                <div key={group.label} className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveDropdown(activeDropdown === group.label ? null : group.label)
                    }}
                    className={`nav-item flex items-center space-x-1 transition-colors hover:text-primary whitespace-nowrap text-sm px-3 py-2 rounded-md navbar-focus ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown menu */}
                  {activeDropdown === group.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md dropdown-shadow z-50 dropdown-enter">
                      <div className="py-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveDropdown(null)
                            }}
                            className={`block px-4 py-2 text-sm transition-colors hover:text-foreground hover:bg-muted ${
                              pathname === item.href
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Right side - Connect Button */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Testnet Badge */}
            {TESTNET_CONFIG.enabled && (
              <Badge variant="outline" className="flex items-center gap-1">
                <TestTube className="w-3 h-3 text-blue-500" />
                Testnet
              </Badge>
            )}
            
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <ConnectButton />
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-4 py-2 space-y-1">
              {/* Primary items */}
              {primaryNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.featured && (
                      <span className="ml-1 text-xs">✨</span>
                    )}
                  </Link>
                )
              })}
              
              {/* Grouped items */}
              {navGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-6 py-2 rounded-md text-sm transition-colors ${
                        pathname === item.href
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
