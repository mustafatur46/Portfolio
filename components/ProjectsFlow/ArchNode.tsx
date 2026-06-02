'use client';

import { Handle, Position } from '@xyflow/react';
import type { ArchKind } from '@/types/project';

export const ARCH_NODE_W = 168;
export const ARCH_NODE_H = 60;

const KIND: Record<ArchKind, { color: string; tag: string }> = {
  client:  { color: '#6f8cae', tag: 'Client'   },
  server:  { color: '#e3a857', tag: 'Server'    },
  service: { color: '#cf7257', tag: 'Service'   },
  data:    { color: '#88a36b', tag: 'Data'      },
  process: { color: '#5fa3a0', tag: 'Process'   },
  sim:     { color: '#c2a878', tag: 'Simulator' },
};

export type ArchSide = 'top' | 'bottom' | 'left' | 'right';

/** A single attachment point the canvas asked us to render, at a fraction
 *  (0..1) along its side so multiple edges on one side never overlap. */
export interface ArchHandle {
  id: string;
  side: ArchSide;
  type: 'source' | 'target';
  offset: number;
}

export interface ArchNodeData {
  label: string;
  sublabel?: string;
  kind?: ArchKind;
  handles?: ArchHandle[];
  [key: string]: unknown;
}

const POS: Record<ArchSide, Position> = {
  top:    Position.Top,
  bottom: Position.Bottom,
  left:   Position.Left,
  right:  Position.Right,
};

const HANDLE_STYLE = { opacity: 0, width: 1, height: 1, border: 'none', minWidth: 0, minHeight: 0 } as const;

// Position the (invisible) handle along its side. Left/right slide vertically,
// top/bottom slide horizontally; 0.5 keeps the classic centered attachment.
function offsetStyle(side: ArchSide, offset: number) {
  const pct = `${offset * 100}%`;
  return side === 'left' || side === 'right' ? { top: pct } : { left: pct };
}

export default function ArchNode({ data }: { data: ArchNodeData }) {
  const k = KIND[data.kind ?? 'process'];
  const handles = data.handles ?? [];

  return (
    <div
      className="relative rounded-[10px] border flex flex-col justify-center px-3"
      style={{
        width:        ARCH_NODE_W,
        height:       ARCH_NODE_H,
        background:   `linear-gradient(180deg, ${k.color}1c, ${k.color}0a)`,
        borderColor:  `${k.color}55`,
        boxShadow:    `0 0 22px ${k.color}1a, inset 0 1px 0 ${k.color}22`,
      }}
    >
      {handles.map(h => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={POS[h.side]}
          style={{ ...HANDLE_STYLE, ...offsetStyle(h.side, h.offset) }}
        />
      ))}

      <span
        className="absolute -top-[7px] left-2.5 text-[0.52rem] font-bold uppercase tracking-[1px] px-1.5 py-[1px] rounded-[4px]"
        style={{ background: `${k.color}`, color: '#08080a' }}
      >
        {k.tag}
      </span>

      <div className="text-[0.78rem] font-semibold text-white leading-tight truncate">
        {data.label}
      </div>
      {data.sublabel && (
        <div className="text-[0.62rem] font-mono leading-tight mt-0.5 truncate" style={{ color: `${k.color}cc` }}>
          {data.sublabel}
        </div>
      )}
    </div>
  );
}
