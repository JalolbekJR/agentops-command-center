import { boolean, doublePrecision, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users, workspaces } from "./identity";

export const projectEnvironmentEnum = pgEnum("project_environment", ["local_demo", "development", "staging", "production"]);
export const projectStatusEnum = pgEnum("project_status", ["active", "paused", "archived"]);
export const agentStatusEnum = pgEnum("agent_status", ["active", "paused", "needs_review", "archived"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high", "critical"]);
export const agentCapabilityCategoryEnum = pgEnum("agent_capability_category", ["engineering", "qa", "security", "product", "ops"]);
export const builtInAgentStatusEnum = pgEnum("built_in_agent_status", ["recommended_demo_foundation", "demo_ready", "planned", "future", "disabled"]);
export const agentPrivacyLevelEnum = pgEnum("agent_privacy_level", ["public_demo_safe", "workspace_private", "enterprise_private"]);

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    environment: projectEnvironmentEnum("environment").default("local_demo").notNull(),
    status: projectStatusEnum("status").default("active").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    uniqueIndex("projects_workspace_slug_unique").on(table.workspaceId, table.slug),
    index("projects_workspace_id_idx").on(table.workspaceId),
    index("projects_workspace_status_idx").on(table.workspaceId, table.status),
    index("projects_environment_idx").on(table.environment)
  ]
);

export const agents = pgTable(
  "agents",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: agentStatusEnum("status").default("active").notNull(),
    riskLevel: riskLevelEnum("risk_level").default("low").notNull(),
    defaultModel: text("default_model").notNull(),
    lastRunAt: timestamp("last_run_at", { mode: "string", withTimezone: true }),
    successRate: doublePrecision("success_rate").default(0).notNull(),
    averageCostCents: integer("average_cost_cents").default(0).notNull(),
    builtInAgentId: text("built_in_agent_id"),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    index("agents_project_id_idx").on(table.projectId),
    index("agents_project_status_idx").on(table.projectId, table.status),
    index("agents_project_risk_level_idx").on(table.projectId, table.riskLevel),
    index("agents_owner_user_id_idx").on(table.ownerUserId)
  ]
);

export const agentCapabilities = pgTable(
  "agent_capabilities",
  {
    id: text("id").primaryKey(),
    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: agentCapabilityCategoryEnum("category").notNull(),
    requiresApproval: boolean("requires_approval").default(false).notNull(),
    riskLevel: riskLevelEnum("risk_level").default("low").notNull(),
    toolName: text("tool_name").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("agent_capabilities_agent_tool_unique").on(table.agentId, table.toolName),
    index("agent_capabilities_agent_id_idx").on(table.agentId),
    index("agent_capabilities_risk_level_idx").on(table.riskLevel)
  ]
);

export const builtInAgents = pgTable(
  "built_in_agents",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull(),
    purpose: text("purpose").notNull(),
    privacyLevel: agentPrivacyLevelEnum("privacy_level").notNull(),
    riskLevel: riskLevelEnum("risk_level").notNull(),
    usageMeter: text("usage_meter").notNull(),
    monetizationTier: text("monetization_tier").notNull(),
    implementationStatus: builtInAgentStatusEnum("implementation_status").notNull(),
    recommended: boolean("recommended").default(false).notNull(),
    bestFor: jsonb("best_for").$type<string[]>().default([]).notNull(),
    inputRequirements: jsonb("input_requirements").$type<string[]>().default([]).notNull(),
    connectionRequirements: jsonb("connection_requirements").$type<string[]>().default([]).notNull(),
    requiredPermissions: jsonb("required_permissions").$type<string[]>().default([]).notNull(),
    requiredCapabilities: jsonb("required_capabilities").$type<string[]>().default([]).notNull(),
    approvalRequirements: jsonb("approval_requirements").$type<string[]>().default([]).notNull(),
    securityNotes: jsonb("security_notes").$type<string[]>().default([]).notNull(),
    deploymentModes: jsonb("deployment_modes").$type<string[]>().default([]).notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("built_in_agents_status_idx").on(table.implementationStatus),
    index("built_in_agents_risk_level_idx").on(table.riskLevel),
    index("built_in_agents_monetization_tier_idx").on(table.monetizationTier)
  ]
);

export const agentProducts = pgTable(
  "agent_products",
  {
    id: text("id").primaryKey(),
    builtInAgentId: text("built_in_agent_id")
      .notNull()
      .references(() => builtInAgents.id, { onDelete: "cascade" }),
    productKey: text("product_key").notNull(),
    requiredPlanKey: text("required_plan_key").notNull(),
    trialSupported: boolean("trial_supported").default(false).notNull(),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("agent_products_product_key_unique").on(table.productKey),
    index("agent_products_built_in_agent_id_idx").on(table.builtInAgentId),
    index("agent_products_required_plan_key_idx").on(table.requiredPlanKey)
  ]
);
