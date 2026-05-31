'use client';

import { useEffect } from 'react';

// Golden sparkle (4-point) + a short downward tail (Schweif).
const SPARK =
  '<span class="cs-tail"></span>' +
  '<svg viewBox="0 0 24 24" width="16" height="16" style="display:block"><path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 12 2 12C7 12 12 7 12 2Z" fill="#e3a857"/></svg>';

/**
 * Spawns a small golden star with a tail at every click. No custom cursor ring —
 * the native cursor stays. Purely decorative, removed after its animation.
 */
export default function Cursor() {
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const s = document.createElement('span');
      s.className = 'click-star';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.innerHTML = SPARK;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, []);

  return null;
}
