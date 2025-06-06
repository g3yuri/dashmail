CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`email_id` text NOT NULL,
	`name` text NOT NULL,
	`content_type` text NOT NULL,
	`content_length` integer NOT NULL,
	`content` text,
	`content_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `attachments_email_id_idx` ON `attachments` (`email_id`);--> statement-breakpoint
CREATE TABLE `email_labels` (
	`id` text PRIMARY KEY NOT NULL,
	`email_id` text NOT NULL,
	`label_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `email_labels_email_id_idx` ON `email_labels` (`email_id`);--> statement-breakpoint
CREATE INDEX `email_labels_label_id_idx` ON `email_labels` (`label_id`);--> statement-breakpoint
CREATE INDEX `email_labels_unique_idx` ON `email_labels` (`email_id`,`label_id`);--> statement-breakpoint
CREATE TABLE `emails` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`subject` text NOT NULL,
	`from_email` text NOT NULL,
	`from_name` text,
	`to_email` text NOT NULL,
	`text_body` text,
	`html_body` text,
	`summary` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	`received_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `emails_message_id_unique` ON `emails` (`message_id`);--> statement-breakpoint
CREATE INDEX `emails_user_id_idx` ON `emails` (`user_id`);--> statement-breakpoint
CREATE INDEX `emails_message_id_idx` ON `emails` (`message_id`);--> statement-breakpoint
CREATE INDEX `emails_status_idx` ON `emails` (`status`);--> statement-breakpoint
CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `labels_user_id_idx` ON `labels` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `webhook_config` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`webhook_url` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_processed_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `webhook_config_user_id_idx` ON `webhook_config` (`user_id`);