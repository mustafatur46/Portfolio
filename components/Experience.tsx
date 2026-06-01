'use client';

import { useRef, useState } from 'react';
import { useI18n } from './i18n';

// Structural data (language-neutral); text comes from i18n by index.
const META = [
  { type: 'work' as const, tags: [] as string[] },
  { type: 'work' as const, companyUrl: 'https://www.beautify-app.de', tags: ['React Native', 'Echtzeit-Booking', 'Payment'] },
  { type: 'edu'  as const, tags: [] as string[] },
  { type: 'work' as const, tags: ['Django', 'Power BI', 'Power Automate', 'SQL'] },
  { type: 'edu'  as const, tags: [] as string[] },
  { type: 'edu'  as const, tags: [] as string[] },
] as const;

export default function Experience() {
  const { t } = useI18n();
  const items = t.experience.items.map((txt, i) => ({ ...META[i], ...txt }));
  const n = items.length;

  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [wrapping, setWrapping] = useState(false);
  const [instant, setInstant] = useState(false);
  const touchX = useRef(0);

  const progress = n > 1 ? (i / (n - 1)) * 100 : 0;

  const goTo = (idx: number) => { setDir(idx >= i ? 1 : -1); setI(idx); };
  const next = () => {
    if (i < n - 1) { setDir(1); setI(i + 1); return; }
    // full loop forward → shooting star flies off, restart at 0
    setDir(1);
    setWrapping(true);
    setInstant(true);
    setI(0);
    setTimeout(() => setInstant(false), 60);
    setTimeout(() => setWrapping(false), 700);
  };
  const prev = () => {
    if (i > 0) { setDir(-1); setI(i - 1); return; }
    // backward from start → sweep to the end (0% → 100%)
    setDir(-1);
    setI(n - 1);
  };

  const item = items[i];
  const companyUrl = 'companyUrl' in item ? item.companyUrl : undefined;
  const trans = instant ? '' : 'transition-[width,left] duration-500';

  const Arrow = ({ onClick, dirIcon }: { onClick: () => void; dirIcon: '‹' | '›' }) => (
    <button
      onClick={onClick}
      aria-label={dirIcon === '‹' ? 'Previous' : 'Next'}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-[#bbb] text-[1.3rem] leading-none hover:text-white hover:border-white/30 transition-colors"
    >
      {dirIcon}
    </button>
  );

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <h2 className="section-title mb-7 md:mb-8" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>
          {t.experience.heading}
        </h2>

        {/* Shooting-star progress bar */}
        <div className="relative h-[3px] rounded-full bg-white/[0.07] mt-2 mb-7">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${trans}`}
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, rgba(227,168,87,0.12), #e3a857)' }}
          />
          {items.map((_, idx) => {
            const pos = n > 1 ? (idx / (n - 1)) * 100 : 0;
            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`${idx + 1}`}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center"
                style={{ left: `${pos}%` }}
              >
                <span
                  className="w-[6px] h-[6px] rounded-full transition-colors"
                  style={{ background: idx <= i ? '#e3a857' : 'rgba(255,255,255,0.22)' }}
                />
              </button>
            );
          })}
          {/* current head star */}
          <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 ${trans}`} style={{ left: `${progress}%` }}>
            <span className="block w-2.5 h-2.5 rounded-full bg-[#f0c479] shadow-[0_0_10px_3px_rgba(227,168,87,0.45)]" />
          </div>
          {wrapping && <span className="exp-shoot" />}
        </div>

        {/* Card (one at a time) */}
        <div
          className="overflow-hidden"
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx < -40) next();
            else if (dx > 40) prev();
          }}
        >
          <div
            key={i}
            className="exp-card bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5 sm:p-6 min-h-[200px]"
            style={{ ['--dir' as string]: dir === 1 ? '30px' : '-30px' }}
          >
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <span
                className={`text-[0.7rem] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-[5px] ${
                  item.type === 'work' ? 'bg-[#e3a857]/15 text-[#efc78a]' : 'bg-[#5fa3a0]/15 text-[#86c2bf]'
                }`}
              >
                {item.type === 'work' ? t.experience.work : t.experience.education}
              </span>
              <span className="text-[0.78rem] text-[#555]">{item.date}</span>
            </div>

            <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold text-white mb-0.5">{item.title}</h3>

            {companyUrl ? (
              <a href={companyUrl} target="_blank" rel="noopener noreferrer"
                 className="text-[0.85rem] text-[#e3a857] mb-2 block hover:underline">
                {item.company} ↗
              </a>
            ) : (
              <p className="text-[0.85rem] text-[#e3a857] mb-2">{item.company}</p>
            )}

            {item.description && (
              <p className="text-[0.88rem] text-[#888] leading-relaxed">{item.description}</p>
            )}

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[0.75rem] px-2 py-0.5 rounded-[5px] bg-white/[0.06] border border-white/[0.09] text-[#888]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-5">
          <Arrow onClick={prev} dirIcon="‹" />
          <span className="text-[0.8rem] font-mono text-[#666] tabular-nums">
            {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <Arrow onClick={next} dirIcon="›" />
        </div>
      </div>
    </section>
  );
}
