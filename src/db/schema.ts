import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

// Tabla de usuarios (integración con Clerk)
export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: int("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tabla de etiquetas
export const labelsTable = sqliteTable("labels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  filter: text("filter"), // Filtro automático opcional
  promptFilter: text("prompt_filter"), // Filtro por prompt opcional
  createdAt: int("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tabla de correos electrónicos
export const emailsTable = sqliteTable("emails", {
  id: text("id").primaryKey(),
  messageId: text("message_id").notNull().unique(), // ID del mensaje desde Postmark
  subject: text("subject").notNull(),
  fromEmail: text("from_email").notNull(),
  fromName: text("from_name"),
  toEmail: text("to_email").notNull(),
  textBody: text("text_body"),
  htmlBody: text("html_body"),
  summary: text("summary"), // Resumen generado automáticamente
  aiSummary: text("ai_summary"), // Resumen generado por IA
  status: text("status").notNull().default("pending"), // pending, in-progress, completed, reviewed
  archived: int("archived", { mode: 'boolean' }).notNull().default(false),
  receivedAt: int("received_at", { mode: 'timestamp' }).notNull(),
  createdAt: int("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  messageIdIdx: index("emails_message_id_idx").on(table.messageId),
  statusIdx: index("emails_status_idx").on(table.status),
}));

// Tabla de relación muchos a muchos entre correos y etiquetas
export const emailLabelsTable = sqliteTable("email_labels", {
  id: text("id").primaryKey(),
  emailId: text("email_id").notNull().references(() => emailsTable.id, { onDelete: 'cascade' }),
  labelId: text("label_id").notNull().references(() => labelsTable.id, { onDelete: 'cascade' }),
  createdAt: int("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  emailIdIdx: index("email_labels_email_id_idx").on(table.emailId),
  labelIdIdx: index("email_labels_label_id_idx").on(table.labelId),
  uniqueEmailLabel: index("email_labels_unique_idx").on(table.emailId, table.labelId),
}));

// Tabla de adjuntos
export const attachmentsTable = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  emailId: text("email_id").notNull().references(() => emailsTable.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(),
  contentLength: int("content_length").notNull(),
  content: text("content"), // Base64 encoded content
  contentId: text("content_id"), // Para inline attachments
  createdAt: int("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  emailIdIdx: index("attachments_email_id_idx").on(table.emailId),
}));

// Tabla de configuración del webhook
export const webhookConfigTable = sqliteTable("webhook_config", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  webhookUrl: text("webhook_url").notNull(),
  isActive: int("is_active", { mode: 'boolean' }).notNull().default(true),
  lastProcessedAt: int("last_processed_at", { mode: 'timestamp' }),
  createdAt: int("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("webhook_config_user_id_idx").on(table.userId),
}));