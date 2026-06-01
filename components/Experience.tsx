'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from './i18n';

// Structural data, CHRONOLOGICAL (oldest → newest); text comes from i18n by index.
const META = [
  { type: 'edu'  as const, tags: [] as string[] },                                   // Abitur
  { type: 'edu'  as const, tags: [] as string[] },                                   // Bachelor
  { type: 'work' as const, tags: ['Django', 'Power BI', 'Power Automate', 'SQL'] },  // Bühler
  { type: 'work' as const, companyUrl: 'https://www.beautify-app.de', tags: ['React Native', 'Echtzeit-Booking', 'Payment'] }, // Beautify
  { type: 'edu'  as const, tags: [] as string[] },                                   // Master
  { type: 'work' as const, tags: [] as string[] },                                   // DAPR Werkstudent
] as const;

export default function Experience() {
  const { t } = useI18n();
  const items = t.experience.items.map((txt, idx) => ({ ...META[idx], ...txt }));
  const n = items.length;
  // virtual list with wrap clones: [last, ...items, first] → seamless infinite loop
  const virtual = [items[n - 1], ...items, items[0]];

  const [vi, setVi] = useState(n);             // start on most recent (real n-1)
  const [noAnim, setNoAnim] = useState(false); // disable track anim for seamless jump
  const [wrapDir, setWrapDir] = useState<'fwd' | 'bwd' | null>(null);
  const [barInstant, setBarInstant] = useState(false);
  const touchX = useRef(0);

  const real = ((vi - 1) % n + n) % n;
  const progress = n > 1 ? (real / (n - 1)) * 100 : 0;

  const fireWrap = (dir: 'fwd' | 'bwd') => {
    setWrapDir(dir);
    setBarInstant(true);
    setTimeout(() => setBarInstant(false), 60);
    setTimeout(() => setWrapDir(null), 720);
  };
  const next = () => { if (vi === n) fireWrap('fwd'); setVi(v => v + 1); };
  const prev = () => { if (vi === 1) fireWrap('bwd'); setVi(v => v - 1); };
  const goReal = (r: number) => setVi(r + 1);

  const onTrackEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    if (vi === n + 1) { setNoAnim(true); setVi(1); }       // past last clone → real first
    else if (vi === 0) { setNoAnim(true); setVi(n); }      // before first clone → real last
  };
  useEffect(() => {
    if (!noAnim) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)));
    return () => cancelAnimationFrame(id);
  }, [noAnim]);

  const trackTrans = noAnim ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]';
  const barTrans = barInstant ? '' : 'transition-[width,left] duration-500';

  const Arrow = ({ onClick, glyph }: { onClick: () => void; glyph: '‹' | '›' }) => (
    <button
      onClick={onClick}
      aria-label={glyph === '‹' ? 'Previous' : 'Next'}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-[#bbb] text-[1.3rem] leading-none hover:text-white hover:border-white/30 transition-colors"
    >
      {glyph}
    </button>
  );

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <h2 className="section-title mb-7 md:mb-8" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>
          {t.experience.heading}
        </h2>

        {/* Shooting-star timeline bar (left = oldest, right = today) */}
        <div className="relative h-[3px] rounded-full bg-white/[0.07] mt-2 mb-7">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${barTrans}`}
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, rgba(227,168,87,0.12), #e3a857)' }}
          />
          {items.map((_, idx) => {
            const pos = n > 1 ? (idx / (n - 1)) * 100 : 0;
            return (
              <button
                key={idx}
                onClick={() => goReal(idx)}
                aria-label={`${idx + 1}`}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center"
                style={{ left: `${pos}%` }}
              >
                <span className="w-[6px] h-[6px] rounded-full transition-colors" style={{ background: idx <= real ? '#e3a857' : 'rgba(255,255,255,0.22)' }} />
              </button>
            );
          })}
          <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 ${barTrans}`} style={{ left: `${progress}%` }}>
            <span className="block w-2.5 h-2.5 rounded-full bg-[#f0c479] shadow-[0_0_10px_3px_rgba(227,168,87,0.45)]" />
          </div>
          {wrapDir === 'fwd' && <span className="exp-shoot" />}
          {wrapDir === 'bwd' && <span className="exp-shoot-rev" />}
        </div>

        {/* Infinite carousel — neighbours peek on both sides (incl. wrap-around) */}
        <div
          className="overflow-hidden"
          style={{ ['--cw' as string]: 'clamp(210px, 62vw, 760px)' }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx < -40) next();
            else if (dx > 40) prev();
          }}
        >
          <div
            className={`flex gap-4 items-stretch ${trackTrans}`}
            style={{ transform: `translateX(calc((100% - var(--cw)) / 2 - ${vi} * (var(--cw) + 1rem)))` }}
            onTransitionEnd={onTrackEnd}
          >
            {virtual.map((it, vIdx) => {
              const isC = vIdx === vi;
              const cu = 'companyUrl' in it ? it.companyUrl : undefined;
              return (
                <div
                  key={vIdx}
                  onClick={() => { if (vIdx === vi + 1) next(); else if (vIdx === vi - 1) prev(); }}
                  className={`w-[var(--cw)] shrink-0 transition-opacity duration-300 ${isC ? '' : 'opacity-40 cursor-pointer'}`}
                >
                  <div className={`h-full bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5 sm:p-6 ${isC ? '' : 'pointer-events-none select-none'}`}>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-[0.7rem] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-[5px] ${
                          it.type === 'work' ? 'bg-[#e3a857]/15 text-[#efc78a]' : 'bg-[#5fa3a0]/15 text-[#86c2bf]'
                        }`}
                      >
                        {it.type === 'work' ? t.experience.work : t.experience.education}
                      </span>
                      <span className="text-[0.78rem] text-[#555]">{it.date}</span>
                    </div>

                    <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold text-white mb-0.5">{it.title}</h3>

                    {cu ? (
                      <a href={cu} target="_blank" rel="noopener noreferrer"
                         className="text-[0.85rem] text-[#e3a857] mb-2 block hover:underline">
                        {it.company} ↗
                      </a>
                    ) : (
                      <p className="text-[0.85rem] text-[#e3a857] mb-2">{it.company}</p>
                    )}

                    {it.description && (
                      <p className="text-[0.88rem] text-[#888] leading-relaxed">{it.description}</p>
                    )}

                    {it.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {it.tags.map(tag => (
                          <span key={tag} className="text-[0.75rem] px-2 py-0.5 rounded-[5px] bg-white/[0.06] border border-white/[0.09] text-[#888]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-5">
          <Arrow onClick={prev} glyph="‹" />
          <span className="text-[0.8rem] font-mono text-[#666] tabular-nums">
            {String(real + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <Arrow onClick={next} glyph="›" />
        </div>
      </div>
    </section>
  );
}
