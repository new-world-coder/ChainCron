import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' }) : null;

export async function createStripeCheckout({ 
  userId, 
  workflowId, 
  planId,
  amount,
  purpose
}: { 
  userId: string; 
  workflowId: string; 
  planId: string;
  amount?: number;
  purpose?: string;
}) {
  if (!stripe) {
    throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  
  const metadata: Record<string, string> = { userId, workflowId, planId };
  if (amount) metadata.amount = amount.toString();
  if (purpose) metadata.purpose = purpose;
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscriptions/cancel`,
    metadata,
    line_items: [{ price: process.env.STRIPE_PRICE_ID || '', quantity: 1 }]
  });
  
  return session;
}

