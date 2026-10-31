import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseModulePreferences,moduleRoute,moduleEnabled} from '../src/module-preferences.ts';
import {colorfulLifePage} from '../src/life.ts';
test('optional modules retain explicit off values and discard unknown settings',()=>{
  const prefs=parseModulePreferences('{"version":1,"investment":false,"life":false,"secret":"discard"}');
  assert.deepEqual(prefs,{version:1,investment:false,life:false});
  assert.equal(moduleEnabled('growth',prefs),true);assert.equal(moduleRoute('investment',prefs),'settings');assert.equal(moduleRoute('life',prefs),'settings');
});
test('invalid optional preferences recover without coercing strings or hiding core modules',()=>{
  for(const raw of [null,'bad','null','[]','{"version":99}','{"version":1,"investment":"false","life":0}'])assert.deepEqual(parseModulePreferences(raw),{version:1,investment:true,life:true});
  const prefs=parseModulePreferences('{"version":1,"investment":true,"life":false}');
  assert.equal(moduleRoute('investment',prefs),'investment');assert.equal(moduleRoute('life',prefs),'settings');assert.equal(moduleRoute('unexpected',prefs),'today');
  for(const route of ['today','growth','mail','history','settings'])assert.equal(moduleRoute(route,prefs),route);
});
test('colorful life preserves the user motto and marks its initial content scope',()=>{
  const html=colorfulLifePage();assert.ok(html.includes('人的创造性是本质的，人的社会化是必然的。'));assert.match(html,/内容待完善/);assert.match(html,/自己的节奏/);
});
