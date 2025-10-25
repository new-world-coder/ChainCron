# Automation API Deployment Guide

## Overview

This guide covers deploying and configuring the Automation API endpoints in production.

## Prerequisites

- Node.js 18+ installed
- Next.js application running
- Environment variable access
- API client (for testing)

## Environment Configuration

### Required Environment Variables

Create or update your `.env` file (or environment configuration):

```bash
# Automation API Configuration
AUTOMATION_API_KEY=your-secure-random-api-key-here

# Example (DO NOT USE IN PRODUCTION):
# AUTOMATION_API_KEY=prod-key-abc123xyz789
```

### Generating a Secure API Key

Use one of these methods to generate a secure API key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Setting Environment Variables

**Vercel:**
```bash
vercel env add AUTOMATION_API_KEY production
```

**Docker:**
```bash
docker run -e AUTOMATION_API_KEY=your-key
```

**Kubernetes:**
```yaml
env:
  - name: AUTOMATION_API_KEY
    valueFrom:
      secretKeyRef:
        name: api-secrets
        key: automation-api-key
```

## Deployment Steps

### 1. Pre-Deployment Checklist

- [ ] API key generated and stored securely
- [ ] Environment variables configured
- [ ] Code tested locally
- [ ] All tests passing
- [ ] Documentation reviewed

### 2. Deploy to Production

**Vercel:**
```bash
vercel --prod
```

**Docker:**
```bash
docker build -t chaincron-automation .
docker run -p 3000:3000 -e AUTOMATION_API_KEY=your-key chaincron-automation
```

**Kubernetes:**
```bash
kubectl apply -f k8s/
```

### 3. Verify Deployment

Test the deployment:

```bash
# Test status endpoint
curl https://your-domain.com/api/automation

# Test workflows endpoint
curl https://your-domain.com/api/automation/workflows

# Test with authentication
curl -H "x-api-key: your-key" https://your-domain.com/api/automation/workflows
```

## API Usage

### Authentication

Include the API key in requests:

**Option 1: x-api-key header**
```bash
curl -H "x-api-key: your-api-key" \
  https://your-domain.com/api/automation
```

**Option 2: Bearer token**
```bash
curl -H "Authorization: Bearer your-api-key" \
  https://your-domain.com/api/automation
```

### Registering a Workflow

```bash
curl -X POST https://your-domain.com/api/automation \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "id": 1,
    "name": "My Workflow",
    "type": "compound",
    "schedule": "0 * * * *",
    "config": {
      "enabled": true
    }
  }'
```

### Viewing Logs

```bash
# View recent logs
curl https://your-domain.com/api/automation/logs

# View statistics
curl https://your-domain.com/api/automation/logs?stats=true

# View specific number of logs
curl https://your-domain.com/api/automation/logs?limit=50
```

## Monitoring

### Key Metrics to Monitor

1. **API Request Count**
   - Total requests per endpoint
   - Requests per hour/day

2. **Error Rate**
   - 4xx errors (client errors)
   - 5xx errors (server errors)
   - Error rate percentage

3. **Response Time**
   - Average response time
   - P95/P99 response times

4. **Rate Limiting**
   - Number of 429 responses
   - Most rate-limited clients

5. **Authentication Failures**
   - Failed authentication attempts
   - Invalid API keys

### Monitoring Endpoints

```bash
# Get health metrics
curl https://your-domain.com/api/automation

# Get API logs and stats
curl https://your-domain.com/api/automation/logs?stats=true

# Get workflow analytics
curl https://your-domain.com/api/automation/analytics
```

## Rate Limiting

Default limits:
- **100 requests per minute** per client (IP or API key)

Adjustable via code in `lib/api/rateLimit.ts`:

```typescript
export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000  // 1 minute
)
```

### Handling Rate Limits

When rate limited, you'll receive:

```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 42
}
```

With headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until retry

## Security Best Practices

### 1. API Key Management

- ✅ Use strong, random API keys
- ✅ Rotate keys regularly (every 90 days)
- ✅ Store keys securely (never in code)
- ✅ Use different keys for dev/staging/prod
- ✅ Revoke compromised keys immediately

### 2. Rate Limiting

- ✅ Monitor rate limit hits
- ✅ Adjust limits based on usage patterns
- ✅ Implement exponential backoff in clients

### 3. Logging

- ✅ Monitor logs for suspicious activity
- ✅ Set up alerts for authentication failures
- ✅ Log all write operations
- ✅ Implement log retention policies

### 4. Network Security

- ✅ Use HTTPS only
- ✅ Implement IP whitelisting (if needed)
- ✅ Use a WAF (Web Application Firewall)
- ✅ Monitor for DDoS attacks

## Troubleshooting

### Common Issues

**1. Authentication Failing**

```
Error: Unauthorized: Invalid or missing API key
```

**Solution:**
- Verify API key is correct
- Check environment variable is set
- Ensure header name is correct (`x-api-key` or `Authorization`)

**2. Rate Limiting**

```
Error: Too many requests. Please try again later.
```

**Solution:**
- Wait for rate limit to reset
- Implement exponential backoff
- Consider increasing rate limit if appropriate

**3. Missing Environment Variables**

```
Error: AUTOMATION_API_KEY is not set
```

**Solution:**
- Set environment variable in deployment platform
- Restart application after setting variable
- Verify variable name is correct

**4. Endpoint Not Found**

```
Error: 404 Not Found
```

**Solution:**
- Verify endpoint URL is correct
- Check deployment completed successfully
- Ensure route files are deployed

## Production Checklist

- [ ] Environment variables configured
- [ ] Secure API key generated
- [ ] Rate limits configured appropriately
- [ ] Monitoring set up
- [ ] Logging configured
- [ ] Error alerts configured
- [ ] Documentation shared with team
- [ ] API keys distributed securely
- [ ] Backup/rollback plan in place
- [ ] Load testing completed
- [ ] Security review completed

## Support

For issues or questions:
- Check logs: `/api/automation/logs`
- Review API documentation: `docs/AUTOMATION_API_ENDPOINTS.md`
- Contact team or open an issue
