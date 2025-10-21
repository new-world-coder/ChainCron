'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Check,
  Globe,
  Zap,
  Shield,
  AlertTriangle,
  ExternalLink,
  Copy,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SUPPORTED_CHAINS, CHAIN_LOGOS, ChainConfig, getAllChains, getOnlineChains } from '@/lib/chains/registry'
import { toast } from 'sonner'

interface ChainSelectorProps {
  selectedChains: string[]
  onChainsChange: (chains: string[]) => void
  multiSelect?: boolean
  showGasPrices?: boolean
  showStatus?: boolean
  className?: string
}

export function ChainSelector({
  selectedChains,
  onChainsChange,
  multiSelect = true,
  showGasPrices = true,
  showStatus = true,
  className = '',
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'mainnet' | 'testnet'>('all')

  const allChains = getAllChains()
  const onlineChains = getOnlineChains()

  const filteredChains = allChains.filter(chain => {
    const matchesSearch = chain.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'online' && chain.status === 'online') ||
      (filterStatus === 'mainnet' && !chain.isTestnet) ||
      (filterStatus === 'testnet' && chain.isTestnet)
    
    return matchesSearch && matchesFilter
  })

  const handleChainToggle = (chainName: string) => {
    if (multiSelect) {
      if (selectedChains.includes(chainName)) {
        onChainsChange(selectedChains.filter(c => c !== chainName))
      } else {
        onChainsChange([...selectedChains, chainName])
      }
    } else {
      onChainsChange([chainName])
      setIsOpen(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedChains.length === filteredChains.length) {
      onChainsChange([])
    } else {
      onChainsChange(filteredChains.map(chain => chain.name.toLowerCase()))
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const getStatusColor = (status: ChainConfig['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100'
      case 'offline': return 'text-red-600 bg-red-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: ChainConfig['status']) => {
    switch (status) {
      case 'online': return <Check className="w-3 h-3" />
      case 'offline': return <AlertTriangle className="w-3 h-3" />
      case 'maintenance': return <RefreshCw className="w-3 h-3" />
      default: return <AlertTriangle className="w-3 h-3" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>
            {selectedChains.length === 0
              ? 'Select Chains'
              : selectedChains.length === 1
              ? SUPPORTED_CHAINS[selectedChains[0]]?.name || 'Unknown Chain'
              : `${selectedChains.length} Chains Selected`}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-border rounded-lg shadow-lg"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Blockchains</CardTitle>
                
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search chains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  {['all', 'online', 'mainnet', 'testnet'].map((filter) => (
                    <Button
                      key={filter}
                      variant={filterStatus === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(filter as any)}
                      className="text-xs"
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Select All */}
                {multiSelect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="w-full"
                  >
                    {selectedChains.length === filteredChains.length ? 'Deselect All' : 'Select All'}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredChains.map((chain) => {
                    const isSelected = selectedChains.includes(chain.name.toLowerCase())
                    const isOnline = chain.status === 'online'
                    
                    return (
                      <motion.div
                        key={chain.name}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleChainToggle(chain.name.toLowerCase())}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {CHAIN_LOGOS[chain.name.toLowerCase()]}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{chain.name}</h3>
                                {chain.isTestnet && (
                                  <Badge variant="secondary" className="text-xs">
                                    Testnet
                                  </Badge>
                                )}
                                {showStatus && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getStatusColor(chain.status)}`}
                                  >
                                    {getStatusIcon(chain.status)}
                                    <span className="ml-1">{chain.status}</span>
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-muted-foreground">
                                {chain.nativeCurrency.symbol} • Chain ID: {chain.id}
                              </div>
                              
                              {showGasPrices && chain.gasPrice && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span>{chain.gasPrice} {chain.nativeCurrency.symbol}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    <span>{chain.dexRouters.length} DEX</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyAddress(chain.rpcUrl)
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(chain.blockExplorer, '_blank')
                              }}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {filteredChains.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No chains found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Chains Summary */}
      {selectedChains.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedChains.map((chainName) => {
            const chain = SUPPORTED_CHAINS[chainName]
            if (!chain) return null
            
            return (
              <Badge
                key={chainName}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span>{CHAIN_LOGOS[chainName]}</span>
                <span>{chain.name}</span>
                <button
                  onClick={() => handleChainToggle(chainName)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
