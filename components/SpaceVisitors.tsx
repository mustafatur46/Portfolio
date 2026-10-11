'use client';

import { useEffect, useRef } from 'react';

type Frame = { x: number; y: number; rot: number; scale?: number };

/**
 * Background easter eggs, rarer than the shooting stars: a little rocket that
 * zooms across the sky (sometimes with a loop-de-loop) and an astronaut who
 * drifts left → right, plus two black-hole events (drawn by <Starfield>): one
 * that swallows nearby stars, and a portal a UFO escapes from. Each visitor
 * enters and leaves off-screen and is hidden in between. Disabled under
 * prefers-reduced-motion.
 */
export default function SpaceVisitors() {
  const rocketRef = useRef<HTMLDivElement>(null);
  const astroRef = useRef<HTMLDivElement>(null);
  const ufoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rocket = rocketRef.current;
    const astro = astroRef.current;
    const ufo = ufoRef.current;
    if (!rocket || !astro || !ufo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timers: number[] = [];
    let raf = 0;
    let busy = false;
    let alive = true;

    // True if any text-bearing element sits on top of (x, y). Our layer is
    // pointer-events:none, so elementFromPoint returns the content above it.
    const TEXT_SEL = 'h1,h2,h3,h4,p,a,button,li,label,input,textarea,code,pre';
    const textAt = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      if (el.closest(TEXT_SEL)) return true;
      return Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    };

    // Drive one element along frame(u, seconds) for `dur` ms, then hide it.
    // Frame delta is clamped so a backgrounded tab doesn't make it teleport.
    // While passing behind text it fades almost out so it never hurts legibility.
    const run = (el: HTMLDivElement, dur: number, base: number, frame: (u: number, s: number) => Frame) =>
      new Promise<void>(resolve => {
        const half = el.offsetWidth / 2;
        const halfH = el.offsetHeight / 2;
        let elapsed = 0;
        let last = performance.now();
        let n = 0;
        let target = base;
        let alpha = base;
        el.style.opacity = String(base);
        el.style.visibility = 'visible';
        const step = (now: number) => {
          if (!alive) return;
          elapsed += Math.min(now - last, 50);
          last = now;
          const u = Math.min(elapsed / dur, 1);
          const f = frame(u, elapsed / 1000);
          el.style.transform = `translate(${f.x - half}px, ${f.y - halfH}px) rotate(${f.rot}deg) scale(${f.scale ?? 1})`;
          if (n++ % 4 === 0) {
            const hit = textAt(f.x, f.y) || textAt(f.x - half, f.y) || textAt(f.x + half, f.y);
            target = hit ? base * 0.12 : base;
          }
          alpha += (target - alpha) * 0.12;
          el.style.opacity = alpha.toFixed(3);
          if (u < 1) raf = requestAnimationFrame(step);
          else { el.style.visibility = 'hidden'; resolve(); }
        };
        raf = requestAnimationFrame(step);
      });

    const flyRocket = () => {
      const W = window.innerWidth, H = window.innerHeight;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const x0 = dir === 1 ? -80 : W + 80;
      const x1 = dir === 1 ? W + 80 : -80;
      const y0 = H * (0.3 + Math.random() * 0.55);
      const y1 = Math.max(H * 0.08, y0 - H * (0.15 + Math.random() * 0.3));
      const cx = (x0 + x1) / 2;
      const cy = Math.min(y0, y1) - H * 0.15;
      const loop = Math.random() < 0.4;
      const R = Math.max(32, (W + 160) / 24); // big enough to actually turn back on itself
      const pos = (u: number) => {
        const v = 1 - u;
        let x = v * v * x0 + 2 * v * u * cx + u * u * x1;
        let y = v * v * y0 + 2 * v * u * cy + u * u * y1;
        if (loop && u > 0.45 && u < 0.65) {
          const th = (2 * Math.PI * (u - 0.45)) / 0.2;
          x += dir * R * Math.sin(th);
          y -= R * (1 - Math.cos(th));
        }
        return { x, y };
      };
      return run(rocket, 7000 + Math.random() * 2500, 0.6, (u, s) => {
        const p = pos(u);
        const q = pos(Math.min(u + 0.002, 1.002));
        const heading = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90; // svg points up
        return { x: p.x, y: p.y, rot: heading + Math.sin(s * 14) * 3 };
      });
    };

    // Screen rects of elements marked data-sky-avoid (e.g. the hero title panel),
    // padded a little, so slow visitors don't drift along behind them.
    const avoidRects = (pad: number) =>
      Array.from(document.querySelectorAll('[data-sky-avoid]')).map(el => {
        const r = el.getBoundingClientRect();
        return { l: r.left - pad, r: r.right + pad, t: r.top - pad, b: r.bottom + pad };
      });
    const inRects = (x: number, y: number, rects: ReturnType<typeof avoidRects>) =>
      rects.some(q => x > q.l && x < q.r && y > q.t && y < q.b);

    // The astronaut drifts left → right on a gentle arc. Try a few lanes and
    // keep the one that spends the least time behind an avoided area.
    const floatAstronaut = () => {
      const W = window.innerWidth, H = window.innerHeight;
      const rects = avoidRects(36);
      let best = { y0: 0, y1: 0, bow: 0, hits: Infinity };
      for (let i = 0; i < 14 && best.hits > 0; i++) {
        const y0 = H * (0.12 + Math.random() * 0.76);
        const y1 = Math.min(H * 0.9, Math.max(H * 0.1, y0 + H * (Math.random() * 0.36 - 0.18)));
        const bow = H * (0.05 + Math.random() * 0.07) * (Math.random() < 0.5 ? -1 : 1);
        let hits = 0;
        for (let u = 0; u <= 1; u += 0.04) {
          if (inRects(-90 + (W + 180) * u, y0 + (y1 - y0) * u + bow * Math.sin(Math.PI * u), rects)) hits++;
        }
        if (hits < best.hits) best = { y0, y1, bow, hits };
      }
      const { y0, y1, bow } = best;
      const spin = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5);
      const r0 = Math.random() * 40 - 20;
      const speed = 45 + Math.random() * 15; // px/s
      return run(astro, ((W + 180) / speed) * 1000, 0.55, (u, s) => ({
        x: -90 + (W + 180) * u,
        y: y0 + (y1 - y0) * u + bow * Math.sin(Math.PI * u) + Math.sin(s * 0.9) * 10,
        rot: r0 + spin * s + Math.sin(s * 0.7) * 8,
      }));
    };

    // A spot in open sky for a black hole: away from the edges, text and
    // avoided areas. Scores every sample and keeps the best one, so crowded
    // (mobile) screens still get the emptiest spot available.
    const openSpot = () => {
      const W = window.innerWidth, H = window.innerHeight;
      const m = Math.min(90, W * 0.12);           // edge margin
      const r = Math.min(60, W * 0.1);            // clearance around the spot
      const rects = avoidRects(Math.min(70, W * 0.08));
      let best = { x: W / 2, y: H / 2, score: Infinity };
      for (let i = 0; i < 40 && best.score > 0; i++) {
        const x = m + Math.random() * (W - 2 * m);
        const y = 90 + Math.random() * (H - 160);
        const score = (inRects(x, y, rects) ? 10 : 0)
          + [[0, 0], [-r, 0], [r, 0], [0, -r], [0, r]].filter(([dx, dy]) => textAt(x + dx, y + dy)).length;
        if (score < best.score) best = { x, y, score };
      }
      return { x: best.x, y: best.y };
    };

    // The black hole itself is drawn by <Starfield> (it pulls the real stars);
    // we just tell it where and for how long.
    const openHole = (x: number, y: number, kind: 'devour' | 'portal', dur: number) => {
      window.dispatchEvent(new CustomEvent('sky:hole', { detail: { x, y, kind, dur } }));
      return new Promise<void>(r => timers.push(window.setTimeout(r, dur)));
    };

    const devour = () => {
      const { x, y } = openSpot();
      return openHole(x, y, 'devour', 13000);
    };

    // A portal opens, a UFO rises out of its middle, scoots one way, brakes,
    // then whips around and zips off the other way.
    const ufoEscape = async () => {
      const { x: hx, y: hy } = openSpot();
      const W = window.innerWidth, H = window.innerHeight;
      const hole = openHole(hx, hy, 'portal', 4800);
      await new Promise<void>(r => timers.push(window.setTimeout(r, 800))); // horizon fully open first
      const a = (Math.random() < 0.5 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.7;
      const b = a + Math.PI + (Math.random() - 0.5) * 0.8;
      const D = 120 + Math.random() * 80;
      const rise = 0.8, out = 1.1, hover = 0.35, v0 = 140, acc = 1700;
      const need = Math.hypot(W, H) + D + 100;
      const tEnd = (-v0 + Math.sqrt(v0 * v0 + 2 * acc * need)) / acc;
      const px = hx + Math.cos(a) * D, py = hy + Math.sin(a) * D;
      const flight = run(ufo, (rise + out + hover + tEnd) * 1000, 0.7, (_u, s) => {
        if (s < rise) {
          // surfaces in the middle of the horizon: tiny and dark, growing to
          // full size with a little wobble, before it leaves
          const em = 1 - Math.pow(1 - s / rise, 2);
          ufo.style.filter = `brightness(${0.15 + 0.85 * em})`;
          return { x: hx + Math.cos(a) * 4 * em, y: hy + Math.sin(a) * 4 * em, rot: Math.sin(s * 22) * 7 * (1 - em), scale: 0.12 + 0.88 * em };
        }
        ufo.style.filter = '';
        if (s < rise + out) {
          const e = 1 - Math.pow(1 - (s - rise) / out, 3); // ease-out: quick exit, then brakes
          const d = 4 + (D - 4) * e;
          return { x: hx + Math.cos(a) * d, y: hy + Math.sin(a) * d, rot: Math.cos(a) * 14 * (1 - e) };
        }
        if (s < rise + out + hover) {
          const k = (s - rise - out) / hover;
          return { x: px, y: py + Math.sin(k * Math.PI * 2) * 2.5, rot: Math.cos(a) * -10 * Math.sin(k * Math.PI) };
        }
        const t = s - rise - out - hover;
        const d = v0 * t + 0.5 * acc * t * t;
        return { x: px + Math.cos(b) * d, y: py + Math.sin(b) * d, rot: Math.cos(b) * 18 };
      });
      await Promise.all([hole, flight]);
      ufo.style.filter = '';
    };

    // Never two events on screen at once; retry a bit later if another one is
    // out or the tab is hidden.
    const schedule = (show: () => Promise<void>, delay: number, next: () => number) => {
      timers.push(window.setTimeout(async () => {
        if (busy || document.hidden) { schedule(show, 5000, next); return; }
        busy = true;
        await show();
        busy = false;
        if (alive) schedule(show, next(), next);
      }, delay));
    };

    schedule(flyRocket, 18000 + Math.random() * 8000, () => 40000 + Math.random() * 30000);
    schedule(floatAstronaut, 35000 + Math.random() * 10000, () => 75000 + Math.random() * 45000);
    schedule(ufoEscape, 55000 + Math.random() * 15000, () => 90000 + Math.random() * 60000);
    schedule(devour, 80000 + Math.random() * 20000, () => 150000 + Math.random() * 90000);

    // Manual triggers for trying it out, e.g. window.dispatchEvent(new Event('sky:ufo'))
    const manual = (show: () => Promise<void>) => async () => {
      if (busy) return;
      busy = true;
      await show();
      busy = false;
    };
    const onUfo = manual(ufoEscape);
    const onBlackHole = manual(devour);
    window.addEventListener('sky:ufo', onUfo);
    window.addEventListener('sky:blackhole', onBlackHole);

    return () => {
      alive = false;
      window.removeEventListener('sky:ufo', onUfo);
      window.removeEventListener('sky:blackhole', onBlackHole);
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div ref={rocketRef} className="absolute left-0 top-0 w-[24px] invisible will-change-transform">
        <svg viewBox="0 0 40 84" className="w-full h-auto overflow-visible">
          <g className="rocket-puffs" fill="#f3e6cf">
            <circle cx="20" cy="70" r="3" />
            <circle cx="20" cy="70" r="2.5" />
            <circle cx="20" cy="70" r="2" />
          </g>
          <g className="rocket-flame">
            <path d="M13.5 58 Q20 84 26.5 58 Z" fill="#e3a857" />
            <path d="M16.5 58 Q20 74 23.5 58 Z" fill="#fff0d6" />
          </g>
          <rect x="14" y="54" width="12" height="5" rx="1.5" fill="#8a8f99" />
          <path d="M12.5 40 L4 58 L13 54 Z" fill="#cf7257" />
          <path d="M27.5 40 L36 58 L27 54 Z" fill="#cf7257" />
          <path d="M20 4 C30 14 30.5 34 28 55 L12 55 C9.5 34 10 14 20 4 Z" fill="#f2ede4" />
          <path d="M20 4 C24.6 8.6 27.3 13.5 28.5 19 L11.5 19 C12.7 13.5 15.4 8.6 20 4 Z" fill="#cf7257" />
          <circle cx="20" cy="31" r="5.5" fill="#6f8cae" stroke="#e3a857" strokeWidth="2" />
          <circle cx="18.2" cy="29.2" r="1.6" fill="#ffffff" opacity="0.7" />
          <rect x="18.5" y="45" width="3" height="11" rx="1.5" fill="#cf7257" />
        </svg>
      </div>

      <div ref={astroRef} className="absolute left-0 top-0 w-[34px] invisible will-change-transform">
        <svg viewBox="0 0 64 72" className="w-full h-auto overflow-visible">
          <path d="M16 46 C4 52 6 64 -4 66" fill="none" stroke="#9aa3b0" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 3.5" />
          <rect x="14" y="27" width="36" height="28" rx="7" fill="#c9d0da" />
          <rect x="8" y="35" width="9" height="19" rx="4.5" fill="#f4f1ea" transform="rotate(22 12.5 37)" />
          <circle cx="7.5" cy="53" r="4.6" fill="#cf7257" />
          <rect x="21" y="50" width="9.5" height="15" rx="4.75" fill="#f4f1ea" />
          <rect x="33.5" y="50" width="9.5" height="15" rx="4.75" fill="#f4f1ea" />
          <rect x="21" y="61" width="9.5" height="5" rx="2.5" fill="#b4bcc8" />
          <rect x="33.5" y="61" width="9.5" height="5" rx="2.5" fill="#b4bcc8" />
          <rect x="17" y="33" width="30" height="24" rx="10" fill="#f4f1ea" />
          <rect x="26" y="39" width="12" height="8" rx="2" fill="#6f8cae" />
          <circle cx="29" cy="43" r="1.3" fill="#e3a857" />
          <circle cx="33" cy="43" r="1.3" fill="#cf7257" />
          <line x1="22" y1="9" x2="18" y2="2.5" stroke="#c9d0da" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18" cy="2.5" r="2.2" fill="#cf7257" className="astro-blink" />
          <circle cx="32" cy="21" r="17" fill="#f4f1ea" />
          <defs>
            <linearGradient id="astro-visor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0c479" />
              <stop offset="1" stopColor="#9c6b34" />
            </linearGradient>
          </defs>
          <ellipse cx="33.5" cy="22" rx="11.5" ry="9" fill="url(#astro-visor)" />
          <ellipse cx="29" cy="18.5" rx="3.6" ry="2" fill="#ffffff" opacity="0.65" transform="rotate(-25 29 18.5)" />
          <circle cx="37.5" cy="25.5" r="1.1" fill="#ffffff" opacity="0.5" />
          {/* waving arm: raised out to the side, clear of the helmet */}
          <g className="astro-wave" style={{ transformOrigin: '45px 38px' }}>
            <rect x="42" y="33.75" width="18" height="8.5" rx="4.25" fill="#f4f1ea" />
            <circle cx="60" cy="38" r="4.4" fill="#cf7257" />
          </g>
        </svg>
      </div>

      <div ref={ufoRef} className="absolute left-0 top-0 w-[30px] invisible will-change-transform">
        <svg viewBox="0 0 48 30" className="w-full h-auto overflow-visible">
          <path d="M14.5 14 A9.5 10 0 0 1 33.5 14 Z" fill="#6f8cae" opacity="0.9" />
          <ellipse cx="24" cy="9.6" rx="3.6" ry="3.2" fill="#88a36b" />
          <circle cx="22.7" cy="9.2" r="0.9" fill="#0a0a0a" />
          <circle cx="25.3" cy="9.2" r="0.9" fill="#0a0a0a" />
          <ellipse cx="19.5" cy="9.5" rx="2" ry="1.2" fill="#ffffff" opacity="0.55" transform="rotate(-30 19.5 9.5)" />
          <ellipse cx="24" cy="18" rx="22" ry="6.5" fill="#c9d0da" />
          <ellipse cx="24" cy="16.2" rx="15" ry="2.6" fill="#e6e9ee" />
          <path d="M2.4 18.5 A22 6.5 0 0 0 45.6 18.5 A22 4 0 0 1 2.4 18.5 Z" fill="#9aa3b0" />
          <g className="ufo-lights" fill="#e3a857">
            <circle cx="9" cy="20.3" r="1.4" />
            <circle cx="16.5" cy="21.7" r="1.4" />
            <circle cx="24" cy="22.1" r="1.4" />
            <circle cx="31.5" cy="21.7" r="1.4" />
            <circle cx="39" cy="20.3" r="1.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}
