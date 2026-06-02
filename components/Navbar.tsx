'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from './i18n';
import LangSwitch from './LangSwitch';

const SECTION_IDS = ['chatbot', 'about', 'experience', 'projects', 'github'];
const NAV_H = 64;

export default function Navbar() {
  const { t } = useI18n();
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hideRef = useRef(0);
  const lastRef = useRef(0);
  const pinnedRef = useRef(false);

  // On (re)load, always land at the hero — not a restored position or #hash section.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }, []);

  // Gradual hide on scroll. After a nav-link click the bar stays pinned (visible)
  // until the user scrolls by hand again — comfort when you mis-click a section.
  useEffect(() => {
    const el = navRef.current;
    lastRef.current = window.scrollY;
    hideRef.current = Math.max(0, Math.min(NAV_H, window.scrollY));
    const apply = () => { if (el) el.style.transform = `translateY(${-hideRef.current}px)`; };
    apply();

    let ticking = false;
    const onScroll = () => {
      setMenuOpen(false);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (pinnedRef.current) {                 // pinned after a nav click → stay visible
          hideRef.current = 0;
          lastRef.current = y;
          apply();
          ticking = false;
          return;
        }
        hideRef.current = Math.max(0, Math.min(NAV_H, hideRef.current + (y - lastRef.current)));
        if (y <= 0) hideRef.current = 0;
        lastRef.current = y;
        apply();
        ticking = false;
      });
    };
    const onUserScroll = () => { pinnedRef.current = false; };  // real gesture → resume hiding
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onUserScroll, { passive: true });
    window.addEventListener('touchmove', onUserScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchmove', onUserScroll);
    };
  }, []);

  // Clicking a nav link pins the bar visible until the next manual scroll
  const onNavClick = () => {
    pinnedRef.current = true;
    hideRef.current = 0;
    if (navRef.current) navRef.current.style.transform = 'translateY(0px)';
    setMenuOpen(false);
  };

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

  const socials = (
    <>
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
    </>
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-xl border-b border-white/[0.07] will-change-transform"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Logo — compact monogram on mobile, stacked name on desktop */}
        <a href="#hero" onClick={onNavClick} className="no-underline shrink-0">
          <span className="md:hidden text-[1.2rem] font-bold text-white tracking-tight">MT</span>
          <span className="hidden md:block leading-[0.95]">
            <span className="block text-[1rem] font-bold text-white tracking-tight">mustafa</span>
            <span className="block text-[1rem] font-bold text-[#777] tracking-tight">turhal</span>
          </span>
        </a>

        {/* Center pill nav (desktop) */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.05] p-1">
          {links.map(l => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={onNavClick}
                className="px-3.5 py-1.5 rounded-full text-[0.84rem] transition-colors no-underline"
                style={isActive ? { background: 'rgba(227,168,87,0.15)', color: '#e3a857' } : { color: '#888' }}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3 shrink-0">
          <LangSwitch />
          <div className="hidden md:flex items-center gap-3">{socials}</div>
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-white"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></>
                : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <div className="px-5 py-3 flex flex-col">
            {links.map(l => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={onNavClick}
                  className="py-3 text-[0.95rem] border-b border-white/[0.05] no-underline transition-colors"
                  style={{ color: isActive ? '#e3a857' : '#bbb' }}
                >
                  {l.label}
                </a>
              );
            })}
            <div className="flex items-center gap-5 pt-4 pb-1">{socials}</div>
          </div>
        </div>
      )}
    </nav>
  );
}
