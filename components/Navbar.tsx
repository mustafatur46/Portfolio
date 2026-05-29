'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const links = [
  { href: '#chatbot',    label: 'Chatbot' },
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#github',     label: 'GitHub' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/[0.09]'
          : ''
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6 h-full flex items-center justify-between">
        <a href="#hero" className="text-[1.25rem] font-bold text-[#a855f7] tracking-wide no-underline">
          MT
        </a>
        <div className="flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[#888] text-sm hover:text-white transition-colors no-underline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:mustafa.turhal08@gmail.com"
            className="bg-[#a855f7] text-white text-[0.85rem] font-semibold px-4 py-1.5 rounded-[8px] hover:opacity-85 transition-opacity no-underline"
          >
            Kontakt
          </a>
        </div>
      </div>
    </nav>
  );
}
