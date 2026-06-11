import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { workspaces } from "./identity";

export const plans = pgTable(
  "plans",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    audience: text("audience").notNull(),
    summary: text("summary").notNull(),
    priceLabel: text("price_label").notNull(),
    recommended: boolean("recommended").default(false).notNull(),
    status: text("status").default("active").notNull(),
    publicRank: integer("public_rank").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("plans_key_unique").on(table.key),
    index("plans_status_rank_idx").on(table.status, table.publicRank)
  ]
);

export const planLimits = pgTable(
  "plan_limits",
  {
    id: text("id").primaryKey(),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    meterKey: text("meter_key").notNull(),
    limitValue: integer("limit_value"),
    unitLabel: text("unit_label").notNull(),
    hardLimit: boolean("hard_limit").default(true).notNull(),
    period: text("period").default("monthly").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("plan_limits_plan_meter_period_unique").on(table.planId, table.meterKey, table.period),
    index("plan_limits_meter_key_idx").on(table.meterKey)
  ]
);

export const usageCounters = pgTable(
  "usage_counters",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
    meterKey: text("meter_key").notNull(),
    periodStart: timestamp("period_start", { mode: "string", withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { mode: "string", withTimezone: true }).notNull(),
    used: integer("used").default(0).notNull(),
    limitValue: integer("limit_value"),
    hardLimit: boolean("hard_limit").default(true).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    uniqueIndex("usage_counters_workspace_meter_period_unique").on(table.workspaceId, table.meterKey, table.periodStart),
    index("usage_counters_workspace_id_idx").on(table.workspaceId),
    index("usage_counters_project_id_idx").on(table.projectId),
    index("usage_counters_meter_lookup_idx").on(table.workspaceId, table.meterKey, table.periodStart)
  ]
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    description: text("description").notNull(),
    sourceType: text("source_type").notNull(),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("entitlements_key_unique").on(table.key),
    index("entitlements_status_idx").on(table.status)
  ]
);

export const workspaceEntitlements = pgTable(
  "workspace_entitlements",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    entitlementId: text("entitlement_id")
      .notNull()
      .references(() => entitlements.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    status: text("status").default("active").notNull(),
    expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("workspace_entitlements_workspace_entitlement_unique").on(table.workspaceId, table.entitlementId),
    index("workspace_entitlements_workspace_id_idx").on(table.workspaceId),
    index("workspace_entitlements_entitlement_id_idx").on(table.entitlementId),
    index("workspace_entitlements_status_idx").on(table.status)
  ]
);

export const featureFlags = pgTable(
  "feature_flags",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    description: text("description").notNull(),
    defaultState: boolean("default_state").default(false).notNull(),
    scope: text("scope").default("workspace").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("feature_flags_key_unique").on(table.key),
    index("feature_flags_scope_idx").on(table.scope)
  ]
);
