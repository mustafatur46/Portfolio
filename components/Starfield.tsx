'use client';

import { useEffect, useRef } from 'react';

const GOLD = '227,168,87'; // #e3a857 — same as the site accent

/**
 * Subtle interactive starfield on a fixed canvas behind all content.
 * Dim-to-bright twinkling stars with a soft glow on the brighter ones, light
 * cursor parallax, and an occasional golden shooting star. Honors
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

    type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number; depth: number; glow: boolean };
    type Shooter = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    let stars: Star[] = [];
    let shooters: Shooter[] = [];

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

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      tx += (mx - tx) * 0.045;
      ty += (my - ty) * 0.045;

      // stars
      for (const s of stars) {
        const px = s.x + tx * s.depth * 45 * DPR;
        const py = s.y + ty * s.depth * 45 * DPR;
        const a = reduce ? s.a : s.a * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
        ctx.globalAlpha = Math.max(0, a);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        if (s.glow) { ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 6 * DPR; }
        ctx.fill();
        if (s.glow) ctx.shadowBlur = 0;
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

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />;
}
