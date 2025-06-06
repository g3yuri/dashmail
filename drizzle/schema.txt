import { sqliteTable, AnySQLiteColumn, index, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const attachments = sqliteTable("attachments", {
	id: text().primaryKey().notNull(),
	emailId: text("email_id").notNull().references(() => emails.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	contentType: text("content_type").notNull(),
	contentLength: integer("content_length").notNull(),
	content: text(),
	contentId: text("content_id"),
	createdAt: integer("created_at").notNull(),
},
(table) => [
	index("attachments_email_id_idx").on(table.emailId),
]);

export const emailLabels = sqliteTable("email_labels", {
	id: text().primaryKey().notNull(),
	emailId: text("email_id").notNull().references(() => emails.id, { onDelete: "cascade" } ),
	labelId: text("label_id").notNull().references(() => labels.id, { onDelete: "cascade" } ),
	createdAt: integer("created_at").notNull(),
},
(table) => [
	index("email_labels_unique_idx").on(table.emailId, table.labelId),
	index("email_labels_label_id_idx").on(table.labelId),
	index("email_labels_email_id_idx").on(table.emailId),
]);

export const emails = sqliteTable("emails", {
	id: text().primaryKey().notNull(),
	messageId: text("message_id").notNull(),
	subject: text().notNull(),
	fromEmail: text("from_email").notNull(),
	fromName: text("from_name"),
	toEmail: text("to_email").notNull(),
	textBody: text("text_body"),
	htmlBody: text("html_body"),
	summary: text(),
	status: text().default("pending").notNull(),
	archived: integer().default(false).notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	receivedAt: integer("received_at").notNull(),
	createdAt: integer("created_at").notNull(),
},
(table) => [
	index("emails_status_idx").on(table.status),
	index("emails_message_id_idx").on(table.messageId),
	index("emails_user_id_idx").on(table.userId),
	uniqueIndex("emails_message_id_unique").on(table.messageId),
]);

export const labels = sqliteTable("labels", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	color: text().notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	createdAt: integer("created_at").notNull(),
	filter: text(),
	promptFilter: text("prompt_filter"),
},
(table) => [
	index("labels_user_id_idx").on(table.userId),
]);

export const users = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	imageUrl: text("image_url"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

export const webhookConfig = sqliteTable("webhook_config", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	webhookUrl: text("webhook_url").notNull(),
	isActive: integer("is_active").default(true).notNull(),
	lastProcessedAt: integer("last_processed_at"),
	createdAt: integer("created_at").notNull(),
},
(table) => [
	index("webhook_config_user_id_idx").on(table.userId),
]);

