// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const gmailConnections = sqliteTable('gmail_connections', {
  owner: text('owner').primaryKey(),
  email: text('email').notNull(),
  encryptedTokens: text('encrypted_tokens').notNull(),
  expiresAt: integer('expires_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
export const gmailOAuthStates = sqliteTable('gmail_oauth_states', {
  stateHash: text('state_hash').primaryKey(),
  owner: text('owner').notNull(),
  cookieHash: text('cookie_hash').notNull(),
  encryptedVerifier: text('encrypted_verifier').notNull(),
  expiresAt: integer('expires_at').notNull(),
  claimed: integer('claimed').notNull().default(0),
});
