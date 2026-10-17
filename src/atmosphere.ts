// A local, bounded canvas: daylight, wind-borne dust and reflected water.
// It never reads journal content or sends pointer positions anywhere.
type AtmosphereState = { enabled: boolean; paused: boolean; skin: string };
const seed = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export function createAtmosphere(host: HTMLElement, signal: AbortSignal) {
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let state: AtmosphereState = { enabled: false, paused: true, skin: 'island' };
  let width = 0, height = 0, ratio = 1, time = 14, raf = 0, last = 0;
  let compact = false, cool = '#7398d9', warm = '#c89b62', water = '#89b7bb';
  let pointer = { x: -1000, y: -1000 }, breeze = { x: -1000, y: -1000 };
  let ripple: { x: number; y: number; born: number } | undefined;
  let sprites: HTMLCanvasElement[] = [];

  function makeSprites() {
    sprites = [cool, warm, water].map(color => {
      const tile = document.createElement('canvas'); tile.width = tile.height = 48;
      const brush = tile.getContext('2d');
      if (brush) {
        const glow = brush.createRadialGradient(24, 24, 0, 24, 24, 24);
        glow.addColorStop(0, color); glow.addColorStop(.13, color);
        glow.addColorStop(1, 'transparent');
        brush.fillStyle = glow; brush.fillRect(0, 0, 48, 48);
      }
      return tile;
    });
  }
  function resize() {
    const box = host.getBoundingClientRect();
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    compact = width <= 640;
    ratio = Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    paint();
  }
  function light(x: number, y: number, radius: number, color: string, alpha: number) {
    if (!ctx) return;
    const wash = ctx.createRadialGradient(x, y, 0, x, y, radius);
    wash.addColorStop(0, color); wash.addColorStop(1, 'transparent');
    ctx.globalAlpha = alpha; ctx.fillStyle = wash;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function paint() {
    if (!ctx || !state.enabled || !width) return;
    ctx.clearRect(0, 0, width, height);
    // Slowly moving pools of sunlight; no full-screen blur or compositing effects.
    light(width * (.72 + .12 * Math.sin(time * .075)), height * .2, width * .42, warm, .14);
    light(width * (.2 + .1 * Math.cos(time * .06)), height * .62, width * .44, water, .09);

    // Loose schools of reflected light share a swell, never form a technical grid.
    const bands = compact ? 4 : 6, grains = compact ? 24 : 42;
    for (let band = 0; band < bands; band++) {
      for (let i = 0; i < grains; i++) {
        const n = band * 61 + i;
        const x = ((i / grains + seed(n + 90) * .02 + time * .005) % 1) * (width + 100) - 50;
        const swell = Math.sin(x / width * 5.5 + time * .24 + band * .55);
        const y = height * (.48 + band * .09) + swell * (14 + band * 3) + (seed(n + 62) - .5) * 23;
        const shimmer = .5 + .5 * Math.sin(time * .75 + x * .008 + band);
        ctx.globalAlpha = .09 + shimmer * .2;
        ctx.fillStyle = band % 3 === 0 ? warm : water;
        ctx.beginPath();
        ctx.ellipse(x, y, 1.3 + seed(n + 7) * 2.5, .65 + seed(n + 8), -.22, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Three depths move with a common breeze, with independently curved paths.
    const count = compact ? 64 : 132;
    for (let i = 0; i < count; i++) {
      const depth = .35 + seed(i + 3) * .9;
      const phase = seed(i + 11) * Math.PI * 2;
      let x = ((seed(i + 41) * (width + 160) + time * (3 + depth * 8)) % (width + 160)) - 80;
      let y = seed(i + 77) * height + Math.sin(time * .22 + x * .004 + phase) * 30 * depth;
      x += Math.cos(time * .14 + y * .006 + phase) * 23 * depth;
      const dx = x - breeze.x, dy = y - breeze.y, distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < 150) {
        const drift = (1 - distance / 150) * 24 * depth;
        x += dx / distance * drift; y += dy / distance * drift;
      }
      const breathe = .5 + .5 * Math.sin(time * .6 + phase);
      const size = 2.5 + depth * 4.5;
      ctx.globalAlpha = .18 + breathe * .4;
      ctx.drawImage(sprites[i % 7 === 0 ? 1 : 0], x - size, y - size, size * 2, size * 2);
      // A sparse foreground of turning seed-like flecks catches the light.
      if (i % 13 === 0) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(phase + time * .16);
        ctx.globalAlpha = .2 + breathe * .18; ctx.fillStyle = i % 2 ? warm : cool;
        ctx.beginPath(); ctx.ellipse(0, 0, 3.6 * depth, .8 + Math.abs(Math.sin(time * .3 + phase)), 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    if (ripple) {
      const age = time - ripple.born;
      if (age > 3) ripple = undefined;
      else for (let i = 0; i < 2; i++) {
        const radius = Math.max(0, age * 29 - i * 14);
        ctx.globalAlpha = Math.max(0, 1 - age / 3) * .22;
        ctx.strokeStyle = water; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(ripple.x, ripple.y, radius, radius * .38, -.15, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
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
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (state.enabled && !state.paused && !signal.aborted && ctx) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  window.addEventListener('resize', resize, { signal });
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || state.paused || !state.enabled) return;
    const box = host.getBoundingClientRect();
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    if (breeze.x < 0) breeze = { ...pointer };
  }, { signal, passive: true });
  document.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; }, { signal });
  document.addEventListener('pointerdown', event => {
    if (state.paused || !state.enabled || !(event.target instanceof HTMLElement)) return;
    if (event.target.closest('a,button,input,select,textarea,label,article,section,dialog,.growth-content,.sidebar,.topbar')) return;
    const box = host.getBoundingClientRect();
    ripple = { x: event.clientX - box.left, y: event.clientY - box.top, born: time };
  }, { signal, passive: true });
  signal.addEventListener('abort', () => { cancelAnimationFrame(raf); canvas.remove(); }, { once: true });
  return {
    update(next: AtmosphereState) {
      const skinChanged = next.skin !== state.skin || !sprites.length;
      state = next;
      if (skinChanged) {
        const style = getComputedStyle(document.documentElement);
        cool = style.getPropertyValue('--particle').trim() || cool;
        warm = style.getPropertyValue('--atmosphere-sun').trim() || warm;
        water = style.getPropertyValue('--atmosphere-water').trim() || water;
        makeSprites();
      }
      const box = host.getBoundingClientRect();
      if (box.width !== width || box.height !== height || !canvas.width) resize();
      else paint();
      schedule();
    },
  };
}
