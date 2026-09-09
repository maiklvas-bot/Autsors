CREATE TABLE `bot_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`code` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`expires` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `telegram_updates` (
	`id` integer PRIMARY KEY NOT NULL,
	`at` integer NOT NULL
);
