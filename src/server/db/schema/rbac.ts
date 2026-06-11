import { boolean, index, integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users, workspaces } from "./identity";

export const roleNameEnum = pgEnum("role_name", ["Founder/Admin", "AI Engineer", "QA Reviewer", "Security Reviewer", "Product Manager", "Viewer"]);
export const memberStatusEnum = pgEnum("workspace_member_status", ["active", "invited", "disabled"]);

export const roles = pgTable(
  "roles",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: roleNameEnum("name").notNull(),
    description: text("description").notNull(),
    isSystem: boolean("is_system").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("roles_workspace_name_unique").on(table.workspaceId, table.name),
    index("roles_workspace_id_idx").on(table.workspaceId)
  ]
);

export const permissions = pgTable(
  "permissions",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("permissions_key_unique").on(table.key),
    index("permissions_category_idx").on(table.category)
  ]
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    index("role_permissions_permission_id_idx").on(table.permissionId)
  ]
);

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    status: memberStatusEnum("status").default("active").notNull(),
    joinedAt: timestamp("joined_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    uniqueIndex("workspace_members_workspace_user_unique").on(table.workspaceId, table.userId),
    index("workspace_members_workspace_id_idx").on(table.workspaceId),
    index("workspace_members_user_id_idx").on(table.userId),
    index("workspace_members_role_id_idx").on(table.roleId)
  ]
);
