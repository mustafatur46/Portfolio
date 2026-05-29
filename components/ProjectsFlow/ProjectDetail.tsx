'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { CATEGORIES } from '@/data/projects';
import ArchitectureOverlay from './ArchitectureOverlay';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
  Java: '#b07219', 'C#': '#178600', HTML: '#e34c26', CSS: '#563d7c',
  'React Native': '#61dafb', 'Next.js': '#e2e8f0', Django: '#44b78b',
  Angular: '#dd0031', Flutter: '#54c5f8', Unity: '#cccccc', SQL: '#e38c00',
};

export default function ProjectDetail({ project, onClose }: Props) {
  // Cache content so we can animate out before unmounting
  const [displayed, setDisplayed] = useState<Project | null>(null);
  const [open, setOpen]           = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const timer                     = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setShowDiagram(false);

    if (project) {
      setDisplayed(project);
      // Double rAF: mount → paint → trigger transition
      requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    } else {
      setOpen(false);
      timer.current = setTimeout(() => setDisplayed(null), 240);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [project]);

  if (!displayed) return null;

  const cat   = CATEGORIES.find(c => c.id === displayed.category);
  const color = cat?.color ?? '#a855f7';
  const p     = displayed;

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 240);
  };

  return (
    <>
    <div
      className="absolute top-3 right-3 bottom-3 w-[340px] z-50 flex flex-col rounded-[16px] border overflow-hidden"
      style={{
        background:     'rgba(7,7,7,0.97)',
        borderColor:    `${color}45`,
        backdropFilter: 'blur(28px)',
        boxShadow:      `0 0 60px ${color}20, 0 24px 56px rgba(0,0,0,0.7)`,
        transform:      open ? 'translateX(0)' : 'translateX(calc(100% + 20px))',
        opacity:        open ? 1 : 0,
        transition:     'transform 240ms cubic-bezier(0.4,0,0.2,1), opacity 240ms ease',
      }}
    >
      {/* Colored header strip */}
      <div
        className="h-[3px] flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}50, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-5 pt-4 pb-3.5 flex-shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[1rem]">{cat?.icon}</span>
            <span className="text-[0.7rem] font-bold uppercase tracking-[1.2px]" style={{ color }}>
              {cat?.label}
            </span>
            {p.featured && (
              <span
                className="text-[0.62rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[4px]"
                style={{ background: `${color}1e`, color }}
              >
                ★ featured
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-[1rem] leading-snug">{p.title}</h3>
          {p.period && (
            <p className="text-[0.72rem] text-[#444] mt-0.5 font-mono">{p.period}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          aria-label="Close"
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[#444] hover:text-white hover:bg-white/8 transition-colors text-[1.2rem] leading-none mt-0.5"
        >
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-5">
        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Overview */}
        <div className="animate-fade-up">
          <p className="text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2">
            Overview
          </p>
          <p className="text-[0.84rem] text-[#aaa] leading-[1.78]">{p.fullDescription}</p>
        </div>

        {/* Architecture */}
        {p.architecture && (
          <div className="animate-fade-up" style={{ animationDelay: '30ms' }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5">
              Architektur
            </p>
            <button
              onClick={() => setShowDiagram(true)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-[10px] border transition-all group/diagram"
              style={{ background: `${color}12`, borderColor: `${color}38` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}22`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}12`; }}
            >
              <span className="flex items-center gap-2">
                <span className="text-[0.95rem]" style={{ color }}>⊞</span>
                <span className="text-[0.82rem] font-semibold text-white">Architektur-Diagramm ansehen</span>
              </span>
              <span
                className="text-[0.82rem] transition-transform group-hover/diagram:translate-x-0.5"
                style={{ color }}
              >
                ↗
              </span>
            </button>
            {p.architecture.notes && p.architecture.notes.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {p.architecture.notes.map((note, i) => (
                  <li
                    key={i}
                    className="text-[0.78rem] text-[#999] leading-[1.6] pl-3.5 relative"
                  >
                    <span
                      className="absolute left-0 top-[0.55em] w-[5px] h-[5px] rounded-full"
                      style={{ background: color }}
                    />
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tech Stack */}
        <div className="animate-fade-up" style={{ animationDelay: '40ms' }}>
          <p className="text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5">
            Tech Stack
          </p>
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
                  {lc && (
                    <span
                      className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                      style={{ background: lc }}
                    />
                  )}
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Links */}
        {p.links && p.links.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#444] mb-2.5">
              Links
            </p>
            <div className="flex flex-col gap-2">
              {p.links.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-[10px] border transition-all no-underline group/link"
                  style={{ background: `${color}0e`, borderColor: `${color}32` }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background     = `${color}1e`;
                    (e.currentTarget as HTMLElement).style.borderColor    = `${color}60`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background     = `${color}0e`;
                    (e.currentTarget as HTMLElement).style.borderColor    = `${color}32`;
                  }}
                >
                  <span className="text-[0.83rem] font-semibold text-white">{link.label}</span>
                  <span
                    className="text-[0.82rem] transition-transform group-hover/link:translate-x-0.5"
                    style={{ color }}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    {showDiagram && p.architecture && (
      <ArchitectureOverlay project={p} color={color} onClose={() => setShowDiagram(false)} />
    )}
    </>
  );
}
