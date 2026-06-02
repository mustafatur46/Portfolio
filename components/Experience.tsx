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

  // ── Mobile carousel state (stateless circular index → robust under rapid input) ─
  const [i, setI] = useState(0);                 // starts at the oldest entry (Abitur)
  const [popKey, setPopKey] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [barInstant, setBarInstant] = useState(false);
  const [cardH, setCardH] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchX = useRef(0);

  const progress = n > 1 ? (i / (n - 1)) * 100 : 0;
  const barTrans = barInstant ? '' : 'transition-[width,left] duration-500';

  // shortest circular offset of a card from the current index
  const offset = (idx: number) => {
    let o = idx - i;
    if (o > n / 2) o -= n;
    else if (o < -n / 2) o += n;
    return o;
  };

  const popDot = () => {
    setBarInstant(true);
    setPopKey(k => k + 1);
    setPulse(true);
    setTimeout(() => setBarInstant(false), 60);
    setTimeout(() => setPulse(false), 360);
  };
  const next = () => setI(p => { const ni = (p + 1) % n; if (ni === 0) popDot(); return ni; });          // loop → bar jumps + pop
  const prev = () => setI(p => { if (p === 0) popDot(); return (p - 1 + n) % n; });
  const goTo = (idx: number) => setI(idx);

  // Measure the tallest card once per language so the slot never clips
  useEffect(() => { setCardH(0); }, [t]);
  useEffect(() => {
    if (cardH !== 0) return;
    const max = Math.max(0, ...cardRefs.current.map(el => el?.offsetHeight ?? 0));
    if (max) setCardH(max);
  }, [cardH, t]);

  const Arrow = ({ onClick, glyph }: { onClick: () => void; glyph: '‹' | '›' }) => (
    <button
      onClick={onClick}
      aria-label={glyph === '‹' ? 'Previous' : 'Next'}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-[#bbb] text-[1.3rem] leading-none hover:text-white hover:border-white/30 transition-colors"
    >
      {glyph}
    </button>
  );

  // ── Desktop: original vertical timeline, newest first ──────────────────────────
  const listItems = [...items].reverse();

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <h2 className="section-title mb-7 md:mb-10" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>
          {t.experience.heading}
        </h2>

        {/* ── DESKTOP: vertical timeline list ─────────────────────────────────── */}
        <div className="hidden md:block">
          <div className="relative flex flex-col gap-5">
            <div className="absolute left-[11px] top-1.5 bottom-1.5 w-[2px] bg-gradient-to-b from-[#e3a857] to-transparent" />
            {listItems.map((item, idx) => {
              const cu = 'companyUrl' in item ? item.companyUrl : undefined;
              return (
                <div key={idx} className="grid grid-cols-[24px_1fr] gap-5 items-start">
                  <div className="w-3 h-3 rounded-full bg-[#e3a857] mt-6 shadow-[0_0_10px_rgba(227,168,87,0.4)]" />
                  <div className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[0.7rem] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-[5px] ${
                          item.type === 'work' ? 'bg-[#e3a857]/15 text-[#efc78a]' : 'bg-[#5fa3a0]/15 text-[#86c2bf]'
                        }`}
                      >
                        {item.type === 'work' ? t.experience.work : t.experience.education}
                      </span>
                      <span className="text-[0.78rem] text-[#555]">{item.date}</span>
                    </div>
                    <h3 className="text-[1.05rem] font-semibold text-white mb-0.5">{item.title}</h3>
                    {cu ? (
                      <a href={cu} target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[#e3a857] mb-2 block hover:underline">
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
              );
            })}
          </div>
        </div>

        {/* ── MOBILE: circular carousel with shooting-star timeline bar ────────── */}
        <div className="md:hidden">
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
                  onClick={() => goTo(idx)}
                  aria-label={`${idx + 1}`}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center"
                  style={{ left: `${pos}%` }}
                >
                  <span className="w-[6px] h-[6px] rounded-full transition-colors" style={{ background: idx <= i ? '#e3a857' : 'rgba(255,255,255,0.22)' }} />
                </button>
              );
            })}
            <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 ${barTrans}`} style={{ left: `${progress}%` }}>
              <span
                key={popKey}
                className={`block w-2.5 h-2.5 rounded-full bg-[#f0c479] shadow-[0_0_10px_3px_rgba(227,168,87,0.45)] ${popKey > 0 ? 'animate-dot-pop' : ''}`}
              />
            </div>
          </div>

          <div
            className="relative overflow-hidden"
            style={{ height: cardH || undefined, ['--cw' as string]: 'clamp(210px, 62vw, 760px)' }}
            onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (dx < -40) next();
              else if (dx > 40) prev();
            }}
          >
            {items.map((it, idx) => {
              const off = offset(idx);
              const isC = idx === i;
              const cu = 'companyUrl' in it ? it.companyUrl : undefined;
              return (
                <div
                  key={idx}
                  onClick={() => { if (off === 1) next(); else if (off === -1) prev(); }}
                  className={`absolute top-0 left-1/2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${isC ? '' : 'cursor-pointer'}`}
                  style={{
                    width: 'var(--cw)',
                    transform: `translateX(calc(-50% + ${off} * (var(--cw) + 1rem)))`,
                    opacity: isC ? 1 : Math.abs(off) === 1 ? 0.42 : 0,
                    zIndex: isC ? 2 : 1,
                    // Far cards are fully invisible — skip their paint entirely; only
                    // promote the three on-screen cards to compositor layers.
                    visibility: Math.abs(off) <= 1 ? 'visible' : 'hidden',
                    willChange: Math.abs(off) <= 1 ? 'transform, opacity' : 'auto',
                    pointerEvents: Math.abs(off) <= 1 ? 'auto' : 'none',
                  }}
                >
                  <div
                    ref={el => { cardRefs.current[idx] = el; }}
                    style={{ minHeight: cardH || undefined }}
                    // backdrop-blur only on the center card: blurring a moving element is
                    // the main GPU cost, and on the dimmed side cards it's imperceptible.
                    className={`flex flex-col justify-center bg-white/[0.04] border border-white/[0.09] rounded-[14px] p-5 ${isC ? 'backdrop-blur-xl' : ''} ${isC ? '' : 'pointer-events-none select-none'} ${pulse && isC ? 'animate-card-pop' : ''}`}
                  >
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
                    <h3 className="text-[1.05rem] font-semibold text-white mb-0.5">{it.title}</h3>
                    {cu ? (
                      <a href={cu} target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[#e3a857] mb-2 block hover:underline">
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

          <div className="flex items-center justify-center gap-5 mt-5">
            <Arrow onClick={prev} glyph="‹" />
            <span className="text-[0.8rem] font-mono text-[#666] tabular-nums">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
            <Arrow onClick={next} glyph="›" />
          </div>
        </div>
      </div>
    </section>
  );
}
