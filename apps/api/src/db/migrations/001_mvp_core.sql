CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'viewer', 'ai_service')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  normalized_name text NOT NULL UNIQUE,
  size text NOT NULL CHECK (size IN ('1_10', '11_50', '51_200', '201_500', '500_plus')),
  pm_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY,
  source_system text NOT NULL CHECK (source_system IN ('manual', 'emergent')),
  source_id text,
  received_at timestamptz NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id),
  contact_name text NOT NULL,
  contact_title text,
  phone text NOT NULL,
  email text NOT NULL,
  customer_note text,
  owner_id uuid REFERENCES users(id),
  stage text NOT NULL CHECK (stage IN ('new', 'discovery', 'follow_up', 'proposal', 'contract', 'on_hold', 'closed')),
  status text NOT NULL CHECK (status IN (
    'unreviewed', 'first_contact_pending', 'customer_response_pending',
    'discovery_completed', 'meeting_scheduled', 'meeting_completed',
    'company_profile_sent', 'sample_quote_sent', 'proposal_response_completed',
    'seminar_scheduled', 'formal_proposal_sent', 'negotiating',
    'contract_sent', 'contract_signed', 'invoice_issued',
    'long_term_hold', 'lost', 'excluded'
  )),
  validity text NOT NULL CHECK (validity IN ('pending', 'valid', 'excluded')),
  contact_deadline_at timestamptz NOT NULL,
  first_contact_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS deals_source_unique
  ON deals (source_system, source_id)
  WHERE source_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS deals_owner_deadline_idx
  ON deals (owner_id, contact_deadline_at)
  WHERE first_contact_completed_at IS NULL;
CREATE INDEX IF NOT EXISTS deals_stage_created_idx
  ON deals (stage, created_at DESC);

CREATE TABLE IF NOT EXISTS deal_services (
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('group_training', 'online_coaching', 'ax_build', 'change_management')),
  estimated_value numeric(15, 2),
  PRIMARY KEY (deal_id, service_type)
);

CREATE TABLE IF NOT EXISTS deal_activities (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals(id),
  activity_type text NOT NULL,
  outcome text,
  occurred_at timestamptz NOT NULL,
  summary text,
  actor_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS deal_activities_deal_time_idx
  ON deal_activities (deal_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS next_actions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals(id),
  action_type text NOT NULL,
  title text NOT NULL,
  due_at timestamptz NOT NULL,
  assignee_id uuid REFERENCES users(id),
  note text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS next_actions_due_idx
  ON next_actions (assignee_id, due_at)
  WHERE completed_at IS NULL;

CREATE TABLE IF NOT EXISTS calendar_holidays (
  holiday_date date PRIMARY KEY,
  name text NOT NULL,
  source text NOT NULL DEFAULT 'kasi',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  actor_id uuid REFERENCES users(id),
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx
  ON audit_logs (entity_type, entity_id, created_at DESC);

CREATE TABLE IF NOT EXISTS idempotency_records (
  scope text NOT NULL,
  key text NOT NULL,
  response_body jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, key)
);
