// API client for subscription management

export interface Subscription {
  id: string;
  workflow_id: string;
  title: string;
  description?: string;
  plan: string;
  price_amount: number;
  price_currency: string;
  status: string;
  started_at: string;
}

export interface UsageStats {
  title: string;
  invocations: number;
  workflows_used: number;
  total_cost: number;
  first_use: string;
  last_use: string;
}

// Get my subscriptions
export async function getMySubscriptions(): Promise<Subscription[]> {
  const response = await fetch('/api/subscriptions');
  
  if (!response.ok) {
    throw new Error('Failed to get subscriptions');
  }
  
  const data = await response.json();
  return data.subscriptions;
}

// Get usage stats
export async function getUsageStats(workflowId?: string): Promise<UsageStats[]> {
  const url = workflowId ? `/api/usage?workflow_id=${workflowId}` : '/api/usage';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to get usage stats');
  }
  
  const data = await response.json();
  return data.usage;
}

// Get my created workflows
export async function getMyWorkflows(): Promise<any[]> {
  const response = await fetch('/api/my-workflows');
  
  if (!response.ok) {
    throw new Error('Failed to get workflows');
  }
  
  const data = await response.json();
  return data.workflows;
}

