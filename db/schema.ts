// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
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
export const growthTopics = sqliteTable('growth_topics', {
  id: text('id').primaryKey(), owner: text('owner').notNull(),
  title: text('title').notNull(), baseline: text('baseline').notNull(), direction: text('direction').notNull(),
  environmentProfile: text('environment_profile').notNull().default('{}'),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
  version: integer('version').notNull(), deleted: integer('deleted').notNull().default(0),
}, t => [index('growth_topics_owner').on(t.owner, t.createdAt)]);
export const growthMoments = sqliteTable('growth_moments', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), topicId: text('topic_id').notNull(),
  occurredOn: text('occurred_on').notNull(), kind: text('kind').notNull(),
  event: text('event').notNull(), observation: text('observation').notNull(), reflection: text('reflection').notNull(),
  action: text('action').notNull(), feedback: text('feedback').notNull(),
  context: text('context').notNull().default('{}'),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
  version: integer('version').notNull(), deleted: integer('deleted').notNull().default(0),
}, t => [index('growth_moments_timeline').on(t.owner, t.topicId, t.occurredOn, t.id)]);
export const growthRevisions = sqliteTable('growth_revisions', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), entityId: text('entity_id').notNull(),
  topicId: text('topic_id').notNull(), kind: text('kind').notNull(), version: integer('version').notNull(),
  snapshot: text('snapshot').notNull(), savedAt: integer('saved_at').notNull(),
}, t => [uniqueIndex('growth_revision_version').on(t.kind, t.entityId, t.version), index('growth_revisions_owner').on(t.owner, t.topicId)]);
