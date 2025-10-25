# Automation API Endpoints

This document describes the complete automation API endpoint structure for ChainCron.

## Base URL
All endpoints are under `/api/automation`

## Endpoints

### 1. Get Service Status
**GET** `/api/automation`

Returns the current status and health metrics of the automation service.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": {
      "isRunning": true,
      "totalWorkflows": 5,
      "queueStatus": {...},
      "uptime": 3600000
    },
    "health": {
      "status": "healthy",
      "metrics": {
        "totalExecutions": 100,
        "successRate": 98.5,
        "avgExecutionTime": 2500,
        "errorRate": 1.5,
        "gasEfficiency": 85
      }
    }
  }
}
```

### 2. Register Workflow
**POST** `/api/automation`

Registers a new workflow for automation.

**Request Body:**
```json
{
  "id": 1,
  "name": "My Workflow",
  "type": "compound",
  "schedule": "0 * * * *",
  "config": {...}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow registered successfully",
  "data": { "workflowId": 1 }
}
```

### 3. List All Workflows
**GET** `/api/automation/workflows`

Returns a list of all registered workflows.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "My Workflow",
      "type": "compound",
      "schedule": "0 * * * *",
      "config": {...}
    }
  ]
}
```

### 4. Update Workflow
**PUT** `/api/automation/[id]`

Updates an existing workflow configuration.

**URL Parameters:**
- `id` - The workflow ID

**Request Body:**
```json
{
  "name": "Updated Workflow Name",
  "schedule": "*/15 * * * *"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow updated successfully"
}
```

### 5. Delete Workflow
**DELETE** `/api/automation/[id]`

Unregisters and deletes a workflow.

**URL Parameters:**
- `id` - The workflow ID

**Response:**
```json
{
  "success": true,
  "message": "Workflow unregistered successfully"
}
```

### 6. Execute Workflow Now
**POST** `/api/automation/[id]/execute`

Manually triggers immediate execution of a workflow.

**URL Parameters:**
- `id` - The workflow ID

**Response:**
```json
{
  "success": true,
  "message": "Workflow executed successfully",
  "data": {
    "workflowId": 1,
    "status": "success",
    "timestamp": 1234567890,
    "gasUsed": 150000,
    "earnings": 0.05
  }
}
```

### 7. Get Execution History
**GET** `/api/automation/history`

Returns the execution history for workflows.

**Query Parameters:**
- `workflowId` (optional) - Filter by specific workflow ID
- `limit` (optional) - Maximum number of results (default: 100)

**Example:** `/api/automation/history?workflowId=1&limit=50`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "workflowId": 1,
      "status": "success",
      "timestamp": 1234567890,
      "gasUsed": 150000,
      "earnings": 0.05
    }
  ]
}
```

### 8. Get Workflow Statistics
**GET** `/api/automation/stats`

Returns statistics for a specific workflow.

**Query Parameters:**
- `workflowId` (required) - The workflow ID

**Example:** `/api/automation/stats?workflowId=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "workflowId": 1,
    "totalExecutions": 100,
    "successfulExecutions": 98,
    "failedExecutions": 2,
    "successRate": 98,
    "avgGasUsed": 150000,
    "totalEarnings": 4.50
  }
}
```

### 9. Get Performance Analytics
**GET** `/api/automation/analytics`

Returns overall performance analytics for the automation service.

**Query Parameters:**
- `timeRange` (optional) - Time range: `1h`, `24h`, `7d`, `30d` (default: `24h`)

**Example:** `/api/automation/analytics?timeRange=7d`

**Response:**
```json
{
  "success": true,
  "data": {
    "executions": 500,
    "successRate": 98.5,
    "avgGasUsed": 150000,
    "totalEarnings": 22.50,
    "topWorkflows": [
      {
        "id": 1,
        "name": "High Yield Compound",
        "executions": 100,
        "earnings": 10.00
      }
    ]
  }
}
```

### 10. Pause All Workflows
**POST** `/api/automation/pause`

Pauses all active workflows.

**Response:**
```json
{
  "success": true,
  "message": "All workflows paused"
}
```

### 11. Resume All Workflows
**POST** `/api/automation/resume`

Resumes all paused workflows.

**Response:**
```json
{
  "success": true,
  "message": "All workflows resumed"
}
```

### 12. Emergency Stop
**POST** `/api/automation/emergency-stop`

Immediately stops all workflow executions (emergency shutdown).

**Response:**
```json
{
  "success": true,
  "message": "Emergency stop executed"
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error

## Implementation Details

### Service Instance
All endpoints use a shared singleton instance of `AutomationService` located at `lib/automation/serviceInstance.ts`. This ensures consistent state across all endpoints.

### Architecture
The API follows Next.js App Router conventions:
- Each route is in its own `route.ts` file
- Dynamic routes use `[param]` syntax
- HTTP methods are exported as named functions (`GET`, `POST`, `PUT`, `DELETE`)

### File Structure
```
app/api/automation/
├── route.ts                          # GET status, POST register
├── workflows/route.ts                # GET workflows list
├── history/route.ts                  # GET execution history
├── stats/route.ts                    # GET workflow stats
├── analytics/route.ts                # GET performance analytics
├── pause/route.ts                    # POST pause all
├── resume/route.ts                   # POST resume all
├── emergency-stop/route.ts           # POST emergency stop
└── [id]/
    ├── route.ts                      # PUT update, DELETE workflow
    └── execute/route.ts              # POST execute workflow
```
