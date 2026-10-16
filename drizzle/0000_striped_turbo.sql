CREATE TABLE `gmail_connections` (
	`owner` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`encrypted_tokens` text NOT NULL,
	`expires_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gmail_oauth_states` (
	`state_hash` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`cookie_hash` text NOT NULL,
	`encrypted_verifier` text NOT NULL,
	`expires_at` integer NOT NULL,
	`claimed` integer DEFAULT 0 NOT NULL
);
