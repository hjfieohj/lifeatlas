// One viewport-wide particle current, copied into the navigation's background.
// No journal content or pointer coordinates are sent anywhere.
type AtmosphereState = { enabled: boolean; paused: boolean; skin: string };
const seed = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export function createAtmosphere(host: HTMLElement, signal: AbortSignal) {
  const canvas = document.createElement('canvas'); host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const navigationCanvas = document.createElement('canvas');
  navigationCanvas.className = 'navigation-atmosphere'; navigationCanvas.setAttribute('aria-hidden', 'true');
  const navigationCtx = navigationCanvas.getContext('2d');
  let state: AtmosphereState = { enabled: false, paused: true, skin: 'island' };
  let width = 0, height = 0, ratio = 1, time = 14, raf = 0, last = 0;
  let compact = false, paletteReady = false, cool = '#7398d9', warm = '#ceaa71', water = '#72a9b1';
  let pointer = { x: -1000, y: -1000 }, breeze = { ...pointer };
  let navigationBox = { x: 0, y: 0, width: 0, height: 0 };
  function measureNavigation() {
    const box = navigationCanvas.parentElement?.getBoundingClientRect();
    if (!box) return;
    navigationBox = { x: box.left, y: box.top, width: box.width, height: Math.min(box.height, height) };
    const w = Math.max(1, Math.round(navigationBox.width * ratio));
    const h = Math.max(1, Math.round(navigationBox.height * ratio));
    if (navigationCanvas.width !== w) navigationCanvas.width = w;
    if (navigationCanvas.height !== h) navigationCanvas.height = h;
  }
  function paintNavigation() {
    if (!navigationCtx) return;
    navigationCtx.clearRect(0, 0, navigationCanvas.width, navigationCanvas.height);
    const { x, y, width: nw, height: nh } = navigationBox;
    const left = Math.max(0, x), top = Math.max(0, y);
    const right = Math.min(width, x + nw), bottom = Math.min(height, y + nh);
    if (right <= left || bottom <= top) return;
    // Same coordinates and frame, including behind LifeAtlas and navigation.
    navigationCtx.drawImage(canvas, left * ratio, top * ratio, (right - left) * ratio, (bottom - top) * ratio,
      (left - x) * ratio, (top - y) * ratio, (right - left) * ratio, (bottom - top) * ratio);
  }
  function resize() {
    const box = host.getBoundingClientRect();
    width = Math.max(1, box.width); height = Math.max(1, box.height); compact = width <= 640;
    ratio = Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.5, Math.sqrt(2_000_000 / (width * height)));
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0); measureNavigation(); paint();
  }
  function paint() {
    if (!ctx || !state.enabled || !width) return;
    ctx.clearRect(0, 0, width, height);
    // Fine, sharp grains form broad currents rather than floating bokeh.
    // Adjacent streams share a wave, gathering and unfolding like flowing water.
    const bands = compact ? 22 : 30, grains = compact ? 40 : 76;
    for (let band = 0; band < bands; band++) for (let i = 0; i < grains; i++) {
      const n = band * 79 + i;
      let x = ((i / grains + seed(band + 90) * .035 + time * .014) % 1) * (width + 80) - 40;
      const phase = x / width * 5.8 - time * .18;
      let y = (band / (bands - 1) * 1.36 - .18) * height
        + Math.sin(phase + band * .11) * height * .14
        + Math.sin(phase * .53 + band * .24 + time * .09) * height * .1
        + (seed(n + 62) - .5) * 4;
      const dx = x - breeze.x, dy = y - breeze.y, distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < 140) {
        const parting = (1 - distance / 140) * 14;
        x += dx / distance * parting; y += dy / distance * parting;
      }
      const shimmer = .5 + .5 * Math.sin(phase * 1.8 + band * .35 + time * .36);
      ctx.globalAlpha = .17 + shimmer * .38;
      ctx.fillStyle = band % 9 === 0 ? warm : band % 3 === 0 ? water : cool;
      ctx.beginPath(); ctx.arc(x, y, .65 + seed(n + 7) * .55, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; paintNavigation();
  }
  function frame(now: number) {
    raf = 0;
    if (!state.enabled || state.paused || signal.aborted) return;
    const elapsed = now - last;
    if (elapsed >= (compact ? 1000 / 24 : 1000 / 30)) {
      time += Math.min(elapsed / 1000, .1); last = now;
      if (pointer.x < 0) breeze = { ...pointer };
      else { breeze.x += (pointer.x - breeze.x) * .09; breeze.y += (pointer.y - breeze.y) * .09; }
      paint();
    }
    raf = requestAnimationFrame(frame);
  }
  function schedule() {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (state.enabled && !state.paused && !signal.aborted && ctx) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  window.addEventListener('resize', resize, { signal });
  document.addEventListener('scroll', () => { measureNavigation(); if (state.enabled) paintNavigation(); }, { signal, passive: true });
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || state.paused || !state.enabled) return;
    const box = host.getBoundingClientRect(); pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    if (breeze.x < 0) breeze = { ...pointer };
  }, { signal, passive: true });
  document.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; }, { signal });
  signal.addEventListener('abort', () => { cancelAnimationFrame(raf); canvas.remove(); navigationCanvas.remove(); }, { once: true });
  return { update(next: AtmosphereState) {
    const skinChanged = next.skin !== state.skin || !paletteReady; state = next;
    const navigation = document.querySelector<HTMLElement>('.sidebar');
    if (navigation && navigationCanvas.parentElement !== navigation) navigation.insertBefore(navigationCanvas, navigation.firstChild);
    navigationCanvas.hidden = !next.enabled;
    if (skinChanged) {
      const style = getComputedStyle(document.documentElement);
      cool = style.getPropertyValue('--particle').trim() || cool;
      warm = style.getPropertyValue('--atmosphere-sun').trim() || warm;
      water = style.getPropertyValue('--atmosphere-water').trim() || water; paletteReady = true;
    }
    measureNavigation();
    const box = host.getBoundingClientRect();
    if (box.width !== width || box.height !== height || !canvas.width) resize(); else paint();
    schedule();
  } };
}
