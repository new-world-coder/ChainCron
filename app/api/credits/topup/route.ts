import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { createStripeCheckout } from '@/lib/billing/stripeClient';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { amount } = await request.json();
    
    // Create Stripe checkout session for credits
    const session = await createStripeCheckout({ 
      userId: authResult.user.id, 
      workflowId: '', 
      planId: '', 
      amount,
      purpose: 'credits' 
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating top-up session:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

