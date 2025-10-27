// API client for workflow management

export interface Workflow {
  id: string;
  owner_id: string;
  slug?: string;
  title: string;
  description?: string;
  visibility: 'private' | 'public' | 'marketplace';
  current_version: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowVersion {
  id: string;
  workflow_id: string;
  version: number;
  workflow_json: any;
  ipfs_cid?: string;
  deployed_testnet: boolean;
  deployed_mainnet: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  workflow_id: string;
  subscriber_id: string;
  plan: string;
  price_amount: number;
  price_currency: string;
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface Invocation {
  id: string;
  workflow_id: string;
  caller_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  error_msg?: string;
  created_at: string;
  completed_at?: string;
}

// Create workflow
export async function createWorkflow(data: {
  version: number;
  meta: { title: string; slug?: string; description?: string };
  trigger: any;
  steps: any[];
}, pinToIPFS: boolean = false): Promise<{ workflowId: string; versionId: string; ipfsCid?: string; previewUrl: string }> {
  const url = `/api/workflows${pinToIPFS ? '?pin=true' : ''}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create workflow');
  }
  
  return response.json();
}

// Publish workflow
export async function publishWorkflow(workflowId: string, data: {
  priceAmount?: number;
  priceCurrency?: string;
  visibility: 'private' | 'public' | 'marketplace';
}): Promise<void> {
  const response = await fetch(`/api/workflows/${workflowId}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to publish workflow');
  }
}

// Deploy workflow
export async function deployWorkflow(workflowId: string, data: {
  versionId: string;
  env: 'testnet' | 'mainnet';
}): Promise<{ deploymentId: string; status: string }> {
  const response = await fetch(`/api/workflows/${workflowId}/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to deploy workflow');
  }
  
  return response.json();
}

// Subscribe to workflow
export async function subscribeToWorkflow(workflowId: string, data: {
  paymentMode: 'stripe' | 'credits' | 'onchain';
  planId: string;
}): Promise<{ checkoutUrl?: string; subscriptionId?: string; status?: string; instructions?: any }> {
  const response = await fetch(`/api/workflows/${workflowId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to subscribe');
  }
  
  return response.json();
}

// Invoke workflow
export async function invokeWorkflow(data: {
  workflowId: string;
  invocationId?: string;
  params?: any;
}): Promise<{ invocationId: string; status: string; trackUrl: string }> {
  const response = await fetch('/api/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to invoke workflow');
  }
  
  return response.json();
}

// Get invocation status
export async function getInvocationStatus(invocationId: string): Promise<Invocation> {
  const response = await fetch(`/api/invocations/${invocationId}/status`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get invocation status');
  }
  
  return response.json();
}

// Get creator metrics
export async function getCreatorMetrics(creatorId: string, params?: {
  start_date?: string;
  end_date?: string;
  workflow_id?: string;
}): Promise<{ rows: any[] }> {
  const queryParams = new URLSearchParams();
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  if (params?.workflow_id) queryParams.append('workflow_id', params.workflow_id);
  
  const response = await fetch(`/api/creators/${creatorId}/metrics?${queryParams.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get metrics');
  }
  
  return response.json();
}

// Top up credits
export async function topUpCredits(amount: number): Promise<{ url: string }> {
  const response = await fetch('/api/credits/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to top up credits');
  }
  
  return response.json();
}

