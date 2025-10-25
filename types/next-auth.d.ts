import NextAuth from 'next-auth'
import { UserRole } from '@/lib/auth/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: UserRole
      address?: string
    }
  }

  interface User {
    role?: UserRole
    address?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
    address?: string
  }
}
