import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' }) : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  
  try {
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');
    
    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    
    const body = await request.text();
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Create subscription row based on metadata
      const { userId, workflowId, planId } = session.metadata || {};
      
      if (userId && workflowId) {
        // Check if subscription already exists (idempotency)
        const existing = await db.query(
          'SELECT id FROM subscriptions WHERE workflow_id=$1 AND subscriber_id=$2 AND status=\'active\'',
          [workflowId, userId]
        );
        
        if (existing.rows.length === 0) {
          await db.query(
            `INSERT INTO subscriptions (workflow_id, subscriber_id, plan, status, started_at) 
             VALUES ($1,$2,$3,'active',NOW())`,
            [workflowId, userId, planId || 'default']
          );
        }
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

