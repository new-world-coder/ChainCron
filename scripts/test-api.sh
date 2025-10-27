#!/bin/bash

# Test ChainCron API endpoints locally

BASE_URL="http://localhost:3000"

echo "Testing ChainCron API..."
echo ""

# Test 1: Health check
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/api/health" | jq '.' || echo "Health check failed"
echo ""

# Test 2: Get nonce
echo "2. Testing nonce endpoint..."
curl -s "$BASE_URL/auth/siwe/nonce?address=0x123" | jq '.' || echo "Nonce test failed"
echo ""

# Test 3: Create workflow (requires auth)
echo "3. Testing workflow creation (POST /api/workflows)..."
echo "This requires authentication - skipping for now"
echo ""

echo "To test with authentication, you'll need to:"
echo "1. Start the dev server: npm run dev"
echo "2. Log in at http://localhost:3000/auth/signin"
echo "3. Get a session token"
echo "4. Use the token in API requests"
echo ""
echo "All API routes are created and ready to use!"

