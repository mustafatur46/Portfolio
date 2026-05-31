'use client';

import { useEffect, useRef } from 'react';

/**
 * A subtle golden ring that eases toward the cursor (desktop only).
 * The native cursor is kept for usability; this is purely decorative.
 * Grows slightly when hovering interactive elements.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    // Skip touch / coarse-pointer devices entirely
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y, raf = 0, shown = false;

    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { el.style.opacity = '1'; shown = true; }
      const interactive = !!(e.target as HTMLElement)?.closest?.('a,button,[role="button"],input,textarea');
      el.style.setProperty('--s', interactive ? '1.9' : '1');
      el.style.setProperty('--o', interactive ? '0.12' : '0');
    };
    const onLeave = () => { el.style.opacity = '0'; shown = false; };

    const STAR =
      '<svg viewBox="0 0 24 24" width="16" height="16" style="display:block"><path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 12 2 12C7 12 12 7 12 2Z" fill="#e3a857"/></svg>';
    const onDown = (e: MouseEvent) => {
      const s = document.createElement('span');
      s.className = 'click-star';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.innerHTML = STAR;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(var(--s, 1))`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed left-0 top-0 z-[9999] w-6 h-6 rounded-full opacity-0 transition-[opacity] duration-300"
      style={{
        border: '1px solid rgba(227,168,87,0.6)',
        background: 'rgba(227,168,87,var(--o,0))',
        willChange: 'transform',
      }}
    />
  );
}
