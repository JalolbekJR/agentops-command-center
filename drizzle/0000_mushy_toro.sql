CREATE TYPE "public"."user_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."workspace_status" AS ENUM('active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."workspace_member_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."role_name" AS ENUM('Founder/Admin', 'AI Engineer', 'QA Reviewer', 'Security Reviewer', 'Product Manager', 'Viewer');--> statement-breakpoint
CREATE TYPE "public"."agent_capability_category" AS ENUM('engineering', 'qa', 'security', 'product', 'ops');--> statement-breakpoint
CREATE TYPE "public"."agent_privacy_level" AS ENUM('public_demo_safe', 'workspace_private', 'enterprise_private');--> statement-breakpoint
CREATE TYPE "public"."agent_status" AS ENUM('active', 'paused', 'needs_review', 'archived');--> statement-breakpoint
CREATE TYPE "public"."built_in_agent_status" AS ENUM('recommended_demo_foundation', 'demo_ready', 'planned', 'future', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."project_environment" AS ENUM('local_demo', 'development', 'staging', 'production');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."evaluation_status" AS ENUM('passed', 'warning', 'failed');--> statement-breakpoint
CREATE TYPE "public"."evaluator_type" AS ENUM('deterministic_mock', 'future_ai_evaluator', 'human_reviewer');--> statement-breakpoint
CREATE TYPE "public"."event_severity" AS ENUM('info', 'success', 'warning', 'error');--> statement-breakpoint
CREATE TYPE "public"."risk_category" AS ENUM('prompt_injection', 'tool_injection', 'sensitive_data_exposure', 'unauthorized_access', 'unsafe_automation', 'qa_failure', 'policy_violation', 'cost_overrun', 'reliability_regression', 'release_gate_blocker');--> statement-breakpoint
CREATE TYPE "public"."risk_status" AS ENUM('open', 'triaged', 'mitigated', 'accepted', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."run_status" AS ENUM('queued', 'running', 'waiting_for_approval', 'evaluating', 'passed', 'failed', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."tool_call_status" AS ENUM('pending', 'running', 'waiting_for_approval', 'succeeded', 'failed', 'blocked', 'redacted');--> statement-breakpoint
CREATE TYPE "public"."workflow_status" AS ENUM('draft', 'published', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."workflow_step_type" AS ENUM('trigger', 'agent_task', 'tool_call', 'approval', 'evaluation', 'browser_qa', 'release_gate', 'notification');--> statement-breakpoint
CREATE TYPE "public"."workflow_trigger_type" AS ENUM('manual', 'scheduled', 'webhook', 'release_gate');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_initials" text NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"plan_key" text NOT NULL,
	"status" "workspace_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" text NOT NULL,
	"permission_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" "role_name" NOT NULL,
	"description" text NOT NULL,
	"is_system" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"status" "workspace_member_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_capabilities" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text NOT NULL,
	"name" text NOT NULL,
	"category" "agent_capability_category" NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"risk_level" "risk_level" DEFAULT 'low' NOT NULL,
	"tool_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_products" (
	"id" text PRIMARY KEY NOT NULL,
	"built_in_agent_id" text NOT NULL,
	"product_key" text NOT NULL,
	"required_plan_key" text NOT NULL,
	"trial_supported" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"owner_user_id" text NOT NULL,
	"status" "agent_status" DEFAULT 'active' NOT NULL,
	"risk_level" "risk_level" DEFAULT 'low' NOT NULL,
	"default_model" text NOT NULL,
	"last_run_at" timestamp with time zone,
	"success_rate" double precision DEFAULT 0 NOT NULL,
	"average_cost_cents" integer DEFAULT 0 NOT NULL,
	"built_in_agent_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "built_in_agents" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_description" text NOT NULL,
	"purpose" text NOT NULL,
	"privacy_level" "agent_privacy_level" NOT NULL,
	"risk_level" "risk_level" NOT NULL,
	"usage_meter" text NOT NULL,
	"monetization_tier" text NOT NULL,
	"implementation_status" "built_in_agent_status" NOT NULL,
	"recommended" boolean DEFAULT false NOT NULL,
	"best_for" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"input_requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"connection_requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"required_permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"required_capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"approval_requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"security_notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"deployment_modes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"environment" "project_environment" DEFAULT 'local_demo' NOT NULL,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"run_id" text NOT NULL,
	"tool_call_id" text,
	"assigned_role_id" text NOT NULL,
	"assigned_user_id" text,
	"status" "approval_status" DEFAULT 'pending' NOT NULL,
	"risk_level" "risk_level" DEFAULT 'low' NOT NULL,
	"reason" text NOT NULL,
	"decision" text,
	"decided_by_user_id" text,
	"decision_comment" text,
	"requested_at" timestamp with time zone NOT NULL,
	"decided_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"project_id" text,
	"actor_user_id" text,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"before_summary" text,
	"after_summary" text,
	"reason" text NOT NULL,
	"request_id" text,
	"correlation_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_results" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"run_id" text NOT NULL,
	"evaluator_type" "evaluator_type" NOT NULL,
	"correctness_score" double precision NOT NULL,
	"safety_score" double precision NOT NULL,
	"reliability_score" double precision NOT NULL,
	"latency_score" double precision NOT NULL,
	"cost_score" double precision NOT NULL,
	"user_impact_score" double precision NOT NULL,
	"policy_compliance_score" double precision NOT NULL,
	"overall_score" double precision NOT NULL,
	"status" "evaluation_status" NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risk_findings" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"run_id" text NOT NULL,
	"tool_call_id" text,
	"category" "risk_category" NOT NULL,
	"severity" "risk_level" NOT NULL,
	"status" "risk_status" DEFAULT 'open' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"evidence_summary" text NOT NULL,
	"owner_role_id" text NOT NULL,
	"owner_user_id" text,
	"recommended_mitigation" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "run_events" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"step_id" text,
	"event_type" text NOT NULL,
	"severity" "event_severity" DEFAULT 'info' NOT NULL,
	"message" text NOT NULL,
	"metadata_summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sequence" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"workflow_version" integer NOT NULL,
	"triggered_by_user_id" text NOT NULL,
	"status" "run_status" DEFAULT 'queued' NOT NULL,
	"environment" text NOT NULL,
	"trace_id" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"duration_ms" integer,
	"total_cost_cents" integer DEFAULT 0 NOT NULL,
	"failure_reason" text,
	"summary" text NOT NULL,
	"event_count" integer DEFAULT 0 NOT NULL,
	"approval_count" integer DEFAULT 0 NOT NULL,
	"risk_count" integer DEFAULT 0 NOT NULL,
	"latest_event_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_calls" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"step_id" text NOT NULL,
	"agent_id" text NOT NULL,
	"tool_name" text NOT NULL,
	"input_summary" text NOT NULL,
	"output_summary" text NOT NULL,
	"status" "tool_call_status" DEFAULT 'pending' NOT NULL,
	"risk_level" "risk_level" DEFAULT 'low' NOT NULL,
	"approval_request_id" text,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"duration_ms" integer,
	"error_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_steps" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"step_key" text NOT NULL,
	"name" text NOT NULL,
	"type" "workflow_step_type" NOT NULL,
	"depends_on_step_keys" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"agent_id" text,
	"tool_name" text,
	"approval_policy_id" text,
	"retry_policy" jsonb,
	"timeout_seconds" integer,
	"position_x" integer DEFAULT 0 NOT NULL,
	"position_y" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"status" "workflow_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"owner_user_id" text NOT NULL,
	"trigger_type" "workflow_trigger_type" DEFAULT 'manual' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"description" text NOT NULL,
	"source_type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"description" text NOT NULL,
	"default_state" boolean DEFAULT false NOT NULL,
	"scope" text DEFAULT 'workspace' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_limits" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"meter_key" text NOT NULL,
	"limit_value" integer,
	"unit_label" text NOT NULL,
	"hard_limit" boolean DEFAULT true NOT NULL,
	"period" text DEFAULT 'monthly' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"audience" text NOT NULL,
	"summary" text NOT NULL,
	"price_label" text NOT NULL,
	"recommended" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"public_rank" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_counters" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"project_id" text,
	"meter_key" text NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"used" integer DEFAULT 0 NOT NULL,
	"limit_value" integer,
	"hard_limit" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"source" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_capabilities" ADD CONSTRAINT "agent_capabilities_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_products" ADD CONSTRAINT "agent_products_built_in_agent_id_built_in_agents_id_fk" FOREIGN KEY ("built_in_agent_id") REFERENCES "public"."built_in_agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_tool_call_id_tool_calls_id_fk" FOREIGN KEY ("tool_call_id") REFERENCES "public"."tool_calls"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_assigned_role_id_roles_id_fk" FOREIGN KEY ("assigned_role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_results" ADD CONSTRAINT "evaluation_results_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_results" ADD CONSTRAINT "evaluation_results_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_findings" ADD CONSTRAINT "risk_findings_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_findings" ADD CONSTRAINT "risk_findings_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_findings" ADD CONSTRAINT "risk_findings_tool_call_id_tool_calls_id_fk" FOREIGN KEY ("tool_call_id") REFERENCES "public"."tool_calls"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_findings" ADD CONSTRAINT "risk_findings_owner_role_id_roles_id_fk" FOREIGN KEY ("owner_role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_findings" ADD CONSTRAINT "risk_findings_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "run_events" ADD CONSTRAINT "run_events_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "run_events" ADD CONSTRAINT "run_events_step_id_workflow_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."workflow_steps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_triggered_by_user_id_users_id_fk" FOREIGN KEY ("triggered_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_step_id_workflow_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."workflow_steps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_limits" ADD CONSTRAINT "plan_limits_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_entitlements" ADD CONSTRAINT "workspace_entitlements_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_entitlements" ADD CONSTRAINT "workspace_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "public"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_slug_unique" ON "workspaces" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "workspaces_plan_key_idx" ON "workspaces" USING btree ("plan_key");--> statement-breakpoint
CREATE INDEX "workspaces_status_idx" ON "workspaces" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_key_unique" ON "permissions" USING btree ("key");--> statement-breakpoint
CREATE INDEX "permissions_category_idx" ON "permissions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_workspace_name_unique" ON "roles" USING btree ("workspace_id","name");--> statement-breakpoint
CREATE INDEX "roles_workspace_id_idx" ON "roles" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_members_workspace_user_unique" ON "workspace_members" USING btree ("workspace_id","user_id");--> statement-breakpoint
CREATE INDEX "workspace_members_workspace_id_idx" ON "workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workspace_members_role_id_idx" ON "workspace_members" USING btree ("role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "agent_capabilities_agent_tool_unique" ON "agent_capabilities" USING btree ("agent_id","tool_name");--> statement-breakpoint
CREATE INDEX "agent_capabilities_agent_id_idx" ON "agent_capabilities" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "agent_capabilities_risk_level_idx" ON "agent_capabilities" USING btree ("risk_level");--> statement-breakpoint
CREATE UNIQUE INDEX "agent_products_product_key_unique" ON "agent_products" USING btree ("product_key");--> statement-breakpoint
CREATE INDEX "agent_products_built_in_agent_id_idx" ON "agent_products" USING btree ("built_in_agent_id");--> statement-breakpoint
CREATE INDEX "agent_products_required_plan_key_idx" ON "agent_products" USING btree ("required_plan_key");--> statement-breakpoint
CREATE INDEX "agents_project_id_idx" ON "agents" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "agents_project_status_idx" ON "agents" USING btree ("project_id","status");--> statement-breakpoint
CREATE INDEX "agents_project_risk_level_idx" ON "agents" USING btree ("project_id","risk_level");--> statement-breakpoint
CREATE INDEX "agents_owner_user_id_idx" ON "agents" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "built_in_agents_status_idx" ON "built_in_agents" USING btree ("implementation_status");--> statement-breakpoint
CREATE INDEX "built_in_agents_risk_level_idx" ON "built_in_agents" USING btree ("risk_level");--> statement-breakpoint
CREATE INDEX "built_in_agents_monetization_tier_idx" ON "built_in_agents" USING btree ("monetization_tier");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_workspace_slug_unique" ON "projects" USING btree ("workspace_id","slug");--> statement-breakpoint
CREATE INDEX "projects_workspace_id_idx" ON "projects" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "projects_workspace_status_idx" ON "projects" USING btree ("workspace_id","status");--> statement-breakpoint
CREATE INDEX "projects_environment_idx" ON "projects" USING btree ("environment");--> statement-breakpoint
CREATE INDEX "approvals_project_status_requested_idx" ON "approvals" USING btree ("project_id","status","requested_at");--> statement-breakpoint
CREATE INDEX "approvals_run_id_idx" ON "approvals" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "approvals_assigned_role_id_idx" ON "approvals" USING btree ("assigned_role_id");--> statement-breakpoint
CREATE INDEX "approvals_assigned_user_id_idx" ON "approvals" USING btree ("assigned_user_id");--> statement-breakpoint
CREATE INDEX "audit_events_workspace_created_idx" ON "audit_events" USING btree ("workspace_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_events_project_created_idx" ON "audit_events" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_events_actor_created_idx" ON "audit_events" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_events_target_idx" ON "audit_events" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "evaluation_results_project_status_created_idx" ON "evaluation_results" USING btree ("project_id","status","created_at");--> statement-breakpoint
CREATE INDEX "evaluation_results_run_id_idx" ON "evaluation_results" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "risk_findings_project_severity_status_idx" ON "risk_findings" USING btree ("project_id","severity","status");--> statement-breakpoint
CREATE INDEX "risk_findings_category_status_idx" ON "risk_findings" USING btree ("category","status");--> statement-breakpoint
CREATE INDEX "risk_findings_run_id_idx" ON "risk_findings" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "risk_findings_owner_role_id_idx" ON "risk_findings" USING btree ("owner_role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "run_events_run_sequence_unique" ON "run_events" USING btree ("run_id","sequence");--> statement-breakpoint
CREATE INDEX "run_events_run_id_idx" ON "run_events" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "run_events_run_created_idx" ON "run_events" USING btree ("run_id","created_at");--> statement-breakpoint
CREATE INDEX "run_events_type_severity_idx" ON "run_events" USING btree ("event_type","severity");--> statement-breakpoint
CREATE UNIQUE INDEX "runs_trace_id_unique" ON "runs" USING btree ("trace_id");--> statement-breakpoint
CREATE INDEX "runs_project_id_idx" ON "runs" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "runs_project_status_started_idx" ON "runs" USING btree ("project_id","status","started_at");--> statement-breakpoint
CREATE INDEX "runs_workflow_started_idx" ON "runs" USING btree ("workflow_id","started_at");--> statement-breakpoint
CREATE INDEX "tool_calls_run_id_idx" ON "tool_calls" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "tool_calls_agent_id_idx" ON "tool_calls" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "tool_calls_status_idx" ON "tool_calls" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tool_calls_risk_level_idx" ON "tool_calls" USING btree ("risk_level");--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_steps_workflow_step_key_unique" ON "workflow_steps" USING btree ("workflow_id","step_key");--> statement-breakpoint
CREATE INDEX "workflow_steps_workflow_id_idx" ON "workflow_steps" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_steps_agent_id_idx" ON "workflow_steps" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "workflow_steps_type_idx" ON "workflow_steps" USING btree ("type");--> statement-breakpoint
CREATE INDEX "workflows_project_id_idx" ON "workflows" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "workflows_project_status_idx" ON "workflows" USING btree ("project_id","status");--> statement-breakpoint
CREATE INDEX "workflows_project_version_idx" ON "workflows" USING btree ("project_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_key_unique" ON "entitlements" USING btree ("key");--> statement-breakpoint
CREATE INDEX "entitlements_status_idx" ON "entitlements" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "feature_flags_key_unique" ON "feature_flags" USING btree ("key");--> statement-breakpoint
CREATE INDEX "feature_flags_scope_idx" ON "feature_flags" USING btree ("scope");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_limits_plan_meter_period_unique" ON "plan_limits" USING btree ("plan_id","meter_key","period");--> statement-breakpoint
CREATE INDEX "plan_limits_meter_key_idx" ON "plan_limits" USING btree ("meter_key");--> statement-breakpoint
CREATE UNIQUE INDEX "plans_key_unique" ON "plans" USING btree ("key");--> statement-breakpoint
CREATE INDEX "plans_status_rank_idx" ON "plans" USING btree ("status","public_rank");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_counters_workspace_meter_period_unique" ON "usage_counters" USING btree ("workspace_id","meter_key","period_start");--> statement-breakpoint
CREATE INDEX "usage_counters_workspace_id_idx" ON "usage_counters" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "usage_counters_project_id_idx" ON "usage_counters" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "usage_counters_meter_lookup_idx" ON "usage_counters" USING btree ("workspace_id","meter_key","period_start");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_entitlements_workspace_entitlement_unique" ON "workspace_entitlements" USING btree ("workspace_id","entitlement_id");--> statement-breakpoint
CREATE INDEX "workspace_entitlements_workspace_id_idx" ON "workspace_entitlements" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_entitlements_entitlement_id_idx" ON "workspace_entitlements" USING btree ("entitlement_id");--> statement-breakpoint
CREATE INDEX "workspace_entitlements_status_idx" ON "workspace_entitlements" USING btree ("status");