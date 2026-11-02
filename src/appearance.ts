import { createAtmosphere } from './atmosphere.ts';

export const skins = [
  { id: 'island', name: '光屿工作台' },
  { id: 'observatory', name: '对页观察室' },
] as const;
type Skin = typeof skins[number]['id'];
export type Appearance = { version: 2; skin: Skin; particles: boolean };
const storageKey = 'lifeatlas-appearance-v1';
export function parseAppearance(raw: string | null): Appearance {
  try {
    const value = JSON.parse(raw || 'null');
    if (value?.version === 2 && skins.some(s => s.id === value.skin)) {
      return { version: 2, skin: value.skin, particles: value.particles !== false };
    }
    if (value?.version === 1 && ['daylight', 'orbit', 'habitat'].includes(value.skin)) return { version: 2, skin: 'island', particles: value.particles !== false };
  } catch { /* Invalid preferences fall back to the chosen light skin. */ }
  return { version: 2, skin: 'island', particles: true };
}
export function appearanceControls() {
  return `<div class="appearance-controls"><label class="skin-control"><span>皮肤</span><select data-appearance="skin" aria-label="选择皮肤">${skins.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></label><label class="particle-control"><input type="checkbox" data-appearance="particles"><span class="la-switch-track" aria-hidden="true"><span class="la-switch-knob"></span></span><span>动态星空</span></label></div>`;
}
export function appearanceSettings() {
  return `<section class="settings-section appearance-section"><h2>外观与动态</h2><p class="muted">同一片深空，两种阅读色调。星云缓慢流动，星光轻轻闪烁。</p>${appearanceControls()}<p class="appearance-status" role="status" data-appearance-status></p><p class="growth-help">全局星空由本机代码绘制，无需下载视频或连接付费服务。输入时暂停，关闭动态后保留静态星空，也遵循系统减少动态设置。偏好保存在此浏览器。</p></section>`;
}
export function mountAppearance() {
  let preferences: Appearance;
  let storageFailed = false;
  let moduleEditing=false;
  try { preferences = parseAppearance(localStorage.getItem(storageKey)); }
  catch { preferences = parseAppearance(null); storageFailed = true; }
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const atmosphere = document.createElement('div');
  atmosphere.className = 'life-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(atmosphere, document.body.firstChild);
  const landscape = createAtmosphere(atmosphere, controller.signal);
  function editing() {
    const active = document.activeElement;
    return active instanceof HTMLElement && active.matches('textarea, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), [contenteditable="true"]');
  }
  function sync() {
    document.documentElement.dataset.skin = preferences.skin;
    atmosphere.hidden=false;
    atmosphere.dataset.paused = String(reduced.matches || document.hidden || editing() || moduleEditing || !preferences.particles);
    landscape.update({ enabled: true, paused: atmosphere.dataset.paused === 'true', skin: preferences.skin });
    document.querySelectorAll('[data-appearance="skin"]').forEach(node => { (node as unknown as HTMLSelectElement).value = preferences.skin; });
    document.querySelectorAll<HTMLInputElement>('[data-appearance="particles"]').forEach(el => { el.checked = preferences.particles; });
    const message = storageFailed ? '浏览器未能保存外观偏好，本次切换仍然生效。' : reduced.matches && preferences.particles ? '系统已启用减少动态，星空保持静止。' : preferences.particles ? '动态星空已开启；输入时暂时静止。' : '动态已关闭，保留静态星空。';
    document.querySelectorAll<HTMLElement>('[data-appearance-status]').forEach(el => { el.textContent = message; });
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); storageFailed = false; }
    catch { storageFailed = true; }
    sync();
  }
  document.addEventListener('change', event => {
    const el = event.target;
    if (el instanceof HTMLSelectElement && el.dataset.appearance === 'skin' && skins.some(s => s.id === el.value)) {
      preferences.skin = el.value as Skin;
      save(); // Keep the live form, focus, scroll and unsaved text intact.
    }
    if (el instanceof HTMLInputElement && el.dataset.appearance === 'particles') { preferences.particles = el.checked; save(); }
  }, { signal: controller.signal });
  window.addEventListener('storage', event => {
    if (event.key === storageKey) { preferences = parseAppearance(event.newValue); sync(); }
  }, { signal: controller.signal });
  document.addEventListener('focusin', sync, { signal: controller.signal });
  document.addEventListener('focusout', () => queueMicrotask(() => { if (!controller.signal.aborted) sync(); }), { signal: controller.signal });
  document.addEventListener('visibilitychange', sync, { signal: controller.signal });
  reduced.addEventListener('change', sync, { signal: controller.signal });
  sync();
  return { sync, setModuleEditing(value:boolean){moduleEditing=value;sync();}, destroy() { controller.abort(); atmosphere.remove(); } };
}
