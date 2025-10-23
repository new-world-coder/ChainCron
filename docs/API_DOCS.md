# ChainCron API Documentation

## Overview

ChainCron provides a comprehensive REST API for managing workflows, subscriptions, and automation services. The API is built on Next.js API routes and provides both programmatic access and webhook integration.

## Base URL

```
Development: http://localhost:3000/api
Production: https://chaincron.vercel.app/api
```

## Authentication

All API endpoints require authentication via API key or wallet signature.

### API Key Authentication
```http
Authorization: Bearer YOUR_API_KEY
```

### Wallet Signature Authentication
```http
Authorization: Signature YOUR_WALLET_SIGNATURE
```

## Endpoints

### Workflow Management

#### GET /workflows
Retrieve all available workflows.

**Query Parameters:**
- `category` (optional): Filter by workflow category
- `creator` (optional): Filter by creator address
- `status` (optional): Filter by workflow status
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "workflows": [
    {
      "id": 1,
      "name": "Auto-Compound DeFi",
      "description": "Automatically compound DeFi yields",
      "creator": "0x1234...",
      "category": "DeFi",
      "price": "1000000000000000000",
      "subscribers": 45,
      "apy": 12.5,
      "riskLevel": "Medium",
      "status": "Active"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

#### GET /workflows/{id}
Retrieve a specific workflow by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Auto-Compound DeFi",
  "description": "Automatically compound DeFi yields",
  "creator": "0x1234...",
  "category": "DeFi",
  "price": "1000000000000000000",
  "subscribers": 45,
  "apy": 12.5,
  "riskLevel": "Medium",
  "status": "Active",
  "configuration": {
    "compoundInterval": 24,
    "minCompoundAmount": "10",
    "yieldToken": "USDC",
    "yieldFarm": "Aave"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### POST /workflows
Create a new workflow.

**Request Body:**
```json
{
  "name": "My Custom Workflow",
  "description": "Custom automation workflow",
  "category": "DeFi",
  "price": "1000000000000000000",
  "configuration": {
    "compoundInterval": 24,
    "minCompoundAmount": "10"
  }
}
```

**Response:**
```json
{
  "id": 2,
  "name": "My Custom Workflow",
  "status": "Pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Subscription Management

#### POST /subscriptions
Subscribe to a workflow.

**Request Body:**
```json
{
  "workflowId": 1,
  "duration": 30
}
```

**Response:**
```json
{
  "subscriptionId": "sub_123",
  "workflowId": 1,
  "status": "Active",
  "expiresAt": "2024-02-01T00:00:00Z",
  "nextPayment": "2024-01-15T00:00:00Z"
}
```

#### GET /subscriptions
Retrieve user's subscriptions.

**Query Parameters:**
- `status` (optional): Filter by subscription status
- `workflowId` (optional): Filter by workflow ID

**Response:**
```json
{
  "subscriptions": [
    {
      "subscriptionId": "sub_123",
      "workflowId": 1,
      "workflowName": "Auto-Compound DeFi",
      "status": "Active",
      "expiresAt": "2024-02-01T00:00:00Z",
      "nextPayment": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### DELETE /subscriptions/{id}
Cancel a subscription.

**Response:**
```json
{
  "subscriptionId": "sub_123",
  "status": "Cancelled",
  "cancelledAt": "2024-01-01T00:00:00Z"
}
```

### Automation Control

#### POST /automation/execute
Execute a workflow manually.

**Request Body:**
```json
{
  "workflowId": 1,
  "parameters": {
    "amount": "100",
    "token": "USDC"
  }
}
```

**Response:**
```json
{
  "executionId": "exec_123",
  "workflowId": 1,
  "status": "Running",
  "startedAt": "2024-01-01T00:00:00Z"
}
```

#### GET /automation/status/{executionId}
Get execution status.

**Response:**
```json
{
  "executionId": "exec_123",
  "workflowId": 1,
  "status": "Completed",
  "startedAt": "2024-01-01T00:00:00Z",
  "completedAt": "2024-01-01T00:05:00Z",
  "result": {
    "success": true,
    "amountCompounded": "100",
    "gasUsed": "50000",
    "transactionHash": "0x1234..."
  }
}
```

#### GET /automation/history
Get execution history.

**Query Parameters:**
- `workflowId` (optional): Filter by workflow ID
- `status` (optional): Filter by execution status
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "executions": [
    {
      "executionId": "exec_123",
      "workflowId": 1,
      "workflowName": "Auto-Compound DeFi",
      "status": "Completed",
      "startedAt": "2024-01-01T00:00:00Z",
      "completedAt": "2024-01-01T00:05:00Z",
      "gasUsed": "50000",
      "transactionHash": "0x1234..."
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### Analytics

#### GET /analytics/performance
Get performance analytics.

**Query Parameters:**
- `workflowId` (optional): Filter by workflow ID
- `period` (optional): Time period (7d, 30d, 90d, 1y)
- `metric` (optional): Specific metric (roi, executions, gas)

**Response:**
```json
{
  "period": "30d",
  "metrics": {
    "totalExecutions": 150,
    "successRate": 98.5,
    "averageGasUsed": 45000,
    "totalGasSaved": 2250000,
    "roi": 12.5
  },
  "chartData": [
    {
      "date": "2024-01-01",
      "executions": 5,
      "gasUsed": 45000,
      "roi": 12.3
    }
  ]
}
```

#### GET /analytics/workflow/{id}
Get specific workflow analytics.

**Response:**
```json
{
  "workflowId": 1,
  "name": "Auto-Compound DeFi",
  "metrics": {
    "totalExecutions": 150,
    "successRate": 98.5,
    "averageGasUsed": 45000,
    "totalSubscribers": 45,
    "totalRevenue": "45000000000000000000"
  },
  "performance": {
    "roi": 12.5,
    "gasEfficiency": 95.2,
    "reliability": 98.5
  }
}
```

### Webhooks

#### POST /webhooks/register
Register a webhook endpoint.

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["workflow.executed", "subscription.created"],
  "secret": "your-webhook-secret"
}
```

**Response:**
```json
{
  "webhookId": "webhook_123",
  "url": "https://your-app.com/webhook",
  "events": ["workflow.executed", "subscription.created"],
  "status": "Active",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Webhook Events

**workflow.executed**
```json
{
  "event": "workflow.executed",
  "data": {
    "executionId": "exec_123",
    "workflowId": 1,
    "status": "Completed",
    "result": {
      "success": true,
      "gasUsed": "50000",
      "transactionHash": "0x1234..."
    },
    "timestamp": "2024-01-01T00:05:00Z"
  }
}
```

**subscription.created**
```json
{
  "event": "subscription.created",
  "data": {
    "subscriptionId": "sub_123",
    "workflowId": 1,
    "userId": "0x1234...",
    "status": "Active",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "workflowId",
      "reason": "Workflow not found"
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Invalid request parameters |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @chaincron/sdk
```

```typescript
import { ChainCronAPI } from '@chaincron/sdk';

const api = new ChainCronAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.chaincron.com'
});

// Get workflows
const workflows = await api.workflows.list();

// Subscribe to workflow
const subscription = await api.subscriptions.create({
  workflowId: 1,
  duration: 30
});
```

### Python
```bash
pip install chaincron-sdk
```

```python
from chaincron import ChainCronAPI

api = ChainCronAPI(api_key='your-api-key')

# Get workflows
workflows = api.workflows.list()

# Subscribe to workflow
subscription = api.subscriptions.create(
    workflow_id=1,
    duration=30
)
```

## Testing

### Test Environment
```
Base URL: https://test-api.chaincron.com
```

### Test Data
- Test workflows are available with ID prefix `test_`
- Test transactions use testnet tokens
- No real payments are processed

## Support

- **Documentation**: https://docs.chaincron.com
- **Support**: support@chaincron.com
- **Discord**: https://discord.gg/chaincron
- **GitHub**: https://github.com/chaincron/api
