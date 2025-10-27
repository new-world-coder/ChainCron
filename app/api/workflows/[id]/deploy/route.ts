import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireCreator } from '@/lib/auth/middleware';
import { dispatchDeploy } from '@/lib/deploy/dispatch';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireCreator(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { id } = params;
    const body = await request.json();
    const { versionId, env } = body;
    
    // Create deployment record
    const insert = await db.query(
      `INSERT INTO deployments (workflow_version_id, env, status, requested_by, created_at) VALUES ($1,$2,'pending',$3,NOW()) RETURNING id`,
      [versionId, env, authResult.user.id]
    );
    const deploymentId = insert.rows[0].id;
    
    // Dispatch to GitHub Actions if testnet
    if (env === 'testnet') {
      await dispatchDeploy({ workflowId: id, versionId, deploymentId });
    }
    
    return NextResponse.json({ deploymentId, status: 'pending' }, { status: 202 });
  } catch (error) {
    console.error('Error deploying workflow:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

