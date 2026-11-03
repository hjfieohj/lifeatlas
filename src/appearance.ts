import { createAtmosphere } from './atmosphere.ts';

export const skins = [
  { id: 'island', name: '深空 · 暗色' },
  { id: 'observatory', name: '晴空 · 亮色' },
] as const;
type Skin = typeof skins[number]['id'];
export type Appearance = { version: 2; skin: Skin; particles: boolean; transparency: number; blur: number };
export const defaultGlass = { transparency: 36, blur: 20 } as const;
const bounded = (value:unknown, fallback:number, max:number) => typeof value === 'number' && Number.isFinite(value) ? Math.round(Math.min(max, Math.max(0, value))) : fallback;
const storageKey = 'lifeatlas-appearance-v1';
export function parseAppearance(raw: string | null): Appearance {
  try {
    const value = JSON.parse(raw || 'null');
    if (value?.version === 2 && skins.some(s => s.id === value.skin)) {
      return { version: 2, skin: value.skin, particles: value.particles !== false, transparency: bounded(value.transparency, defaultGlass.transparency, 65), blur: bounded(value.blur, defaultGlass.blur, 40) };
    }
    if (value?.version === 1 && ['daylight', 'orbit', 'habitat'].includes(value.skin)) return { version: 2, skin: 'island', particles: value.particles !== false, ...defaultGlass };
  } catch { /* Invalid preferences fall back to the chosen light skin. */ }
  return { version: 2, skin: 'island', particles: true, ...defaultGlass };
}
export function appearanceControls() {
  return `<div class="appearance-controls"><label class="skin-control"><span>皮肤</span><select data-appearance="skin" aria-label="选择皮肤">${skins.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></label><label class="particle-control"><input type="checkbox" data-appearance="particles"><span class="la-switch-track" aria-hidden="true"><span class="la-switch-knob"></span></span><span>动态背景</span></label></div>`;
}
export function appearanceSettings() {
  return `<section class="settings-section appearance-section"><h2>外观与动态</h2><p class="muted">深空适合夜间沉浸，晴空以蓝天白云陪伴白天阅读。</p>${appearanceControls()}<p class="appearance-status" role="status" data-appearance-status></p><div class="glass-controls" role="group" aria-labelledby="glass-controls-title"><div class="glass-heading"><h3 id="glass-controls-title">玻璃质感</h3><button type="button" class="text-button" data-glass-reset>恢复默认</button></div><p class="muted">让天空透进面板。拖动即可预览，自动保存到本机。</p><label class="glass-slider" for="appearance-transparency"><span>透明度<output for="appearance-transparency" data-glass-value="transparency"></output></span><input id="appearance-transparency" data-appearance="transparency" type="range" min="0" max="65" step="1" value="36" aria-describedby="transparency-help"><small id="transparency-help"><span>实心</span><span>更通透</span></small></label><label class="glass-slider" for="appearance-blur"><span>磨砂强度<output for="appearance-blur" data-glass-value="blur"></output></span><input id="appearance-blur" data-appearance="blur" type="range" min="0" max="40" step="1" value="20" aria-describedby="blur-help"><small id="blur-help"><span>清透</span><span>柔和磨砂</span></small></label><p class="growth-help" data-glass-status>应用到导航、模块面板和知识宇宙阅读区；文字保持清晰。</p><p class="glass-support-note">当前浏览器不支持磨砂效果，面板将使用实心外观。</p></div><p class="growth-help">背景在本机绘制；输入时暂停，也遵循系统减少动态设置。切换皮肤保留当前工作和输入。</p></section>`;
}
export function mountAppearance() {
  let preferences: Appearance;
  let storageFailed = false;
  let moduleEditing=false;
  try { preferences = parseAppearance(localStorage.getItem(storageKey)); }
  catch { preferences = parseAppearance(null); storageFailed = true; }
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const reducedTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
  const atmosphere = document.createElement('div');
  atmosphere.className = 'life-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(atmosphere, document.body.firstChild);
  const landscape = createAtmosphere(atmosphere, controller.signal);
  let landscapeState = '';
  function editing() {
    const active = document.activeElement;
    return active instanceof HTMLElement && active.matches('textarea, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), [contenteditable="true"]');
  }
  function sync() {
    document.documentElement.dataset.skin = preferences.skin;
    document.documentElement.style.setProperty('--panel-opacity', String(reducedTransparency.matches ? 1 : 1 - preferences.transparency / 100));
    document.documentElement.style.setProperty('--panel-blur', (reducedTransparency.matches ? 0 : preferences.blur) + 'px');
    atmosphere.hidden=false;
    atmosphere.dataset.paused = String(reduced.matches || document.hidden || editing() || moduleEditing || !preferences.particles);
    const nextLandscapeState = preferences.skin + '|' + atmosphere.dataset.paused;
    if (landscapeState !== nextLandscapeState) { landscapeState = nextLandscapeState; landscape.update({ enabled: true, paused: atmosphere.dataset.paused === 'true', skin: preferences.skin }); }
    document.querySelectorAll('[data-appearance="skin"]').forEach(node => { (node as unknown as HTMLSelectElement).value = preferences.skin; });
    document.querySelectorAll<HTMLInputElement>('[data-appearance="particles"]').forEach(el => { el.checked = preferences.particles; });
    for (const field of ['transparency', 'blur'] as const) {
      document.querySelectorAll<HTMLInputElement>(`[data-appearance="${field}"]`).forEach(el => { el.value = String(preferences[field]); el.style.setProperty('--range-progress', (preferences[field] / Number(el.max) * 100) + '%'); el.setAttribute('aria-valuetext', preferences[field] + (field === 'transparency' ? '% 透明' : ' 像素磨砂')); });
      document.querySelectorAll<HTMLOutputElement>(`[data-glass-value="${field}"]`).forEach(el => { el.value = preferences[field] + (field === 'transparency' ? '%' : ' px'); });
    }
    document.querySelectorAll('[data-glass-status]').forEach(el => { el.textContent = reducedTransparency.matches ? '系统已启用减少透明效果，当前保持实心；你的玻璃设置仍会保存。' : '应用到导航、模块面板和知识宇宙阅读区；文字保持清晰。'; });
    const message = storageFailed ? '浏览器未能保存外观偏好，本次切换仍然生效。' : reduced.matches && preferences.particles ? '系统已启用减少动态，背景保持静止。' : preferences.particles ? '动态背景已开启；输入时暂时静止。' : '动态已关闭，保留静态背景。';
    document.querySelectorAll<HTMLElement>('[data-appearance-status]').forEach(el => { el.textContent = message; });
    document.dispatchEvent(new CustomEvent('lifeatlas:appearance-change', { detail: { ...preferences, reduceTransparency: reducedTransparency.matches } }));
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
  document.addEventListener('input', event => {
    const el = event.target;
    if (!(el instanceof HTMLInputElement) || !['transparency', 'blur'].includes(el.dataset.appearance || '')) return;
    const field = el.dataset.appearance as 'transparency' | 'blur';
    preferences[field] = bounded(el.valueAsNumber, defaultGlass[field], field === 'transparency' ? 65 : 40);
    save(); // The local storage bridge coalesces disk writes and retains the immediate recovery journal.
  }, { signal: controller.signal });
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-glass-reset]')) return;
    preferences = { ...preferences, ...defaultGlass }; save();
  }, { signal: controller.signal });
  window.addEventListener('storage', event => {
    if (event.key === storageKey) { preferences = parseAppearance(event.newValue); sync(); }
  }, { signal: controller.signal });
  document.addEventListener('focusin', sync, { signal: controller.signal });
  document.addEventListener('focusout', () => queueMicrotask(() => { if (!controller.signal.aborted) sync(); }), { signal: controller.signal });
  document.addEventListener('visibilitychange', sync, { signal: controller.signal });
  reduced.addEventListener('change', sync, { signal: controller.signal });
  reducedTransparency.addEventListener('change', sync, { signal: controller.signal });
  sync();
  return { sync, setModuleEditing(value:boolean){moduleEditing=value;sync();}, destroy() { controller.abort(); atmosphere.remove(); } };
}
