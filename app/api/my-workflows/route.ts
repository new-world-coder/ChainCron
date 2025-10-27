import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireCreator } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

// Get all workflows created by the current creator
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireCreator(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Get workflows with their latest stats
    const result = await db.query(
      `SELECT 
        w.id,
        w.title,
        w.description,
        w.visibility,
        w.created_at,
        w.updated_at,
        COUNT(DISTINCT s.id) as subscriber_count,
        SUM(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END) as active_subscribers,
        COALESCE(SUM(s.price_amount), 0) as total_revenue
      FROM workflows w
      LEFT JOIN subscriptions s ON w.id = s.workflow_id
      WHERE w.owner_id = $1
      GROUP BY w.id
      ORDER BY w.created_at DESC`,
      [authResult.user.id]
    );
    
    return NextResponse.json({ workflows: result.rows });
  } catch (error) {
    console.error('Error getting my workflows:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

