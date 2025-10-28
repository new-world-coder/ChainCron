import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import TwitterProvider from 'next-auth/providers/twitter'
import { UserRole, User, DEFAULT_ADMIN, ADMIN_ADDRESSES } from './types'

// Mock user database - in production, use Firebase/Firestore
const mockUsers: User[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@chaincron.com',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    address: '0x1234567890123456789012345678901234567890',
    name: 'Creator User',
    role: 'creator',
    email: 'creator@chaincron.com',
    createdAt: new Date(),
    isActive: true,
    profile: {
      bio: 'DeFi automation expert',
      website: 'https://example.com',
    },
  },
  {
    id: '3',
    address: '0x9876543210987654321098765432109876543210',
    name: 'Subscriber User',
    role: 'subscriber',
    email: 'subscriber@chaincron.com',
    createdAt: new Date(),
    isActive: true,
  },
  // Add generic emails for testing
  {
    id: '4',
    email: 'creator@gmail.com',
    name: 'Test Creator',
    role: 'creator',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '5',
    email: 'subscriber@gmail.com',
    name: 'Test Subscriber',
    role: 'subscriber',
    createdAt: new Date(),
    isActive: true,
  },
]

// Helper function to find user by address or email
function findUser(identifier: string): User | null {
  return mockUsers.find(user => 
    user.address?.toLowerCase() === identifier.toLowerCase() ||
    user.email?.toLowerCase() === identifier.toLowerCase()
  ) || null
}

// Helper function to create user
function createUser(data: Partial<User>): User {
  const newUser: User = {
    id: Date.now().toString(),
    role: data.role || 'subscriber', // Default to subscriber role for new users
    createdAt: new Date(),
    isActive: true,
    ...data,
  }
  mockUsers.push(newUser)
  return newUser
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth - only add if credentials are properly configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' && 
        process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret'
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    
    // GitHub OAuth - only add if credentials are properly configured
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your-github-client-id' && 
        process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CLIENT_SECRET !== 'your-github-client-secret'
      ? [GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })]
      : []),
    
    // Twitter OAuth - only add if credentials are properly configured
    ...(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_ID !== 'your-twitter-client-id' && 
        process.env.TWITTER_CLIENT_SECRET && process.env.TWITTER_CLIENT_SECRET !== 'your-twitter-client-secret'
      ? [TwitterProvider({
          clientId: process.env.TWITTER_CLIENT_ID,
          clientSecret: process.env.TWITTER_CLIENT_SECRET,
          version: '2.0',
        })]
      : []),
    
    // Credentials provider for login (admin + signed up users)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mfaCode: { label: 'MFA Code', type: 'text', required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check for admin login
        if (credentials.email === DEFAULT_ADMIN.email && 
            credentials.password === DEFAULT_ADMIN.password) {
          const adminUser = findUser(credentials.email)
          if (adminUser) {
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
            }
          }
        }

        // Check for users who signed up via API (demo storage)
        try {
          // Import the demo users storage
          // For demo, we accept any email/password combination as long as it's not empty
          // In production, you would check against a database here
          if (credentials.email && credentials.password) {
            // Check if user exists
            const existingUser = findUser(credentials.email);
            if (existingUser) {
              return {
                id: existingUser.id,
                email: existingUser.email || credentials.email,
                name: existingUser.name || credentials.email,
                role: existingUser.role,
              }
            }
            
            // Create new user with creator role
            return {
              id: credentials.email,
              email: credentials.email,
              name: credentials.email,
              role: 'creator',
            }
          }
        } catch (e) {
          // Fall through to return null
        }

        return null
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.address = user.address
      }
      
      // Handle OAuth providers
      if (account?.provider === 'google' || 
          account?.provider === 'github' || 
          account?.provider === 'twitter') {
        // For OAuth users, we need to create or find their profile
        const existingUser = findUser(user?.email || '')
        if (existingUser) {
          token.role = existingUser.role
          token.address = existingUser.address
        } else {
          // Create new user with subscriber role by default
          const newUser = createUser({
            email: user?.email || undefined,
            name: user?.name || undefined,
            role: 'subscriber',
          })
          token.role = newUser.role
          token.address = newUser.address
        }
      }
      
      // For credentials provider, check if user exists
      if (account?.provider === 'credentials' && user?.email) {
        const existingUser = findUser(user.email);
        if (existingUser) {
          // Use existing user's role
          token.role = existingUser.role;
          token.address = existingUser.address;
        } else {
          // Create new user with subscriber role
          const newUser = createUser({
            email: user.email,
            name: user.name,
            role: 'subscriber',
          });
          token.role = newUser.role;
          token.address = newUser.address;
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.address = token.address || undefined
      }
      
      return session
    },
    
    async signIn({ user, account, profile }) {
      // Allow all sign-ins for now
      // In production, you might want to add additional checks
      return true
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
}

// Helper function to check if an address is an admin
export function isAdminAddress(address: string): boolean {
  return ADMIN_ADDRESSES.some(adminAddr => 
    adminAddr.toLowerCase() === address.toLowerCase()
  )
}

// Helper function to get user role from wallet address
export function getUserRoleFromAddress(address: string): UserRole {
  if (isAdminAddress(address)) {
    return 'admin'
  }
  
  const user = findUser(address)
  if (user) {
    return user.role
  }
  
  // For testing: allow user to choose role when first connecting wallet
  // In production, new wallet users would be subscribers by default
  const storedRole = localStorage.getItem(`user_role_${address.toLowerCase()}`)
  if (storedRole && ['creator', 'subscriber', 'admin'].includes(storedRole)) {
    return storedRole as UserRole
  }
  
  return 'subscriber'
}

// Helper function to set user role (for testing)
export function setUserRole(address: string, role: UserRole) {
  localStorage.setItem(`user_role_${address.toLowerCase()}`, role)
  // Also update in mockUsers for persistence
  const existing = mockUsers.find(u => u.address?.toLowerCase() === address.toLowerCase())
  if (existing) {
    existing.role = role
  } else {
    // Add new user
    mockUsers.push({
      id: Date.now().toString(),
      address,
      role,
      createdAt: new Date(),
      isActive: true,
    })
  }
}

// Helper function to check if user has permission for a role
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    admin: 3,
    creator: 2,
    subscriber: 1,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
