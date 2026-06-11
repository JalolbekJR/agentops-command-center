import { index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["active", "invited", "disabled"]);
export const workspaceStatusEnum = pgEnum("workspace_status", ["active", "paused", "archived"]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    avatarInitials: text("avatar_initials").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    lastActiveAt: timestamp("last_active_at", { mode: "string", withTimezone: true }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_status_idx").on(table.status)
  ]
);

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    planKey: text("plan_key").notNull(),
    status: workspaceStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("workspaces_slug_unique").on(table.slug),
    index("workspaces_plan_key_idx").on(table.planKey),
    index("workspaces_status_idx").on(table.status)
  ]
);
