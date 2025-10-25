'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { 
  Mail, 
  Lock, 
  Shield, 
  Wallet, 
  Github, 
  Twitter, 
  Chrome,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginMethod, setLoginMethod] = useState<'wallet' | 'social' | 'admin'>('wallet')
  
  const router = useRouter()
  const { isConnected } = useAccount()

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn(provider, { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        setError('Login failed. Please try again.')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        mfaCode,
        callbackUrl: '/admin',
        redirect: false,
      })
      
      if (result?.error) {
        setError('Invalid credentials. Please check your email and password.')
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError('An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = () => {
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
            <h1 className="text-3xl font-bold mb-2">Welcome to ChainCron</h1>
            <p className="text-muted-foreground">
              Choose your preferred login method
            </p>
          </motion.div>
        </div>

        {/* Login Method Tabs */}
        <div className="mb-6">
          <div className="flex bg-muted rounded-lg p-1">
            {[
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'social', label: 'Social', icon: Mail },
              { id: 'admin', label: 'Admin', icon: Shield },
            ].map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => setLoginMethod(method.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === method.id
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

        {/* Wallet Login */}
        {loginMethod === 'wallet' && (
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
                Connect your Web3 wallet to access ChainCron with your on-chain identity
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

        {/* Social Login */}
        {loginMethod === 'social' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Social Login</h2>
              <p className="text-muted-foreground text-sm">
                Sign in with your social account for a seamless experience
              </p>
            </div>
            
            <div className="space-y-3">
              <motion.button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chrome className="w-5 h-5 text-red-500" />
                Continue with Google
              </motion.button>
              
              <motion.button
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </motion.button>
              
              <motion.button
                onClick={() => handleSocialLogin('twitter')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Twitter className="w-5 h-5 text-blue-500" />
                Continue with Twitter
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Admin Login */}
        {loginMethod === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
              <p className="text-muted-foreground text-sm">
                Access the admin dashboard with your credentials
              </p>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="admin@chaincron.com"
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
                    placeholder="Enter your password"
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
                <label className="block text-sm font-medium mb-2">MFA Code (Optional)</label>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter MFA code if enabled"
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Demo Credentials:</strong><br />
                Email: admin@chaincron.com<br />
                Password: admin123!
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
