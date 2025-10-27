import { NextResponse } from 'next/server'

// In-memory storage for demo (in production, use a database)
const demoUsers: Record<string, any> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, role, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Store user in memory
    demoUsers[email] = {
      email,
      name,
      role: role || 'subscriber',
      password, // In production, hash this!
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, user: demoUsers[email] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const password = searchParams.get('password')

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Check if user exists
  const user = demoUsers[email]
  
  if (!user) {
    return NextResponse.json({ user: null })
  }

  // In production, verify password hash
  if (password && user.password !== password) {
    return NextResponse.json({ user: null })
  }

  // Don't return password
  const { password: _, ...userWithoutPassword } = user
  
  return NextResponse.json({ user: userWithoutPassword })
}

