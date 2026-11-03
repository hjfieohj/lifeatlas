import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAppearance, defaultGlass } from '../src/appearance.ts';

test('first visit and corrupt preferences use the approved island skin', () => {
  for (const raw of [null, '', '{bad', 'null', '{"version":2,"skin":"orbit"}', '{"version":1,"skin":"unknown"}']) {
    assert.deepEqual(parseAppearance(raw), { version: 2, skin: 'island', particles: true, ...defaultGlass });
  }
});
test('saved skin and explicit particle-off survive preference parsing', () => {
  assert.deepEqual(parseAppearance('{"version":2,"skin":"observatory","particles":false,"journal":"discard"}'), { version: 2, skin: 'observatory', particles: false, ...defaultGlass });
});
test('all retired skins migrate without re-enabling the particle preference', () => {
  for (const skin of ['daylight', 'orbit', 'habitat']) assert.deepEqual(parseAppearance(JSON.stringify({version:1,skin,particles:false})), {version:2,skin:'island',particles:false,...defaultGlass});
});
test('glass preferences retain zero, clamp out-of-range values and reject non-numeric storage', () => {
  const read=(values:object)=>parseAppearance(JSON.stringify({version:2,skin:'observatory',...values}));
  assert.deepEqual(read({transparency:0,blur:0}),{version:2,skin:'observatory',particles:true,transparency:0,blur:0});
  assert.equal(read({transparency:999,blur:999}).transparency,65);
  assert.equal(read({transparency:999,blur:999}).blur,40);
  assert.equal(read({transparency:-5,blur:-1}).transparency,0);
  assert.equal(read({transparency:-5,blur:-1}).blur,0);
  assert.equal(read({transparency:'65',blur:null}).transparency,defaultGlass.transparency);
  assert.equal(read({transparency:'65',blur:null}).blur,defaultGlass.blur);
  assert.equal(read({transparency:42.4,blur:12.6}).transparency,42);
  assert.equal(read({transparency:42.4,blur:12.6}).blur,13);
});
