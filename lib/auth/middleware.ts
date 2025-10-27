import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';

// Require authentication middleware
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return { user: session.user, session };
}

// Require creator role middleware
export async function requireCreator(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = session.user.role;
  if (role !== 'creator' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Creator access required' }, { status: 403 });
  }
  
  return { user: session.user, session };
}

