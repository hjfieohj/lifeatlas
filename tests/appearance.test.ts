import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAppearance } from '../src/appearance.ts';

test('first visit and corrupt preferences use the approved island skin', () => {
  for (const raw of [null, '', '{bad', 'null', '{"version":2,"skin":"orbit"}', '{"version":1,"skin":"unknown"}']) {
    assert.deepEqual(parseAppearance(raw), { version: 2, skin: 'island', particles: true });
  }
});
test('saved skin and explicit particle-off survive preference parsing', () => {
  assert.deepEqual(parseAppearance('{"version":2,"skin":"observatory","particles":false,"journal":"discard"}'), { version: 2, skin: 'observatory', particles: false });
});
test('all retired skins migrate without re-enabling the particle preference', () => {
  for (const skin of ['daylight', 'orbit', 'habitat']) assert.deepEqual(parseAppearance(JSON.stringify({version:1,skin,particles:false})), {version:2,skin:'island',particles:false});
});
