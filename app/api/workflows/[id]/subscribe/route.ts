import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/middleware';
import { createStripeCheckout } from '@/lib/billing/stripeClient';
import { reserveCredits } from '@/lib/credits/ledger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { paymentMode, planId } = await request.json();
    const workflowId = params.id;
    
    if (paymentMode === 'stripe') {
      const session = await createStripeCheckout({ 
        userId: authResult.user.id, 
        workflowId, 
        planId 
      });
      return NextResponse.json({ checkoutUrl: session.url });
    }
    
    if (paymentMode === 'credits') {
      try {
        await reserveCredits(authResult.user.id, 10); // amount: 10 credits
        
        const r = await db.query(
          `INSERT INTO subscriptions (workflow_id, subscriber_id, plan, price_amount, price_currency, status, started_at) VALUES ($1,$2,$3,$4,$5,'active',NOW()) RETURNING id`,
          [workflowId, authResult.user.id, planId, 10, 'CREDITS']
        );
        
        return NextResponse.json({ subscriptionId: r.rows[0].id });
      } catch (err) {
        return NextResponse.json({ error: 'insufficient_credits' }, { status: 402 });
      }
    }
    
    if (paymentMode === 'onchain') {
      // Return on-chain instructions payload
      return NextResponse.json({ 
        status: 'pending', 
        instructions: { 
          contract: '0x..', 
          call: 'subscribe', 
          args: [workflowId, planId] 
        } 
      });
    }
    
    return NextResponse.json({ error: 'unsupported' }, { status: 400 });
  } catch (error) {
    console.error('Error subscribing to workflow:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

