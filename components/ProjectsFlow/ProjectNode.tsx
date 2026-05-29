'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import type { Project } from '@/types/project';
import { CATEGORIES } from '@/data/projects';

// GitHub-style language colors
const LANG_COLORS: Record<string, string> = {
  Python:          '#3572A5',
  JavaScript:      '#f1e05a',
  TypeScript:      '#3178c6',
  Java:            '#b07219',
  'C#':            '#178600',
  HTML:            '#e34c26',
  CSS:             '#563d7c',
  'React Native':  '#61dafb',
  'Next.js':       '#e2e8f0',
  Django:          '#44b78b',
  Angular:         '#dd0031',
  Flutter:         '#54c5f8',
  Unity:           '#ffffff',
  SQL:             '#e38c00',
};

function getPrimaryLang(tags: string[]) {
  for (const tag of tags) {
    if (LANG_COLORS[tag]) return { name: tag, color: LANG_COLORS[tag] };
  }
  return null;
}

interface ProjectNodeData {
  project: Project;
  onSelect: (p: Project) => void;
}

export default function ProjectNode({ data }: NodeProps) {
  const { project, onSelect } = data as unknown as ProjectNodeData;
  const cat   = CATEGORIES.find(c => c.id === project.category);
  const color = cat?.color ?? '#a855f7';
  const lang  = getPrimaryLang(project.tags);

  // Non-lang tags for chips (max 3)
  const chipTags = project.tags.filter(t => !LANG_COLORS[t]).slice(0, 3);

  return (
    <div
      onClick={() => onSelect?.(project)}
      className="group relative cursor-pointer"
      style={{ width: 292 }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform  = 'translateY(-3px)';
        el.style.transition = 'transform 180ms ease';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Card */}
      <div
        className="rounded-[14px] border overflow-hidden"
        style={{
          background:   'rgba(10,10,10,0.88)',
          borderColor:  project.featured ? `${color}50` : 'rgba(255,255,255,0.07)',
          boxShadow:    project.featured ? `0 0 22px ${color}22` : 'none',
          backdropFilter: 'blur(20px)',
          transition:   'border-color 180ms ease, box-shadow 180ms ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = `${color}80`;
          el.style.boxShadow   = `0 8px 32px ${color}28`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = project.featured ? `${color}50` : 'rgba(255,255,255,0.07)';
          el.style.boxShadow   = project.featured ? `0 0 22px ${color}22` : 'none';
        }}
      >
        {/* Colored top accent line */}
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${color} 0%, ${color}30 60%, transparent 100%)` }}
        />

        {/* macOS-style traffic-light header */}
        <div
          className="flex items-center gap-[5px] px-3.5 py-[7px] border-b"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <span className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]/65 flex-shrink-0" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#febc2e]/65 flex-shrink-0" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#28c840]/65 flex-shrink-0" />
          {project.featured && (
            <span
              className="ml-1.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ color }}
            >
              ★ featured
            </span>
          )}
          {project.period && (
            <span className="ml-auto text-[9.5px] text-[#3a3a3a] font-mono tracking-tight">
              {project.period}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-3.5 pt-3 pb-2.5">
          <h3 className="text-[0.9rem] font-semibold text-white leading-snug mb-1.5">
            {project.title}
          </h3>
          <p className="text-[0.77rem] text-[#666] leading-relaxed line-clamp-2 mb-3">
            {project.shortDescription}
          </p>

          {/* Language dot + tech chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {lang && (
              <div className="flex items-center gap-[5px] mr-0.5">
                <span
                  className="w-[9px] h-[9px] rounded-full flex-shrink-0"
                  style={{ background: lang.color }}
                />
                <span className="text-[0.69rem] text-[#555]">{lang.name}</span>
              </div>
            )}
            {chipTags.map(tag => (
              <span
                key={tag}
                className="text-[0.65rem] px-[6px] py-[2px] rounded-[5px] border"
                style={{
                  background:   `${color}10`,
                  borderColor:  `${color}28`,
                  color:        `${color}bb`,
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.filter(t => !LANG_COLORS[t]).length > 3 && (
              <span className="text-[0.65rem] text-[#3a3a3a]">
                +{project.tags.filter(t => !LANG_COLORS[t]).length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-3.5 py-[7px] border-t"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <span className="text-[0.68rem] text-[#333]">
            {cat?.icon} {cat?.label}
          </span>
          <span
            className="text-[0.7rem] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ color }}
          >
            Details →
          </span>
        </div>
      </div>

      <Handle type="target" position={Position.Left}  className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}
