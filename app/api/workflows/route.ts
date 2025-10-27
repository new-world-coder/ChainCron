import { NextRequest, NextResponse } from 'next/server';
import { validateWorkflow } from '@/lib/validators/workflowSchema';
import { pinToIPFS } from '@/lib/ipfs/pin';
import { db } from '@/lib/db';
import { requireCreator } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireCreator(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const body = await request.json();
    const { valid, errors } = validateWorkflow(body);
    
    if (!valid) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Check for pin query parameter
    const url = new URL(request.url);
    const shouldPin = url.searchParams.get('pin') === 'true';
    
    // Optional pin to IPFS
    let ipfsCid = null;
    if (shouldPin) {
      ipfsCid = await pinToIPFS(JSON.stringify(body));
    }

    // DB insert (mock for now)
    const client = await db.connect();
    try {
      // In a real implementation, you would use actual SQL queries here
      // For demo, we'll generate IDs and return them
      const workflowId = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const versionId = `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      
      return NextResponse.json({ 
        workflowId, 
        versionId, 
        ipfsCid, 
        previewUrl: `/workflows/${workflowId}` 
      }, { status: 201 });
    } catch (err) {
      console.error('DB error:', err);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
