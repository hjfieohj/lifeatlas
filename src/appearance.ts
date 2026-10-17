export const skins = [
  { id: 'daylight', name: '晨光 · 生活静室' },
  { id: 'orbit', name: '星夜 · 成长轨迹' },
  { id: 'habitat', name: '石墨 · 生活舱' },
] as const;
type Skin = typeof skins[number]['id'];
export type Appearance = { version: 1; skin: Skin; particles: boolean };
const storageKey = 'lifeatlas-appearance-v1';
export function parseAppearance(raw: string | null): Appearance {
  try {
    const value = JSON.parse(raw || 'null');
    if (value?.version === 1 && skins.some(s => s.id === value.skin)) {
      return { version: 1, skin: value.skin, particles: value.particles !== false };
    }
  } catch { /* Invalid preferences fall back to the chosen light skin. */ }
  return { version: 1, skin: 'daylight', particles: true };
}
export function appearanceControls() {
  return `<div class="appearance-controls"><label class="skin-control"><span>皮肤</span><select data-appearance="skin" aria-label="选择皮肤">${skins.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></label><label class="particle-control"><input type="checkbox" data-appearance="particles"><span>粒子动态</span></label></div>`;
}
export function appearanceSettings() {
  return `<section class="settings-section appearance-section"><h2>外观与动态</h2><p class="muted">三套皮肤，随时切换。外观偏好保存在这台浏览器。</p>${appearanceControls()}<p class="appearance-status" role="status" data-appearance-status></p><p class="growth-help">输入文字时，粒子会暂时静止；也会遵循系统的减少动态设置。</p></section>`;
}
export function mountAppearance() {
  let preferences: Appearance;
  let storageFailed = false;
  try { preferences = parseAppearance(localStorage.getItem(storageKey)); }
  catch { preferences = parseAppearance(null); storageFailed = true; }
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const atmosphere = document.createElement('div');
  atmosphere.className = 'life-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  // Stable positions and long independent periods keep the field quiet.
  for (let i = 0; i < 32; i++) {
    const dot = document.createElement('i');
    dot.style.cssText = `--x:${(i * 37 + 11) % 100}%;--y:${(i * 61 + 7) % 100}%;--duration:${78 + (i * 13) % 53}s;--delay:-${i * 7}s;--size:${i % 5 === 0 ? 3 : 2}px`;
    atmosphere.appendChild(dot);
  }
  document.body.insertBefore(atmosphere, document.body.firstChild);
  function editing() {
    const active = document.activeElement;
    return active instanceof HTMLElement && active.matches('textarea, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), [contenteditable="true"]');
  }
  function sync() {
    document.documentElement.dataset.skin = preferences.skin;
    atmosphere.hidden = !preferences.particles;
    atmosphere.dataset.paused = String(reduced.matches || document.hidden || editing());
    document.querySelectorAll('[data-appearance="skin"]').forEach(node => { (node as unknown as HTMLSelectElement).value = preferences.skin; });
    document.querySelectorAll<HTMLInputElement>('[data-appearance="particles"]').forEach(el => { el.checked = preferences.particles; });
    const message = storageFailed ? '浏览器未能保存外观偏好，本次切换仍然生效。' : reduced.matches && preferences.particles ? '系统已启用减少动态，粒子保持静止。' : preferences.particles ? '粒子动态已开启；输入时暂时静止。' : '粒子背景已关闭。';
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
  return { sync, destroy() { controller.abort(); atmosphere.remove(); } };
}
