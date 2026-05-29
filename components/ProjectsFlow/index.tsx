'use client';

import { useState } from 'react';
import ArchitectureCanvas from './ArchitectureCanvas';
import ArchitectureOverlay from './ArchitectureOverlay';
import { PROJECTS, CATEGORIES } from '@/data/projects';
import { useI18n, type ProjectText } from '@/components/i18n';

const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
  Java: '#b07219', 'C#': '#178600', HTML: '#e34c26', CSS: '#563d7c',
  'React Native': '#61dafb', 'Next.js': '#e2e8f0', Django: '#44b78b',
  Angular: '#dd0031', Flutter: '#54c5f8', Unity: '#cccccc', SQL: '#e38c00',
  Expo: '#000020', Supabase: '#3ecf8e', 'Stripe Connect': '#635bff',
};

export default function ProjectsFlow() {
  const { t } = useI18n();
  const ps = t.projectsSection;
  const text = t.projects as Record<string, ProjectText>;

  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);
  const [fullscreen, setFullscreen] = useState(false);

  const p     = PROJECTS.find(pr => pr.id === selectedId) ?? PROJECTS[0];
  const cat   = CATEGORIES.find(c => c.id === p.category);
  const color = cat?.color ?? '#a855f7';
  const txt   = text[p.id];

  return (
    <div>
      <h2
        className="font-bold mb-3 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
      >
        {ps.heading}
      </h2>
      <p className="text-[#888] text-[1.05rem] mb-8 max-w-[600px]">{ps.intro}</p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* ── Project selector (sidebar) ─────────────────────────────────── */}
        <aside className="md:w-[236px] md:flex-shrink-0">
          <p className="text-[0.62rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5 px-1">
            {ps.sidebar}
          </p>
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {PROJECTS.map(pr => {
              const prCat   = CATEGORIES.find(c => c.id === pr.category);
              const prColor = prCat?.color ?? '#a855f7';
              const active  = pr.id === selectedId;
              const prTxt   = text[pr.id];
              return (
                <button
                  key={pr.id}
                  onClick={() => setSelectedId(pr.id)}
                  className="group flex items-center gap-2.5 text-left px-3 py-2.5 rounded-[11px] border transition-all flex-shrink-0 md:flex-shrink md:w-full"
                  style={
                    active
                      ? { background: `${prColor}1c`, borderColor: `${prColor}55` }
                      : { background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.06)' }
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                    style={{ background: prColor, boxShadow: active ? `0 0 8px ${prColor}` : 'none' }}
                  />
                  <span className="min-w-0">
                    <span
                      className="block text-[0.84rem] font-semibold truncate leading-tight"
                      style={{ color: active ? '#fff' : '#bbb' }}
                    >
                      {prTxt.title}
                    </span>
                    <span className="block text-[0.62rem] font-mono text-[#555] leading-tight mt-0.5">
                      {prTxt.period}
                    </span>
                  </span>
                  {pr.featured && <span className="ml-auto text-[0.6rem]" style={{ color: prColor }}>★</span>}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Detail window ──────────────────────────────────────────────── */}
        <div
          className="flex-1 min-w-0 rounded-[16px] border overflow-hidden flex flex-col"
          style={{ background: 'rgba(7,7,7,0.6)', borderColor: `${color}33` }}
        >
          <div className="h-[3px] flex-shrink-0" style={{ background: `linear-gradient(90deg, ${color}, ${color}50, transparent)` }} />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3.5 flex-shrink-0 border-b border-white/[0.06]">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[1rem]">{cat?.icon}</span>
                <span className="text-[0.66rem] font-bold uppercase tracking-[1.2px]" style={{ color }}>
                  {cat?.label}
                </span>
                {p.featured && (
                  <span
                    className="text-[0.58rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[4px]"
                    style={{ background: `${color}1e`, color }}
                  >
                    ★ featured
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-[1.05rem] leading-snug">{txt.title}</h3>
            </div>
            {p.architecture && (
              <button
                onClick={() => setFullscreen(true)}
                aria-label={ps.fullscreen}
                title={ps.fullscreen}
                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] border text-[0.7rem] font-semibold transition-all"
                style={{ background: `${color}12`, borderColor: `${color}38`, color }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}24`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}12`; }}
              >
                ⤢ <span className="hidden sm:inline">{ps.fullscreen}</span>
              </button>
            )}
          </div>

          {/* Diagram area */}
          <div className="relative h-[420px] flex-shrink-0" style={{ background: `${color}06` }}>
            {p.architecture ? (
              <ArchitectureCanvas architecture={p.architecture} color={color} fitKey={p.id} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
                <span className="text-[1.6rem] opacity-40">🗺️</span>
                <p className="text-[0.85rem] text-[#777] font-semibold">{ps.noDiagramTitle}</p>
                <p className="text-[0.72rem] text-[#555] max-w-[320px]">{ps.noDiagramBody}</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="px-5 py-5 flex flex-col gap-5 border-t border-white/[0.06]">
            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2">{ps.overview}</p>
              <p className="text-[0.86rem] text-[#aaa] leading-[1.78]">{txt.full}</p>
            </div>

            {txt.notes && txt.notes.length > 0 && (
              <div>
                <p className="text-[0.66rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5">{ps.keyDecisions}</p>
                <ul className="flex flex-col gap-1.5">
                  {txt.notes.map((note, i) => (
                    <li key={i} className="text-[0.8rem] text-[#999] leading-[1.6] pl-3.5 relative">
                      <span className="absolute left-0 top-[0.55em] w-[5px] h-[5px] rounded-full" style={{ background: color }} />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5">{ps.techStack}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(tag => {
                  const lc = LANG_COLORS[tag];
                  return (
                    <span
                      key={tag}
                      className="text-[0.72rem] px-2 py-1 rounded-[6px] border font-mono flex items-center gap-1.5"
                      style={{
                        background:  lc ? `${lc}14` : `${color}10`,
                        borderColor: lc ? `${lc}30` : `${color}28`,
                        color:       lc ? `${lc}dd` : `${color}cc`,
                      }}
                    >
                      {lc && <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: lc }} />}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {p.links && p.links.length > 0 && (
              <div>
                <p className="text-[0.66rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5">{ps.links}</p>
                <div className="flex flex-wrap gap-2">
                  {p.links.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] border transition-all no-underline group/link"
                      style={{ background: `${color}0e`, borderColor: `${color}32` }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background  = `${color}1e`;
                        (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background  = `${color}0e`;
                        (e.currentTarget as HTMLElement).style.borderColor = `${color}32`;
                      }}
                    >
                      <span className="text-[0.83rem] font-semibold text-white">{link.label}</span>
                      <span className="text-[0.82rem] transition-transform group-hover/link:translate-x-0.5" style={{ color }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && p.architecture && (
        <ArchitectureOverlay
          architecture={p.architecture}
          title={txt.title}
          label={ps.architecture}
          color={color}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
