import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

// Get usage stats for current user
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const url = new URL(request.url);
    const workflowId = url.searchParams.get('workflow_id');
    
    let query = `
      SELECT 
        w.title,
        COUNT(DISTINCT ue.invocation_id) as invocations,
        COUNT(DISTINCT ue.workflow_id) as workflows_used,
        SUM(ue.cost) as total_cost,
        MIN(ue.created_at) as first_use,
        MAX(ue.created_at) as last_use
      FROM usage_events ue
      JOIN workflows w ON ue.workflow_id = w.id
      WHERE ue.subscriber_id = $1
    `;
    
    const params = [authResult.user.id];
    
    if (workflowId) {
      query += ' AND ue.workflow_id = $2';
      params.push(workflowId);
    }
    
    query += ' GROUP BY w.title';
    
    const result = await db.query(query, params);
    
    return NextResponse.json({ usage: result.rows });
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

