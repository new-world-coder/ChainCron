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

CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_version_id uuid REFERENCES workflow_versions(id) ON DELETE CASCADE,
  env text NOT NULL,
  status text DEFAULT 'pending',
  requested_by uuid NOT NULL,
  tx_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL,
  plan text,
  price_amount numeric,
  price_currency text,
  status text DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invocations (
  id text PRIMARY KEY,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  caller_id uuid NOT NULL,
  status text DEFAULT 'queued',
  error_msg text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL,
  invocation_id text,
  cost numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credits (
  user_id uuid PRIMARY KEY,
  balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES credits(user_id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL,
  reference text,
  created_at timestamptz DEFAULT now()
);

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_invocations_by_workflow AS
SELECT workflow_id, date_trunc('day', created_at)::date as day, count(*) as invocations, sum(cost) as revenue
FROM usage_events
GROUP BY workflow_id, day;

