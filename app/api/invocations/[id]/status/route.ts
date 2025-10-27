import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { id } = params;
    
    // Get invocation status
    const result = await db.query(
      'SELECT status, error_msg, created_at, completed_at FROM invocations WHERE id=$1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    
    const invocation = result.rows[0];
    
    return NextResponse.json({
      id,
      status: invocation.status || 'queued',
      error: invocation.error_msg,
      createdAt: invocation.created_at,
      completedAt: invocation.completed_at
    });
  } catch (error) {
    console.error('Error getting invocation status:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

