'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from './i18n';

// Structural data, CHRONOLOGICAL (oldest → newest); text comes from i18n by index.
// start/end are 'YYYY-MM' (end inclusive, null = ongoing) and drive the desktop
// time axis; `short` is the label drawn on its bar.
const META = [
  { type: 'edu'  as const, short: 'Abitur',   start: '2018-09', end: '2021-07', tags: [] as string[] },
  { type: 'edu'  as const, short: 'B.Sc.',    start: '2021-09', end: '2025-09', tags: [] as string[] },
  { type: 'work' as const, short: 'Bühler',   start: '2022-04', end: '2025-08', tags: ['Django', 'Power BI', 'Power Automate', 'SQL'] },
  { type: 'work' as const, short: 'Beautify', start: '2025-09', end: null, companyUrl: 'https://www.beautify-app.de', tags: ['React Native', 'Echtzeit-Booking', 'Payment'] },
  { type: 'edu'  as const, short: 'M.Sc.',    start: '2026-04', end: null, tags: [] as string[] },
  { type: 'work' as const, short: 'DIIR',     start: '2026-05', end: '2026-09', tags: [] as string[] },
  { type: 'work' as const, short: 'Feldhoff', start: '2026-10', end: null, tags: [] as string[] },
] as const;

const TONE = {
  work: { bar: 'rgba(227,168,87,0.22)', barActive: 'rgba(227,168,87,0.42)', edge: 'rgba(227,168,87,0.55)', text: '#efc78a' },
  edu:  { bar: 'rgba(95,163,160,0.22)', barActive: 'rgba(95,163,160,0.42)', edge: 'rgba(95,163,160,0.55)', text: '#86c2bf' },
};

const month = (ym: string) => { const [y, m] = ym.split('-').map(Number); return y * 12 + m - 1; };

/**
 * A real time axis. Each entry is a bar exactly as long as
 * it lasted, education and work on separate tracks, overlapping entries
 * stacked into extra rows. Ongoing entries run past the "today" line and fade
 * out. Hovering/focusing a bar highlights its card below and vice versa.
 * `compact` is the phone version: thin unlabeled bars that double as the
 * carousel's position indicator and navigation (colors match the card badges).
 */
function TimeAxis({ active, setActive, onPick, labels, compact = false }: {
  active: number | null;
  setActive: (i: number | null) => void;
  onPick: (i: number) => void;
  labels: { work: string; education: string; today: string };
  compact?: boolean;
}) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotW, setPlotW] = useState(0);
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPlotW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = new Date();
  const now = d.getFullYear() * 12 + d.getMonth() + 1;      // end of the current month
  const m0 = month(META[0].start) - 3;
  const m1 = now + 8;                                        // room for ongoing bars to fade out
  const pct = (m: number) => ((m - m0) / (m1 - m0)) * 100;

  // Greedy row packing per track so overlapping entries never collide. A bar
  // too short for its label gets the label just left of it, so it also needs
  // that much free room in its row.
  const pxPerMonth = plotW / (m1 - m0);
  const tracks = (['edu', 'work'] as const).map(type => {
    const rows: number[] = [];                               // end month of the last bar in each row
    const bars = META.map((m, i) => ({ ...m, i }))
      .filter(m => m.type === type)
      .map(m => {
        const s = month(m.start), e = m.end ? month(m.end) + 1 : m1;
        const labelPx = m.short.length * 7.2 + 12;
        const fits = plotW === 0 || (e - s) * pxPerMonth >= labelPx;
        const need = fits || compact ? 0 : (labelPx + 6) / pxPerMonth;
        let r = rows.findIndex(end => end <= s - need);
        if (r === -1) { r = rows.length; rows.push(0); }
        rows[r] = m.end ? e : Infinity;
        return { ...m, s, e, row: r, ongoing: !m.end, fits };
      });
    return { type, bars, rows: rows.length };
  });

  const years: number[] = [];
  for (let y = Math.ceil(m0 / 12); y * 12 <= m1; y++) years.push(y);
  const ROW = compact ? 15 : 34;
  // phones: '19 '20 …, thinned out if the years get too close
  const yearGap = compact && 12 * pxPerMonth < 26 ? 2 : 1;

  return (
    <div className={compact ? 'mt-1 mb-6' : 'bg-white/[0.03] border border-white/[0.08] rounded-[14px] px-5 pt-4 pb-5 mb-6'}>
      <div className={compact ? 'grid grid-cols-1' : 'grid grid-cols-[92px_1fr] gap-x-3'}>
        {!compact && <div />}
        {/* year ruler */}
        <div className={`relative ${compact ? 'h-5' : 'h-6'}`}>
          {years
            .filter(y => y % yearGap === 0)
            .filter(y => plotW === 0 || Math.abs(y * 12 - now) * pxPerMonth > (compact ? 42 : 44)) // keep clear of "today"
            .map(y => (
              <span key={y} className={`absolute top-0 -translate-x-1/2 ${compact ? 'text-[0.68rem]' : 'text-[0.72rem]'} text-[#5a5a62] tabular-nums`} style={{ left: `${pct(y * 12)}%` }}>
                {compact ? `'${String(y).slice(2)}` : y}
              </span>
            ))}
          <span className={`absolute top-0 -translate-x-1/2 ${compact ? 'text-[0.68rem]' : 'text-[0.72rem]'} text-[#e3a857]`} style={{ left: `${pct(now)}%` }}>
            {labels.today}
          </span>
        </div>

        {tracks.map(tr => (
          <div key={tr.type} className="contents">
            {!compact && (
              <div className="flex items-center text-[0.8rem] text-[#777] border-t border-white/[0.06]">
                {tr.type === 'work' ? labels.work : labels.education}
              </div>
            )}
            <div
              ref={tr.type === 'edu' ? plotRef : undefined}
              className="relative border-t border-white/[0.06]"
              style={{ height: tr.rows * ROW + (compact ? 4 : 12) }}
            >
              {years.map(y => (
                <span key={y} className="absolute inset-y-0 w-px bg-white/[0.05]" style={{ left: `${pct(y * 12)}%` }} />
              ))}
              <span className="absolute inset-y-0 border-l border-dashed border-[#e3a857]/50" style={{ left: `${pct(now)}%` }} />
              {tr.bars.map(b => {
                const tone = TONE[b.type];
                const left = pct(b.s), width = pct(b.e) - left;
                const isActive = active === b.i;
                // fade the part of an ongoing bar that lies in the future
                const solid = b.ongoing ? ((now - b.s) / (b.e - b.s)) * 100 : 100;
                return (
                  <button
                    key={b.i}
                    type="button"
                    onMouseEnter={() => setActive(b.i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(b.i)}
                    onBlur={() => setActive(null)}
                    onClick={() => onPick(b.i)}
                    aria-label={b.short}
                    className="absolute group rounded-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3a857]"
                    style={compact
                      ? { left: `${left}%`, width: `${width}%`, top: 2 + b.row * ROW, height: ROW } // whole row is the tap target
                      : { left: `${left}%`, width: `${width}%`, top: 6 + b.row * ROW, height: ROW - 8 }}
                  >
                    <span
                      className={`absolute border transition-[background-color,box-shadow,opacity] duration-300 ${compact ? 'inset-x-0 top-[3px] bottom-[3px] rounded-[3px]' : 'inset-0 rounded-[6px]'}`}
                      style={{
                        opacity: compact && !isActive ? 0.55 : 1,
                        background: isActive ? tone.barActive : tone.bar,
                        borderColor: tone.edge,
                        boxShadow: isActive ? `0 0 14px ${tone.bar}` : undefined,
                        WebkitMaskImage: b.ongoing ? `linear-gradient(to right, #000 ${solid}%, transparent 100%)` : undefined,
                        maskImage: b.ongoing ? `linear-gradient(to right, #000 ${solid}%, transparent 100%)` : undefined,
                      }}
                    />
                    {!compact && (
                      <span
                        className={`text-[0.75rem] leading-[26px] whitespace-nowrap ${b.fits ? 'relative block px-1.5 text-left' : 'absolute right-[calc(100%+6px)] top-0'}`}
                        style={{ color: tone.text }}
                      >
                        {b.short}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useI18n();
  const items = t.experience.items.map((txt, idx) => ({ ...META[idx], ...txt }));
  const n = items.length;

  // ── Mobile carousel state (stateless circular index → robust under rapid input) ─
  const [i, setI] = useState(0);                 // starts at the oldest entry (Abitur)
  const [pulse, setPulse] = useState(false);
  const [cardH, setCardH] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchX = useRef(0);

  // shortest circular offset of a card from the current index
  const offset = (idx: number) => {
    let o = idx - i;
    if (o > n / 2) o -= n;
    else if (o < -n / 2) o += n;
    return o;
  };

  // wrapping around (newest ↔ oldest) gives the card a little pop
  const wrapPulse = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 360);
  };
  const next = () => setI(p => { const ni = (p + 1) % n; if (ni === 0) wrapPulse(); return ni; });
  const prev = () => setI(p => { if (p === 0) wrapPulse(); return (p - 1 + n) % n; });
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

  // ── Desktop: time axis + gallery of compact tiles (newest first). `active` is the
  // hover link bar ↔ tile; `open` is the one tile showing its details (click on a
  // tile or a bar). The newest entry starts open so the pattern is obvious.
  const gallery = items.map((it, idx) => ({ ...it, idx })).sort((a, b) => month(b.start) - month(a.start));
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpenState] = useState<number | null>(gallery[0]?.idx ?? null);
  const listRefs = useRef<(HTMLElement | null)[]>([]);

  // FLIP: remember where every tile was before the change, then (after React
  // re-laid out the grid) play each one from its old box to its new one. The
  // background layer morphs size + position; the content only glides, and
  // fades in on tiles whose width changed so the text reflow isn't seen.
  const before = useRef<Map<number, DOMRect> | null>(null);
  const setOpen = (idx: number | null) => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      before.current = new Map(gallery.map(g => [g.idx, listRefs.current[g.idx]?.getBoundingClientRect()]).filter((e): e is [number, DOMRect] => !!e[1]));
    }
    setOpenState(idx);
  };
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev) return;
    const opts = { duration: 420, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' };
    for (const [idx, old] of prev) {
      const el = listRefs.current[idx];
      if (!el) continue;
      const now = el.getBoundingClientRect();
      const dx = old.left - now.left, dy = old.top - now.top;
      const sx = old.width / now.width, sy = old.height / now.height;
      // only a width change reflows the text; row-height changes just stretch the box
      const rewrapped = Math.abs(sx - 1) > 0.01;
      if (!rewrapped && Math.abs(sy - 1) < 0.01 && Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      el.querySelector<HTMLElement>('[data-bg]')?.animate(
        [{ transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transformOrigin: 'top left', transform: 'none' }],
        opts,
      );
      el.querySelector<HTMLElement>('[data-fg]')?.animate(
        [{ transform: `translate(${dx}px, ${dy}px)`, opacity: rewrapped ? 0 : 1 }, { transform: 'none', opacity: 1 }],
        opts,
      );
    }
  }, [open]);

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <h2 className="section-title mb-7 md:mb-10" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>
          {t.experience.heading}
        </h2>

        {/* ── DESKTOP: real time axis + gallery ──────────────────────────────── */}
        <div className="hidden md:block">
          <TimeAxis
            active={active ?? open}
            setActive={setActive}
            onPick={idx => {
              setOpen(idx);
              requestAnimationFrame(() => listRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
            }}
            labels={{ work: t.experience.work, education: t.experience.education, today: t.experience.today }}
          />
          {/* dense flow: an opened (double-width) tile never leaves a gap */}
          <div className="grid grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-4">
            {gallery.map(item => {
              const cu = 'companyUrl' in item ? item.companyUrl : undefined;
              const work = item.type === 'work';
              const isOpen = open === item.idx;
              const lit = isOpen || active === item.idx;
              return (
                <article
                  key={item.idx}
                  ref={el => { listRefs.current[item.idx] = el; }}
                  onMouseEnter={() => setActive(item.idx)}
                  onMouseLeave={() => setActive(null)}
                  className={`relative ${isOpen ? 'col-span-2' : ''}`}
                >
                  {/* background + border live on their own layer so FLIP can morph it */}
                  <span
                    data-bg
                    aria-hidden
                    className={`absolute inset-0 rounded-[14px] border backdrop-blur-xl transition-colors ${
                      work ? 'bg-[#e3a857]/[0.04]' : 'bg-[#5fa3a0]/[0.035]'
                    } ${lit ? (work ? 'border-[#e3a857]/45' : 'border-[#5fa3a0]/45') : (work ? 'border-[#e3a857]/[0.14]' : 'border-[#5fa3a0]/[0.14]')}`}
                  />
                  <div data-fg className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : item.idx)}
                    className="w-full text-left p-4 rounded-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3a857]"
                  >
                    <span className="flex items-center gap-2 text-[0.75rem] text-[#6a6a72] mb-2 tabular-nums">
                      {!item.end && (
                        <span className={`w-1.5 h-1.5 rounded-full ${work ? 'bg-[#e3a857] shadow-[0_0_8px_rgba(227,168,87,0.8)]' : 'bg-[#5fa3a0] shadow-[0_0_8px_rgba(95,163,160,0.8)]'}`} />
                      )}
                      {item.date}
                      <span aria-hidden className={`ml-auto text-[1rem] leading-none text-[#777] transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </span>
                    <h3 className="font-semibold text-white leading-snug text-[0.95rem]">{item.title}</h3>
                    <span className={`block text-[0.82rem] mt-1 ${work ? 'text-[#e3a857]' : 'text-[#86c2bf]'}`}>{item.company}</span>
                  </button>
                  {isOpen && (item.description || item.tags.length > 0 || cu) && (
                    <div className="px-4 pb-4" style={{ animation: 'fade-up 0.4s ease 0.18s both' }}>
                      {item.description && <p className="text-[0.88rem] text-[#8a8a92] leading-relaxed">{item.description}</p>}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-[0.75rem] px-2 py-0.5 rounded-[5px] bg-white/[0.06] border border-white/[0.09] text-[#888]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {cu && (
                        <a href={cu} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[0.82rem] text-[#e3a857] hover:underline">
                          {cu.replace(/^https?:\/\/(www\.)?/, '')} ↗
                        </a>
                      )}
                    </div>
                  )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE: compact time axis (position + navigation) above the carousel ── */}
        <div className="md:hidden">
          <TimeAxis
            compact
            active={i}
            setActive={() => {}}
            onPick={goTo}
            labels={{ work: t.experience.work, education: t.experience.education, today: t.experience.today }}
          />

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
