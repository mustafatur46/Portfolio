'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import type { CategoryDef } from '@/types/project';
import { PROJECTS } from '@/data/projects';

export default function CategoryNode({ data }: NodeProps) {
  const cat    = data as unknown as CategoryDef;
  const count  = PROJECTS.filter(p => p.category === cat.id).length;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 112, height: 112 }}
    >
      {/* Outer pulsing ring */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-ring"
        style={{ background: cat.color }}
      />

      {/* Static glowing ring */}
      <div
        className="absolute inset-[5px] rounded-full border"
        style={{
          borderColor: `${cat.color}55`,
          boxShadow: `0 0 28px ${cat.color}40, inset 0 0 16px ${cat.color}12`,
        }}
      />

      {/* Inner disc */}
      <div
        className="relative z-10 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 38%, ${cat.color}28, ${cat.color}0c)`,
        }}
      >
        <span className="text-[1.55rem] leading-none">{cat.icon}</span>
        <span
          className="mt-[3px] text-[9.5px] font-bold tracking-[0.6px] uppercase"
          style={{ color: cat.color }}
        >
          {cat.label}
        </span>
      </div>

      {/* Project count badge */}
      <div
        className="absolute -top-0.5 -right-0.5 z-20 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold text-white border-[2px] border-[#0a0a0a]"
        style={{ background: cat.color }}
      >
        {count}
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left}  className="opacity-0" />
    </div>
  );
}
