import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedStore, prepare, prepareRestore, execute, reconcile, cancel, quietNow, OWNER } from '../src/domain.ts';

test('protected and personal action mail cannot enter a bulk task', () => {
  const s = seedStore();
  assert.throws(() => prepare(s, OWNER, ['m1', 'm8']));
  assert.throws(() => prepare(s, OWNER, ['m7']));
  assert.equal(s.tasks.length, 0);
});
test('archive preserves UNREAD; restore is a new task and restores inbox only', () => {
  const s = seedStore(); s.writeEnabled = true;
  const before = [...s.mails[1].labels]; const task = prepare(s, OWNER, ['m2'], 100);
  execute(s, OWNER, task.id, 101);
  assert.deepEqual(s.mails[1].labels, ['UNREAD']);
  const restore = prepareRestore(s, OWNER, task.id, 102);
  execute(s, OWNER, restore.id, 103);
  assert.deepEqual([...s.mails[1].labels].sort(), before.sort());
  assert.equal(task.kind, 'archive'); assert.equal(s.tasks.length, 2);
  assert.throws(() => prepareRestore(s, OWNER, task.id));
});
test('no write without permission, confirmation, owner, or valid lifetime', () => {
  const s = seedStore(); const t = prepare(s, OWNER, ['m1'], 100);
  assert.throws(() => execute(s, OWNER, t.id, 101));
  s.writeEnabled = true;
  assert.throws(() => execute(s, 'other', t.id, 101));
  assert.throws(() => execute(s, OWNER, 'missing', 101));
  assert.throws(() => execute(s, OWNER, t.id, 400000));
  assert.deepEqual(s.mails[0].labels, ['INBOX']);
});
test('stale confirmation prevents the complete batch before changing anything', () => {
  const s = seedStore(); s.writeEnabled = true;
  const t = prepare(s, OWNER, ['m1', 'm2'], 100);
  s.mails[1].revision++;
  assert.throws(() => execute(s, OWNER, t.id, 101));
  assert.ok(s.mails[0].labels.includes('INBOX'));
});
test('duplicate execution is idempotent and duplicate selection is deduplicated', () => {
  const s = seedStore(); s.writeEnabled = true; const t = prepare(s, OWNER, ['m1', 'm1'], 100);
  execute(s, OWNER, t.id, 101); execute(s, OWNER, t.id, 102);
  assert.equal(t.items.length, 1); assert.equal(s.mails[0].revision, 2);
});
test('partial failure records per-mail outcomes and recovery restores successes only', () => {
  const s = seedStore(); s.writeEnabled = true; const t = prepare(s, OWNER, ['m1', 'm2'], 100);
  execute(s, OWNER, t.id, 101, 'partial');
  assert.equal(t.status, 'partial'); assert.ok(s.mails[0].labels.includes('INBOX'));
  const r = prepareRestore(s, OWNER, t.id, 102); assert.deepEqual(r.items.map(i => i.mailId), ['m2']);
});
test('lost response cannot trigger replay; reconciliation verifies the existing result', () => {
  const s = seedStore(); s.writeEnabled = true; const t = prepare(s, OWNER, ['m1'], 100);
  execute(s, OWNER, t.id, 101, 'unknown'); execute(s, OWNER, t.id, 102);
  assert.equal(t.status, 'unknown'); assert.equal(s.mails[0].revision, 2);
  reconcile(s, OWNER, t.id); assert.equal(t.status, 'succeeded'); assert.equal(s.mails[0].revision, 2);
});
test('restore refuses concurrent label edits and disconnected account blocks execution', () => {
  const s = seedStore(); s.writeEnabled = true; const t = prepare(s, OWNER, ['m1'], 100);
  execute(s, OWNER, t.id, 101); s.mails[0].labels.push('STARRED');
  assert.throws(() => prepareRestore(s, OWNER, t.id, 102));
  s.connected = false; assert.throws(() => prepare(s, OWNER, ['m2']));
});
test('quiet hours handle midnight, start/end boundaries, and selected timezone', () => {
  const p = seedStore().preferences;
  assert.equal(quietNow(p, new Date('2026-10-17T14:00:00Z')), true);
  assert.equal(quietNow(p, new Date('2026-10-18T00:00:00Z')), false);
  assert.equal(quietNow(p, new Date('2026-10-17T04:00:00Z')), false);
});
test('cancelled confirmation cannot subsequently execute', () => {
  const s = seedStore(); s.writeEnabled = true; const t = prepare(s, OWNER, ['m1']);
  cancel(s, OWNER, t.id); execute(s, OWNER, t.id);
  assert.equal(t.status, 'cancelled'); assert.ok(s.mails[0].labels.includes('INBOX'));
});
