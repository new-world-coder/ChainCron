import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

// Get all subscriptions for the current user
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Get subscriptions for the user
    const result = await db.query(
      `SELECT s.*, w.title, w.description, w.owner_id 
       FROM subscriptions s 
       JOIN workflows w ON s.workflow_id = w.id 
       WHERE s.subscriber_id = $1 AND s.status = 'active' 
       ORDER BY s.created_at DESC`,
      [authResult.user.id]
    );
    
    return NextResponse.json({ subscriptions: result.rows });
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

