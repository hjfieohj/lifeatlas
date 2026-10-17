CREATE TABLE `growth_moments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`topic_id` text NOT NULL,
	`occurred_on` text NOT NULL,
	`kind` text NOT NULL,
	`event` text NOT NULL,
	`observation` text NOT NULL,
	`reflection` text NOT NULL,
	`action` text NOT NULL,
	`feedback` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`version` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `growth_moments_timeline` ON `growth_moments` (`owner`,`topic_id`,`occurred_on`,`id`);--> statement-breakpoint
CREATE TABLE `growth_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`entity_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`kind` text NOT NULL,
	`version` integer NOT NULL,
	`snapshot` text NOT NULL,
	`saved_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `growth_revision_version` ON `growth_revisions` (`kind`,`entity_id`,`version`);--> statement-breakpoint
CREATE INDEX `growth_revisions_owner` ON `growth_revisions` (`owner`,`topic_id`);--> statement-breakpoint
CREATE TABLE `growth_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`baseline` text NOT NULL,
	`direction` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`version` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `growth_topics_owner` ON `growth_topics` (`owner`,`created_at`);