import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { db } from '@/lib/db';
import { pushToQueue } from '@/lib/queue/redisQueue';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const body = await request.json();
    const { workflowId, invocationId, params } = body;
    
    const id = invocationId || `inv-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    
    // Check subscription
    const sub = await db.query(
      'SELECT id FROM subscriptions WHERE workflow_id=$1 AND subscriber_id=$2 AND status=\'active\'',
      [workflowId, authResult.user.id]
    );
    
    if (sub.rows.length === 0) {
      return NextResponse.json({ error: 'subscription_required' }, { status: 403 });
    }
    
    // Create or update invocation record (idempotency)
    await db.query(
      `INSERT INTO invocations (id, workflow_id, caller_id, status, created_at) 
       VALUES ($1,$2,$3,'queued',NOW()) 
       ON CONFLICT (id) DO NOTHING`,
      [id, workflowId, authResult.user.id]
    );
    
    // Reserve billing credits (omitted for brevity in demo)
    
    // Push to queue
    await pushToQueue({ invocationId: id, workflowId, params });
    
    return NextResponse.json({ 
      invocationId: id, 
      status: 'queued', 
      trackUrl: `/invocations/${id}` 
    }, { status: 202 });
  } catch (error) {
    console.error('Error invoking workflow:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

