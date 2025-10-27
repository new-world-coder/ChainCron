import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/middleware';
import { cacheGet, cacheSet } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const userId = params.id;
    
    // Ensure requester is the same creator or admin
    if (authResult.user.id !== userId && authResult.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const workflowId = url.searchParams.get('workflow_id');
    
    const cacheKey = `metrics:${userId}:${startDate}:${endDate}:${workflowId}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return NextResponse.json(cached);
    }
    
    // Query metrics (mock for now)
    const rows = await db.query(
      'SELECT day, invocations, revenue FROM daily_invocations_by_workflow WHERE workflow_id = $1 AND day BETWEEN $2 AND $3 ORDER BY day',
      [workflowId, startDate, endDate]
    );
    
    await cacheSet(cacheKey, rows.rows, 60);
    
    return NextResponse.json({ rows: rows.rows });
  } catch (error) {
    console.error('Error getting creator metrics:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

