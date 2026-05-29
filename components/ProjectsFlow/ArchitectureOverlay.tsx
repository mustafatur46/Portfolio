'use client';

import { useEffect } from 'react';
import ArchitectureCanvas from './ArchitectureCanvas';
import type { Project } from '@/types/project';

interface Props {
  project: Project;
  color: string;
  onClose: () => void;
}

export default function ArchitectureOverlay({ project, color, onClose }: Props) {
  const arch = project.architecture;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!arch) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-up"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1100px] h-[78vh] rounded-[18px] border overflow-hidden flex flex-col"
        style={{
          background:   'rgba(9,9,11,0.98)',
          borderColor:  `${color}45`,
          boxShadow:    `0 0 80px ${color}22, 0 30px 70px rgba(0,0,0,0.8)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[3px] flex-shrink-0" style={{ background: `linear-gradient(90deg, ${color}, ${color}50, transparent)` }} />

        <div className="flex items-center justify-between px-6 py-3.5 flex-shrink-0 border-b border-white/[0.06]">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[1.5px]" style={{ color }}>
              Architektur
            </p>
            <h3 className="text-white font-bold text-[1rem] leading-tight">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#666] hover:text-white hover:bg-white/10 transition-colors text-[1.3rem] leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <ArchitectureCanvas architecture={arch} color={color} fitKey={project.id} />
        </div>
      </div>
    </div>
  );
}
