'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useAuth } from '@/lib/auth/hooks'
import { 
  Mail, 
  Lock, 
  User,
  Shield, 
  Wallet, 
  Github, 
  Twitter, 
  Chrome,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'subscriber' | 'creator'>('subscriber')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [signupMethod, setSignupMethod] = useState<'wallet' | 'social' | 'email'>('wallet')
  
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const { isAuthenticated } = useAuth()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      // Register user via API
      const response = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, password }),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      // Show success and redirect to sign in page
      setSuccess(true)
      setTimeout(() => {
        router.push(`/auth/signin?email=${encodeURIComponent(email)}&justSignedUp=true`)
      }, 2000)
    } catch (err) {
      setError('An error occurred during sign up.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = async () => {
    if (isConnected) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">Join ChainCron</h1>
            <p className="text-muted-foreground">
              Start automating your DeFi workflows
            </p>
          </motion.div>
        </div>

        {/* Signup Method Tabs */}
        <div className="mb-6">
          <div className="flex bg-muted rounded-lg p-1">
            {[
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'social', label: 'Social', icon: Mail },
              { id: 'email', label: 'Email', icon: User },
            ].map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => setSignupMethod(method.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signupMethod === method.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {method.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p className="font-semibold">Account created successfully!</p>
              <p>Redirecting to sign in...</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Wallet Signup */}
        {signupMethod === 'wallet' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <Wallet className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground text-sm">
                Your wallet is your identity on ChainCron
              </p>
            </div>
            
            <div className="space-y-4">
              <ConnectButton />
              
              {isConnected && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleWalletConnect}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue to Dashboard
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Social Signup */}
        {signupMethod === 'social' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Social Sign Up</h2>
              <p className="text-muted-foreground text-sm">
                Sign up with your social account
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Social signup requires OAuth configuration.
                  <br />
                  Please use Wallet Connect or Email signup instead.
                </p>
              </div>
              
              <motion.button
                onClick={() => setSignupMethod('wallet')}
                className="w-full py-3 border border-border rounded-lg hover:bg-muted transition-colors bg-primary/5 text-foreground"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Use Wallet Signup
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Email Signup */}
        {signupMethod === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Create Account</h2>
              <p className="text-muted-foreground text-sm">
                Sign up with your email address
              </p>
            </div>
            
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="At least 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">I want to be a</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('subscriber')}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                      role === 'subscriber'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    Subscriber
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                      role === 'creator'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    Creator
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {role === 'subscriber' 
                    ? 'Subscribe to workflows and execute automations'
                    : 'Create and publish automation workflows'}
                </p>
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

