import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAppearance } from '../src/appearance.ts';

test('first visit and corrupt preferences use the owner-selected daylight skin', () => {
  for (const raw of [null, '', '{bad', 'null', '{"version":2,"skin":"orbit"}', '{"version":1,"skin":"unknown"}']) {
    assert.deepEqual(parseAppearance(raw), { version: 1, skin: 'daylight', particles: true });
  }
});
test('saved skin and explicit particle-off survive preference parsing', () => {
  assert.deepEqual(parseAppearance('{"version":1,"skin":"habitat","particles":false,"journal":"discard"}'), { version: 1, skin: 'habitat', particles: false });
});
