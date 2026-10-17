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
    // Three composed silk-like currents: a distant ridge, a folded middle
    // passage and a low reflection. Deliberate negative space replaces noise.
    const pigment = ctx.createLinearGradient(0, 0, width, height * .4);
    pigment.addColorStop(0, cool); pigment.addColorStop(.54, water); pigment.addColorStop(1, warm);
    ctx.fillStyle = pigment; ctx.strokeStyle = pigment;
    const strands = compact ? 10 : 14, grains = compact ? 54 : 88;
    function point(u: number, strand: number, river: number) {
      let x = (u * 1.2 - .1) * width;
      const swell = river === 0 ? .06 + .25 * u + .16 * Math.sin(u * 6 - time * .06)
        : river === 1 ? .48 + .19 * u - .2 * Math.sin(u * 4.8 + .7 + time * .04)
        : .86 - .25 * u + .15 * Math.sin(u * 5 + time * .05);
      const spread = (.25 + Math.sin(u * Math.PI) ** 2) * height * .12;
      const fold = Math.cos(u * 5.5 + river + time * .08);
      let y = swell * height + strand * spread * fold;
      const dx = x - breeze.x, dy = y - breeze.y, distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < 150) {
        const parting = (1 - distance / 150) * 10;
        x += dx / distance * parting; y += dy / distance * parting;
      }
      return { x, y };
    }
    // Translucent pigment gives each current a body, like a wash on paper.
    for (let river = 0; river < 3; river++) {
      ctx.globalAlpha = river === 0 ? .1 : .065; ctx.beginPath();
      for (let i = 0; i <= 64; i++) { const p = point(i / 64, .64, river); if (!i) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
      for (let i = 64; i >= 0; i--) { const p = point(i / 64, -.64, river); ctx.lineTo(p.x, p.y); }
      ctx.closePath(); ctx.fill();
    }
    for (let river = 0; river < 3; river++) for (let s = 0; s < strands; s++) {
      const strand = s / (strands - 1) - .5;
      // Hairline contours hold the composition even between moving grains.
      ctx.globalAlpha = river === 0 ? .27 : .18; ctx.lineWidth = .6;
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const p = point(i / 64, strand, river);
        if (!i) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      for (let i = 0; i < grains; i++) {
        const n = river * 1709 + s * 97 + i;
        if (seed(n + 5) < .14) continue;
        const u = (i / grains + seed(s + river * 41) * .16 + time * (.009 + river * .002)) % 1;
        const p = point(u, strand + (seed(n + 17) - .5) * .055, river);
        const envelope = Math.sin(Math.PI * u) ** 2;
        const gleam = .5 + .5 * Math.sin(u * 16 - time * .65 + river * 2);
        ctx.globalAlpha = (.24 + envelope * .56) * (.55 + gleam * .45);
        ctx.beginPath(); ctx.arc(p.x, p.y, .45 + seed(n + 7) * .75, 0, Math.PI * 2); ctx.fill();
      }
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
