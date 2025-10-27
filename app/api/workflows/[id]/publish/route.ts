import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireCreator } from '@/lib/auth/middleware';

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
    const { priceAmount, priceCurrency, visibility } = body;
    
    // Update workflow visibility/pricing
    await db.query(
      `UPDATE workflows SET visibility=$1, updated_at=NOW() WHERE id=$2 AND owner_id=$3`,
      [visibility || 'marketplace', id, authResult.user.id]
    );
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error publishing workflow:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

