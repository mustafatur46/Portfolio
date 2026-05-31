'use client';

import { useEffect, useState } from 'react';
import { useI18n } from './i18n';
import LangSwitch from './LangSwitch';

const SECTION_IDS = ['chatbot', 'about', 'experience', 'projects', 'github'];

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y < 80) setNavHidden(false);            // always show near the top
      else if (y > last + 4) setNavHidden(true);  // scrolling down → hide
      else if (y < last - 4) setNavHidden(false); // scrolling up → show
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const links = [
    { href: '#chatbot',    id: 'chatbot',    label: t.nav.chatbot },
    { href: '#about',      id: 'about',      label: t.nav.about },
    { href: '#experience', id: 'experience', label: t.nav.experience },
    { href: '#projects',   id: 'projects',   label: t.nav.projects },
    { href: '#github',     id: 'github',     label: t.nav.github },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-[transform,background-color,border-color] duration-300 ${
        navHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.07]' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#hero" className="leading-[0.95] no-underline shrink-0">
          <span className="block text-[1rem] font-bold text-white tracking-tight">mustafa</span>
          <span className="block text-[1rem] font-bold text-[#777] tracking-tight">turhal</span>
        </a>

        {/* Center pill nav */}
        <div
          className={`hidden md:flex items-center gap-1 rounded-full border border-white/[0.1] p-1 transition-all duration-300 ${
            scrolled ? 'bg-black/60 backdrop-blur-xl glow' : 'bg-white/[0.03]'
          }`}
        >
          {links.map(l => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-1.5 rounded-full text-[0.84rem] transition-colors no-underline"
                style={
                  isActive
                    ? { background: 'rgba(227,168,87,0.15)', color: '#e3a857' }
                    : { color: '#888' }
                }
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* Right: lang + socials */}
        <div className="flex items-center gap-3 shrink-0">
          <LangSwitch />
          <a href="https://github.com/mustafatur46" target="_blank" rel="noopener noreferrer"
             aria-label="GitHub" className="text-[#888] hover:text-white transition-colors">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/mustafa-turhal-9963ba26a" target="_blank" rel="noopener noreferrer"
             aria-label="LinkedIn" className="text-[#888] hover:text-white transition-colors">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
