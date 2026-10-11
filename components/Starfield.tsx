'use client';

import { useEffect, useRef } from 'react';

const GOLD = '227,168,87'; // #e3a857 — same as the site accent

/**
 * Subtle interactive starfield on a fixed canvas behind all content.
 * Dim-to-bright twinkling stars with a soft glow on the brighter ones, light
 * cursor parallax, and an occasional golden shooting star. On a "sky:hole"
 * event (sent by <SpaceVisitors>) it opens a black hole: "devour" spirals the
 * nearby stars in and swallows them (they fade back in afterwards),
 * "portal" is a smaller, bluish horizon a UFO escapes from. Honors
 * prefers-reduced-motion (still field, no shooting stars).
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0, raf = 0;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let nextShoot = 0;
    let lastT = 0;

    type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number; depth: number; glow: boolean; gone: boolean; fade: number; trail: number[] | null };
    type Shooter = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    type Hole = { x: number; y: number; kind: 'devour' | 'portal'; start: number; dur: number; closeAt?: number };
    let stars: Star[] = [];
    const shooters: Shooter[] = [];
    let hole: Hole | null = null;
    let pulling = 0; // stars currently being pulled in (from the last frame)

    const resize = () => {
      w = canvas.width = Math.floor(window.innerWidth * DPR);
      h = canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const count = Math.min(360, Math.floor((window.innerWidth * window.innerHeight) / 5800));
      stars = Array.from({ length: count }, () => {
        const bright = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1.4 + 0.55) * DPR,
          a: bright * 0.6 + 0.35,           // 0.35 – 0.95
          tw: Math.random() * 0.0024 + 0.0007,
          ph: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.7 + 0.2,
          glow: bright > 0.78,              // ~22% get a soft halo
          gone: false,
          fade: 1,
          trail: null,
        };
      });
    };

    const spawnShooter = () => {
      const dir = Math.random() < 0.5 ? 1 : -1; // down-right or mirrored down-left
      const startX = dir === 1
        ? Math.random() * w * 0.45 + w * 0.05
        : Math.random() * w * 0.45 + w * 0.5;
      const startY = Math.random() * h * 0.28;
      const angle = Math.PI * (0.16 + Math.random() * 0.13);
      const speed = (Math.random() * 3.5 + 7) * DPR;
      shooters.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed * dir, vy: Math.sin(angle) * speed,
        life: 0, max: Math.random() * 28 + 46,
      });
    };

    const smooth = (a: number, b: number, v: number) => {
      const k = Math.min(1, Math.max(0, (v - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };

    // Event horizon: just a dark core, a thin glowing rim and a faint lensing
    // halo. For the black hole the spiral is made by the stars (see draw()).
    const drawHorizon = (hx: number, hy: number, r: number, rim: string, glow: string) => {
      ctx.globalAlpha = 1;
      const halo = ctx.createRadialGradient(hx, hy, r, hx, hy, r * 3);
      halo.addColorStop(0, `rgba(${rim},0.12)`);
      halo.addColorStop(1, `rgba(${rim},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(hx, hy, r * 3, 0, Math.PI * 2); ctx.fill();
      const core = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 1.18);
      core.addColorStop(0, '#000');
      core.addColorStop(0.85, '#000');
      core.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(hx, hy, r * 1.18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(${rim},0.7)`;
      ctx.lineWidth = 1.1 * DPR;
      ctx.shadowColor = `rgba(${glow},0.9)`; ctx.shadowBlur = 10 * DPR;
      ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      tx += (mx - tx) * 0.045;
      ty += (my - ty) * 0.045;
      const step = Math.min(t - (lastT || t), 50) / 16.67; // frames at 60 fps
      lastT = t;

      // Black hole timeline: horizon opens → stars start falling in → once no
      // star is left falling, the horizon closes right away. "final" ramps up
      // the pull late on so a lingering ring of stars can't keep it open.
      const reach = Math.min(270 * DPR, Math.min(w, h) * 0.42); // smaller pull on phones
      let hx = 0, hy = 0, hr = 0, pull = 0, final = 0;
      if (hole) {
        const p = (t - hole.start) / hole.dur;
        if (hole.kind === 'devour' && hole.closeAt === undefined && p > 0.3 && pulling === 0) hole.closeAt = t;
        const CLOSE = 1100;
        if (p >= 1 || (hole.closeAt !== undefined && t > hole.closeAt + CLOSE)) {
          for (const s of stars) {
            s.trail = null;
            if (!s.gone && Math.hypot(s.x - hole.x * DPR, s.y - hole.y * DPR) < 60 * DPR) s.gone = true;
          }
          // swallowed stars refill the emptied patch one by one (staggered fade-in)
          for (const s of stars) if (s.gone) {
            const rr = reach * 0.8 * Math.sqrt(Math.random()), ang = Math.random() * Math.PI * 2;
            s.x = hole.x * DPR + Math.cos(ang) * rr;
            s.y = hole.y * DPR + Math.sin(ang) * rr;
            s.gone = false;
            s.fade = -Math.random() * 1.5;
          }
          hole = null;
        } else {
          const devour = hole.kind === 'devour';
          const closing = hole.closeAt !== undefined
            ? 1 - smooth(hole.closeAt, hole.closeAt + CLOSE, t)
            : 1 - smooth(devour ? 0.88 : 0.82, 1, p);
          const env = smooth(0, devour ? 0.1 : 0.15, p) * closing;
          hx = hole.x * DPR; hy = hole.y * DPR;
          hr = (devour ? 16 : 22) * DPR * env; // portal is a bit wider than the UFO
          pull = devour ? smooth(0.13, 0.26, p) : 0;
          final = devour ? smooth(0.7, 0.86, p) : 0;
        }
      }

      // stars
      pulling = 0;
      for (const s of stars) {
        if (s.gone) continue;
        const ox = tx * s.depth * 45 * DPR;
        const oy = ty * s.depth * 45 * DPR;
        let size = 1, hot = 0;
        if (pull > 0) {
          const dx = s.x + ox - hx, dy = s.y + oy - hy;
          let d = Math.hypot(dx, dy);
          if (d < reach) {
            // Spiral in: orbit faster the closer a star gets. Just outside the
            // horizon they slow their fall and circle for a while, so the
            // stars themselves form a bright ring before they vanish.
            const ring = d < hr * 2.6 ? 0.15 + 0.85 * final : 1;
            const ang = Math.atan2(dy, dx) + (3 / (d / DPR + 30)) * step * pull;
            d -= (0.2 + 1.3 * (1 - d / reach)) * ring * (1 + 2 * final) * DPR * step * pull;
            if (d < hr * 1.02 || d < 2) { s.gone = true; s.trail = null; continue; }
            s.x = hx + Math.cos(ang) * d - ox;
            s.y = hy + Math.sin(ang) * d - oy;
            size = Math.min(1, Math.max(0.25, (d - hr) / (hr * 1.6)));
            hot = 1 - smooth(hr * 1.6, hr * 4, d); // heats up near the horizon
            pulling++;
            const tr = s.trail ?? (s.trail = []);
            tr.push(s.x + ox, s.y + oy);
            if (tr.length > 36) tr.splice(0, 2);
          } else s.trail = null;
        }
        if (s.fade < 1) s.fade = Math.min(1, s.fade + step / 260); // ~4 s fade-in
        const px = s.x + ox;
        const py = s.y + oy;
        const tw = reduce ? s.a : s.a * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
        const a = (tw + (0.95 - tw) * hot) * Math.max(0, s.fade);
        if (s.trail && s.trail.length > 3) {
          // the star's own recent path, fading towards its tail; together
          // these trails are what draws the spiral
          const tr = s.trail, n = tr.length / 2;
          ctx.strokeStyle = hot > 0.3 ? '#ffe9c4' : '#ffffff';
          ctx.lineWidth = s.r * size * 0.9;
          ctx.lineCap = 'round';
          for (let i = 1; i < n; i++) {
            ctx.globalAlpha = Math.max(0, a * 0.6 * (i / n));
            ctx.beginPath(); ctx.moveTo(tr[i * 2 - 2], tr[i * 2 - 1]); ctx.lineTo(tr[i * 2], tr[i * 2 + 1]); ctx.stroke();
          }
        }
        ctx.globalAlpha = Math.max(0, a);
        ctx.beginPath();
        ctx.arc(px, py, s.r * size, 0, Math.PI * 2);
        ctx.fillStyle = hot > 0.3 ? '#ffe9c4' : '#ffffff';
        if (s.glow) { ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 6 * DPR; }
        ctx.fill();
        if (s.glow) ctx.shadowBlur = 0;
      }

      if (hole && hr > 0.5) {
        if (hole.kind === 'devour') drawHorizon(hx, hy, hr, '255,236,200', GOLD);
        else drawHorizon(hx, hy, hr, '196,214,236', '111,140,174');
      }

      // golden shooting stars
      if (!reduce) {
        if (nextShoot === 0) nextShoot = t + 3000;
        if (t > nextShoot) { spawnShooter(); nextShoot = t + 6500 + Math.random() * 6500; }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const s = shooters[i];
          s.x += s.vx; s.y += s.vy; s.life++;
          const env = Math.sin((s.life / s.max) * Math.PI); // fade in/out
          const tailX = s.x - s.vx * 9;
          const tailY = s.y - s.vy * 9;
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${GOLD},${0.9 * env})`);
          grad.addColorStop(1, `rgba(${GOLD},0)`);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * DPR;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tailX, tailY); ctx.stroke();
          ctx.globalAlpha = env;
          ctx.fillStyle = 'rgba(255,240,214,0.95)';
          ctx.beginPath(); ctx.arc(s.x, s.y, 1.7 * DPR, 0, Math.PI * 2); ctx.fill();
          if (s.life > s.max || s.x > w + 60 || s.x < -60 || s.y > h + 60) shooters.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    // Desktop follows the cursor; touch devices only nudge on tap (not on swipe).
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const moveEvent = coarse ? 'click' : 'mousemove';

    const onHole = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number; kind: Hole['kind']; dur: number }>).detail;
      hole = { ...d, start: performance.now() };
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('sky:hole', onHole);
    window.addEventListener(moveEvent, onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('sky:hole', onHole);
      window.removeEventListener(moveEvent, onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />;
}
