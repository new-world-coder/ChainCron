# ChainCron Architecture — Full Cursor Prompts, OpenAPI, and Deployment Strategy

Great — below you’ll find (A) ready-to-paste Cursor prompt payloads (detailed tasks + file templates) for each implementation item from the architecture (A → F), (B) a full OpenAPI 3.0 spec covering the endpoints we discussed plus instructions to run a mock server locally, and (C) an assessment of whether the generated artifacts can be deployed to Vercel (and where to deploy each component), plus a recommended tech stack and mapping of deployment assets to hosting targets.

Everything is self-contained — copy/paste the Cursor prompt blocks into Cursor or your task runner and the OpenAPI YAML into openapi.yaml for running mocks (Prism / Stoplight / mock-server). I also included sample CI/deploy notes.

A — Cursor prompt payloads (ready to paste)

Each prompt below is labelled and includes the files to create or modify. Paste each full block into Cursor (or your task manager) as a single task. They assume a Next.js repo (TypeScript), Postgres (Supabase), Redis or Pub/Sub, and Node workers. Adjust repo paths as needed.

Cursor Prompt A — Create Workflow API & DB
Task: Implement POST /api/workflows to create a workflow and persist versioned workflow metadata.

Create files:
1) file: src/pages/api/workflows/index.ts
2) file: prisma/migrations/20251027_create_workflows.sql
3) file: src/lib/validators/workflowSchema.ts
4) file: src/lib/ipfs/pin.ts (simple IPFS pin helper - use Pinata or Infura env vars)
5) tests/api/workflows.test.ts (jest)

Requirements:
- Validate request body against canonical JSON Schema (workflowSchema.ts).
- Insert a row into `workflows` and `workflow_versions`. Use Postgres simple queries (or Prisma schema if existing).
- Optional pin to IPFS when request contains query param `?pin=true`. Use env PINATA_KEY/PINATA_SECRET or INFURA creds.
- Return HTTP 201 with structure: { workflowId, versionId, ipfsCid?, previewUrl }
- Ensure only authenticated creators can create; if unauthenticated return 403.

File templates:

--- src/pages/api/workflows/index.ts ---
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateWorkflow } from '@/lib/validators/workflowSchema'
import { pinToIPFS } from '@/lib/ipfs/pin'
import { db } from '@/lib/db' // assume Postgres helper wrapper
import { requireCreator } from '@/lib/auth/middleware'

export default requireCreator(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const body = req.body
  const { valid, errors } = validateWorkflow(body)
  if (!valid) return res.status(400).json({ errors })

  // optional pin
  let ipfsCid = null
  if (req.query.pin === 'true') {
    ipfsCid = await pinToIPFS(JSON.stringify(body))
  }

  // DB insert
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const wfRes = await client.query(
      `INSERT INTO workflows (owner_id, slug, title, description, visibility, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING id`, [req.user.id, body.meta.slug || null, body.meta.title, body.meta.description, 'private']
    )
    const workflowId = wfRes.rows[0].id
    const verRes = await client.query(
      `INSERT INTO workflow_versions (workflow_id, version, workflow_json, ipfs_cid, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`, [workflowId, 1, body, ipfsCid]
    )
    const versionId = verRes.rows[0].id
    await client.query('COMMIT')
    return res.status(201).json({ workflowId, versionId, ipfsCid, previewUrl: `/workflows/${workflowId}` })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    return res.status(500).json({ error: 'db_error' })
  } finally {
    client.release()
  }
})
--- end ---

--- prisma/migrations/20251027_create_workflows.sql ---
-- create tables if not exist; adjust to your DB style
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  slug text,
  title text,
  description text,
  visibility text DEFAULT 'private',
  current_version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  version integer NOT NULL,
  workflow_json jsonb NOT NULL,
  ipfs_cid text,
  deployed_testnet boolean DEFAULT false,
  deployed_mainnet boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
--- end ---

--- src/lib/validators/workflowSchema.ts ---
import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });
const workflowSchema = {
  type: 'object',
  required: ['version','meta','trigger','steps'],
  properties: {
    version: { type: 'number' },
    meta: { type: 'object', properties: { title: { type: 'string' }, slug: { type: 'string' }, description: { type: 'string' } } },
    trigger: { type: 'object' },
    steps: { type: 'array' }
  },
  additionalProperties: true
}
const validate = ajv.compile(workflowSchema)
export function validateWorkflow(data: any) {
  const valid = validate(data)
  return { valid: !!valid, errors: validate.errors }
}
--- end ---

--- src/lib/ipfs/pin.ts ---
export async function pinToIPFS(content: string) {
  const PINATA_KEY = process.env.PINATA_KEY
  const PINATA_SECRET = process.env.PINATA_SECRET
  if (!PINATA_KEY || !PINATA_SECRET) return null
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'pinata_api_key': PINATA_KEY, 'pinata_secret_api_key': PINATA_SECRET },
    body: content
  })
  const json = await res.json()
  return json.IpfsHash
}
--- end ---

Notes:
- Update `db` and `requireCreator` imports to match your auth/db helpers.
- Add unit tests in tests/api/workflows.test.ts to validate successful create & schema failure.

Cursor Prompt B — Publish & Deployment Request Flow (testnet + CI dispatch)
Task: Implement publish and deploy request endpoints and CI dispatch for testnet.

Create files:
1) src/pages/api/workflows/[id]/publish.ts
2) src/pages/api/workflows/[id]/deploy.ts
3) .github/workflows/testnet-deploy.yml (GitHub Actions)
4) src/lib/deploy/dispatch.ts (helper to call GH Actions dispatch or internal worker queue)

Requirements:
- publish: store pricing & visibility; only owner (creator) allowed.
- deploy: create a `deployments` DB record. If env=testnet, trigger GitHub Actions dispatch with payload {workflowId, versionId, requester}.
- Deployments stored with status 'pending'. GitHub Actions updates DB via API callback (provide deploy-callback route).
- Protect endpoints with requireCreator middleware.

File templates:

--- src/pages/api/workflows/[id]/publish.ts ---
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { requireCreator } from '@/lib/auth/middleware'

export default requireCreator(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  if (req.method !== 'POST') return res.status(405).end()
  const { priceAmount, priceCurrency, visibility } = req.body
  // upsert pricing/visibility on workflows table
  await db.query(`UPDATE workflows SET visibility=$1, updated_at=NOW() WHERE id=$2 AND owner_id=$3`, [visibility || 'marketplace', id, req.user.id])
  return res.status(200).json({ ok: true })
})
--- end ---

--- src/pages/api/workflows/[id]/deploy.ts ---
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { requireCreator } from '@/lib/auth/middleware'
import { dispatchDeploy } from '@/lib/deploy/dispatch'

export default requireCreator(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.query
  const { versionId, env } = req.body
  const insert = await db.query(
    `INSERT INTO deployments (workflow_version_id, env, status, requested_by, created_at) VALUES ($1,$2,'pending',$3,NOW()) RETURNING id`, [versionId, env, req.user.id]
  )
  const deploymentId = insert.rows[0].id
  if (env === 'testnet') {
    await dispatchDeploy({ workflowId: id, versionId, deploymentId })
  }
  return res.status(202).json({ deploymentId, status: 'pending' })
})
--- end ---

--- src/lib/deploy/dispatch.ts ---
export async function dispatchDeploy({ workflowId, versionId, deploymentId }) {
  const GH_TOKEN = process.env.GH_ACTIONS_TOKEN
  const REPO = 'new-world-coder/ChainCron'
  // GitHub Actions workflow_dispatch
  await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/testnet-deploy.yml/dispatches`, {
    method: 'POST',
    headers: { Authorization: `token ${GH_TOKEN}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ ref: 'main', inputs: { workflowId, versionId, deploymentId } })
  })
}
--- end ---

--- .github/workflows/testnet-deploy.yml ---
name: Testnet Deploy

on:
  workflow_dispatch:
    inputs:
      workflowId:
        required: true
      versionId:
        required: true
      deploymentId:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Deploy contracts (Hardhat)
        env:
          PRIVATE_KEY: ${{ secrets.TESTNET_DEPLOY_KEY }}
          RPC_URL: ${{ secrets.TESTNET_RPC }}
        run: |
          npx hardhat run scripts/deploy.js --network testnet --workflowId ${{ github.event.inputs.workflowId }} --versionId ${{ github.event.inputs.versionId }}
      - name: Notify app about deployment
        run: |
          curl -X POST -H "Content-Type: application/json" -d '{"deploymentId":"${{ github.event.inputs.deploymentId }}","status":"success","txHash":"0xdeadbeef"}' ${{ secrets.APP_DEPLOY_CALLBACK_URL }}
--- end ---

Notes:
- Protect callback endpoint with a secret token (GH secret), verify it on receipt.
- For mainnet, set deployment status to 'pending' and require admin approval before dispatch.

Cursor Prompt C — Subscribe & Payments (Stripe + Credits)
Task: Implement subscription flow and Stripe integration.

Create files:
1) src/pages/api/workflows/[id]/subscribe.ts
2) src/pages/api/webhooks/stripe.ts
3) src/lib/billing/stripeClient.ts
4) src/lib/credits/ledger.ts

Requirements:
- Accept paymentMode: 'stripe' | 'onchain' | 'credits'
- For stripe: create Checkout Session with metadata { workflowId, userId, plan }
- For credits: attempt atomic reservation (SQL transaction) and create subscription with status active.
- For onchain: return {status:'pending', instructions: {contract:..., data:...}} and wait for on-chain event handler to create subscription.

File templates:

--- src/pages/api/workflows/[id]/subscribe.ts ---
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'
import { createStripeCheckout } from '@/lib/billing/stripeClient'
import { reserveCredits } from '@/lib/credits/ledger'

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()
  const { paymentMode, planId } = req.body
  const workflowId = req.query.id as string
  if (paymentMode === 'stripe') {
    const session = await createStripeCheckout({ userId: req.user.id, workflowId, planId })
    return res.status(200).json({ checkoutUrl: session.url })
  }
  if (paymentMode === 'credits') {
    try {
      await reserveCredits(req.user.id, /*amount*/ 10)
      const r = await db.query(`INSERT INTO subscriptions (workflow_id, subscriber_id, plan, price_amount, price_currency, status, started_at) VALUES ($1,$2,$3,$4,$5,'active',NOW()) RETURNING id`, [workflowId, req.user.id, planId, 10, 'CREDITS'])
      return res.status(200).json({ subscriptionId: r.rows[0].id })
    } catch (err) {
      return res.status(402).json({ error: 'insufficient_credits' })
    }
  }
  if (paymentMode === 'onchain') {
    // return on-chain instructions payload
    return res.status(200).json({ status: 'pending', instructions: { contract: '0x..', call: 'subscribe', args: [workflowId, planId] } })
  }
  return res.status(400).json({ error: 'unsupported' })
})
--- end ---

--- src/lib/billing/stripeClient.ts ---
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
export async function createStripeCheckout({ userId, workflowId, planId }) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${process.env.APP_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/subscriptions/cancel`,
    metadata: { userId, workflowId, planId },
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }]
  })
  return session
}
--- end ---

--- src/pages/api/webhooks/stripe.ts ---
import { buffer } from 'micro'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
export const config = { api: { bodyParser: false } }
export default async (req, res) => {
  const sig = req.headers['stripe-signature']
  const buf = await buffer(req)
  let event
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error(err)
    return res.status(400).end()
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    // create subscription row based on metadata
    // idempotency: check if subscription for checkout session already created
  }
  return res.json({ received: true })
}
--- end ---

--- src/lib/credits/ledger.ts ---
import { db } from '@/lib/db'
export async function reserveCredits(userId, amount) {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const r = await client.query('SELECT balance FROM credits WHERE user_id=$1 FOR UPDATE', [userId])
    if (!r.rows.length || r.rows[0].balance < amount) { await client.query('ROLLBACK'); throw new Error('insufficient') }
    await client.query('UPDATE credits SET balance = balance - $1 WHERE user_id = $2', [amount, userId])
    await client.query('INSERT INTO credit_transactions (user_id, amount, type, reference, created_at) VALUES ($1,$2,$3,$4,NOW())', [userId, amount, 'reserve', 'reserve:' + Date.now()])
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
--- end ---

Notes:
- Webhook handlers must be idempotent (store stripe session id).
- For on-chain flows, implement event listener that listens for subscription contract events and resolves pending subscriptions.

Cursor Prompt D — Invocation & Execution Flow (Queue + Worker)
Task: Implement POST /api/invoke and a worker that executes steps from workflow JSON.

Create files:
1) src/pages/api/invoke.ts
2) workers/executor/worker.ts
3) src/lib/queue/redisQueue.ts (using bullmq or simple Redis streams)
4) tests/invoke.test.ts

Requirements:
- POST /api/invoke receives { workflowId, invocationId?, callerUserId?, params }
- Authenticate caller, then check subscription via DB.
- Create or ensure idempotent invocation record (invocation_id).
- Pre-billing: hold credits or create a Stripe invoice intent.
- Push invocation to queue with payload { invocationId, workflowVersionId, params }
- Worker consumes queue:
  - load workflow_version JSON
  - for each step execute action:
    - external API call
    - on-chain action: build unsignedTx; if user is the signer, mark waiting for signature; if custodial and approved, sign via KMS and broadcast
  - write usage_event entries per step
  - on complete release held credits or capture charges
- Provide status endpoint GET /api/invocations/:id/status

File templates:

--- src/pages/api/invoke.ts ---
import { requireAuth } from '@/lib/auth/middleware'
import { db } from '@/lib/db'
import { pushToQueue } from '@/lib/queue/redisQueue'

export default requireAuth(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()
  const { workflowId, invocationId, params } = req.body
  const id = invocationId || `inv-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
  // idempotency: upsert invocation record
  await db.query(`INSERT INTO invocations (id, workflow_id, caller_id, status, created_at) VALUES ($1,$2,$3,'queued',NOW()) ON CONFLICT (id) DO NOTHING`, [id, workflowId, req.user.id])
  // billing reservation omitted for brevity (call billing service)
  await pushToQueue({ invocationId: id, workflowId, params })
  return res.status(202).json({ invocationId: id, status: 'queued', trackUrl: `/invocations/${id}` })
})
--- end ---

--- workers/executor/worker.ts ---
import { Worker } from 'bullmq'
import { db } from '@/lib/db'
import { executeWorkflow } from './runtime'

const worker = new Worker('invocations', async job => {
  const { invocationId, workflowId, params } = job.data
  // load latest workflow_version
  const wf = (await db.query('SELECT wv.workflow_json FROM workflow_versions wv JOIN workflows w ON wv.workflow_id = w.id WHERE w.id=$1 ORDER BY wv.version DESC LIMIT 1', [workflowId])).rows[0]
  try {
    await executeWorkflow(invocationId, wf.workflow_json, params)
    await db.query('UPDATE invocations SET status=$1, completed_at=NOW() WHERE id=$2', ['completed', invocationId])
  } catch (err) {
    await db.query('UPDATE invocations SET status=$1, error_msg=$2 WHERE id=$3', ['failed', err.message, invocationId])
    throw err
  }
})

worker.on('failed', (job, err) => {
  console.error('job failed', job.id, err)
})
--- end ---

Notes:
- `executeWorkflow` should implement network adapters and step orchestration.
- Worker can run on Cloud Run / GKE / ECS. Keep concurrency limited and horizontally scalable.

Cursor Prompt E — Usage & Creator Metrics Endpoints
Task: Implement metrics endpoints and materialized view for creator dashboard.

Create files:
1) src/pages/api/creators/[id]/metrics.ts
2) sql/analytics_materialized_views.sql
3) src/components/CreatorMetricsChart.tsx (React chart using Chart.js)

Requirements:
- Endpoint aggregates usage_events by workflow & subscriber and returns totals and timeseries for a date range.
- Use materialized view to speed up queries: daily_invocations_by_workflow (workflow_id, day, invocations, revenue)
- Support filters: start_date, end_date, workflow_id
- Cache results in Redis for 1 minute

File templates:

--- sql/analytics_materialized_views.sql ---
CREATE MATERIALIZED VIEW daily_invocations_by_workflow AS
SELECT workflow_id, date_trunc('day', created_at)::date as day, count(*) as invocations, sum(cost) as revenue
FROM usage_events
GROUP BY workflow_id, day;
--- end ---

--- src/pages/api/creators/[id]/metrics.ts ---
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'
import { cacheGet, cacheSet } from '@/lib/cache'

export default requireAuth(async (req, res) => {
  const userId = req.query.id
  // ensure the requester is the same creator or admin
  if (req.user.id !== userId && req.user.role !== 'admin') return res.status(403).end()
  const { start_date, end_date, workflow_id } = req.query
  const cacheKey = `metrics:${userId}:${start_date}:${end_date}:${workflow_id}`
  const cached = await cacheGet(cacheKey)
  if (cached) return res.json(cached)
  const rows = (await db.query('SELECT day, invocations, revenue FROM daily_invocations_by_workflow WHERE workflow_id = $1 AND day BETWEEN $2 AND $3 ORDER BY day', [workflow_id, start_date, end_date])).rows
  await cacheSet(cacheKey, rows, 60)
  return res.json({ rows })
})
--- end ---

Notes:
- Frontend component `CreatorMetricsChart` consumes this endpoint and plots series.
- Refresh materialized views periodically with `REFRESH MATERIALIZED VIEW daily_invocations_by_workflow;` via cron (Cloud Scheduler).

Cursor Prompt F — Credits Top-up UI + Webhook
Task: Implement credits top-up flow (Stripe Checkout) and webhook handler.

Create files:
1) src/pages/api/credits/topup.ts
2) src/pages/api/webhooks/stripeCredits.ts
3) src/components/CreditsTopupModal.tsx

Requirements:
- Topup endpoint creates Stripe Checkout Session with metadata { userId, amount, purpose: 'credits' }.
- Webhook handler increases `credits.balance` atomically and writes `credit_transactions`.
- UI modal allows selecting preset packages and calls topup endpoint to redirect to Checkout.

File templates:

--- src/pages/api/credits/topup.ts ---
import { requireAuth } from '@/lib/auth/middleware'
import { createStripeCheckout } from '@/lib/billing/stripeClient'
export default requireAuth(async (req, res) => {
  const { amount } = req.body
  const session = await createStripeCheckout({ userId: req.user.id, workflowId: null, planId: null, amount, purpose: 'credits' })
  return res.json({ url: session.url })
})
--- end ---

--- src/pages/api/webhooks/stripeCredits.ts ---
// combine logic with existing stripe webhook; check metadata.purpose === 'credits' then credit balance
--- end ---

Notes:
- Ensure webhook idempotency by storing session id processed.
- Emit user notification on success.

B — OpenAPI 3.0 Spec + mock server instructions

Save the YAML below as openapi.yaml in repository root. You can run a mock server with Prism (npm i -g @stoplight/prism-cli) or Stoplight. Prism will serve mock responses for the endpoints so frontend devs can work offline.

openapi: 3.0.3
info:
  title: ChainCron API
  version: "1.0.0"
servers:
  - url: http://localhost:3000
paths:
  /auth/siwe/nonce:
    get:
      summary: Issue SIWE nonce
      parameters:
        - name: address
          in: query
          schema:
            type: string
      responses:
        "200":
          description: nonce
          content:
            application/json:
              schema:
                type: object
                properties:
                  nonce:
                    type: string
  /auth/siwe:
    post:
      summary: Verify SIWE signature + create session
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message: { type: string }
                signature: { type: string }
      responses:
        "200":
          description: session
  /api/workflows:
    post:
      summary: Create workflow
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Workflow'
      responses:
        "201":
          description: created
          content:
            application/json:
              schema:
                type: object
                properties:
                  workflowId: { type: string }
                  versionId: { type: string }
  /api/workflows/{id}/publish:
    post:
      summary: Publish workflow to marketplace
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                priceAmount: { type: number }
                priceCurrency: { type: string }
                visibility: { type: string }
      responses:
        "200": { description: ok }
  /api/workflows/{id}/deploy:
    post:
      summary: Request deploy for workflow version
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                versionId: { type: string }
                env:
                  type: string
                  enum: [testnet, mainnet]
      responses:
        "202":
          description: deployment queued
  /api/workflows/{id}/subscribe:
    post:
      summary: Subscribe to a workflow
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                paymentMode:
                  type: string
                  enum: [stripe, credits, onchain]
                planId: { type: string }
      responses:
        "200":
          description: subscription created / checkout url returned
  /api/invoke:
    post:
      summary: Invoke a workflow
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                workflowId: { type: string }
                invocationId: { type: string }
                params: { type: object }
      responses:
        "202":
          description: invocation queued
  /api/creators/{id}/metrics:
    get:
      summary: Get creator metrics
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
        - name: start_date
          in: query
          schema: { type: string, format: date }
        - name: end_date
          in: query
          schema: { type: string, format: date }
      responses:
        "200":
          description: metrics
components:
  schemas:
    Workflow:
      type: object
      required: [version, meta, trigger, steps]
      properties:
        version: { type: integer }
        meta:
          type: object
          properties:
            title: { type: string }
            slug: { type: string }
            description: { type: string }
        trigger: { type: object }
        steps:
          type: array
          items:
            type: object

Run local mock server (Prism)

npm i -g @stoplight/prism-cli

prism mock openapi.yaml -p 4010

Frontend can use http://localhost:4010 as API base and receive mocked responses.

You can also use prism mock -h to configure dynamic responses or custom examples.

C — Can these artifacts be deployed to Vercel? Tech stack & Deployment mapping
Summary answer

Frontend (Next.js) — YES — deploy to Vercel (static pages + Serverless / Edge functions). Ideal.

API routes that are lightweight (auth/session, simple DB queries) — CAN be deployed as Next.js API routes on Vercel Serverless Functions, but consider limits (execution time, concurrency). For heavier tasks, use dedicated services.

Long-running / CPU-bound tasks (contract compilation, Hardhat deploys, heavy workers, execution engine) — DO NOT deploy to Vercel. Use Cloud Run, GKE, AWS ECS/Fargate, or Fly.io.

Workers / Execution Engine (Temporal/Temporal Cloud, or custom worker) — deploy to Cloud Run / GKE or run via dedicated VMs. Use Pub/Sub or Redis for queueing.

Database — managed Postgres (Supabase / AWS RDS / Cloud SQL). Not on Vercel.

Redis — for queues & caching (Upstash for serverless-friendly or Redis Cloud).

KMS / Secrets — Google KMS / AWS KMS / HashiCorp Vault.

CI/CD — GitHub Actions for builds and contract deployments; secrets stored in GH secrets.

Pinning (IPFS) — Pinata / Infura / Web3.Storage; calls from backend (Cloud Run or serverless).

Stripe Webhooks — deploy on server that can receive webhooks (Vercel API works), but ensure idempotency and retries.

Recommended tech stack (detailed)

Frontend: Next.js (TypeScript), Tailwind, RainbowKit (wallet UI), React Query / SWR

Backend API: Next.js API routes for lightweight endpoints; Node/Express or NestJS on Cloud Run for heavier endpoints

DB: Postgres (Supabase recommended for quick integration)

Queue: BullMQ (Redis) or Google Pub/Sub; Redis provider: Upstash for serverless friendliness or Redis Cloud

Workers / Execution Engine: Node workers containerized; or Temporal Cloud for complex long-running orchestration

Smart contract toolchain: Hardhat or Foundry (CI)

Storage: IPFS (Pinata/Infura/Web3.Storage) + S3 for artifacts

Payments: Stripe for fiat; on-chain tokens via onchain contracts + relayer (Biconomy/metatx optional)

KMS: GCP KMS or AWS KMS or HashiCorp Vault

Monitoring: Prometheus/Grafana, Sentry for errors, Logtail

CI/CD: GitHub Actions

Secrets/Env for Vercel: Use Vercel env for non-critical config; KMS connector to fetch sensitive keys

Deployment asset mapping (where to deploy)

Next.js frontend → Vercel

Public pages, docs, marketing, and client-side UI

Uses Vercel Edge functions for light server logic (auth nonce endpoint ok)

Next.js API routes (auth, small CRUD) → Vercel Serverless Functions

Examples: GET /auth/siwe/nonce, POST /auth/siwe (acceptable)

Stripe webhooks → Vercel API (ensure bodyParser disabled for raw body)

Alternative: Cloud Run endpoint if you prefer longer timeouts

Worker / Executor → Cloud Run (GCP), AWS Fargate, or a Kubernetes cluster (GKE/EKS)

Long-running processes, heavy concurrency, KMS access

Contract deployments (Hardhat) → GitHub Actions runner (self-hosted runner or ephemeral runner with secrets)

Redis → Upstash (serverless-friendly) or Redis Cloud

Postgres → Supabase or Cloud SQL / RDS

IPFS Pinning → Pinata/Web3.Storage calls from Cloud Run or Vercel edge (with secrets via KMS)

KMS/HSM → GCP KMS / AWS KMS or HashiCorp Vault (not on Vercel)

Temporal (optional orchestration) → Temporal Cloud OR self-hosted on GKE/Cloud Run

Vercel considerations & limits

Execution time limit for serverless functions (current Vercel limit varies) — may not suit long jobs or heavy cryptographic signing; move these to Cloud Run.

No direct access to VPC or private networks from Vercel — for private DB connections use a connection pooler (PgBouncer) and limit DB connections. Prefer Supabase for seamless integration.

Use Edge Middleware for role checks & A/B features.

D — CI / GitHub Actions sample (testnet deploy + workflow)

Add this as .github/workflows/ci.yml to run tests and optionally trigger deploys.

name: CI

on:
  push:
    branches: [ main, 'feature/*' ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
  deploy-testnet:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'workflow_dispatch' || startsWith(github.ref, 'refs/heads/feature/')
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - name: Deploy Contracts (Hardhat)
        env:
          PRIVATE_KEY: ${{ secrets.TESTNET_DEPLOY_KEY }}
          RPC_URL: ${{ secrets.TESTNET_RPC }}
        run: |
          npx hardhat run scripts/deploy.js --network testnet
      - name: Notify App
        run: curl -X POST -H "Authorization: Bearer ${{ secrets.APP_DEPLOY_CALLBACK_SECRET }}" -d '{"deploymentId":"ci-deploy"}' ${{ secrets.APP_DEPLOY_CALLBACK_URL }}

E — Mock server & local dev tips

Use prism mock openapi.yaml to mock endpoints.

Use ngrok or localtunnel for webhooks to receive Stripe callbacks during local development.

For local on-chain testing use hardhat node or anvil (foundry), and configure TESTNET_CONFIG to point to local RPC for dev.