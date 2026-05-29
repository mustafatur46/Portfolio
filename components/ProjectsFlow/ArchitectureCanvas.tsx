'use client';

import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ArchNode, { ARCH_NODE_W, ARCH_NODE_H } from './ArchNode';
import type { Architecture } from '@/types/project';

const nodeTypes = { arch: ArchNode };

// Pick the cleanest handle pair for an edge from the relative position of two nodes.
// `secondary` rotates the chosen axis by 90° so an anti-parallel return edge
// bows around its partner instead of overlapping it (and its label).
function pickHandles(
  from: { x: number; y: number },
  to: { x: number; y: number },
  secondary = false,
): { sourceHandle: string; targetHandle: string } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  const useHorizontal = secondary ? !horizontal : horizontal;
  if (useHorizontal) {
    return dx > 0
      ? { sourceHandle: 'right-s', targetHandle: 'left-t' }
      : { sourceHandle: 'left-s',  targetHandle: 'right-t' };
  }
  return dy > 0
    ? { sourceHandle: 'bottom-s', targetHandle: 'top-t' }
    : { sourceHandle: 'top-s',    targetHandle: 'bottom-t' };
}

interface Props {
  architecture: Architecture;
  color: string;
  /** Key that forces React Flow to re-fit when the selected project changes. */
  fitKey?: string;
}

export default function ArchitectureCanvas({ architecture: arch, color, fitKey }: Props) {
  const { rfNodes, rfEdges } = useMemo(() => {
    const pos = new Map(arch.nodes.map(n => [n.id, { x: n.x, y: n.y }]));
    const pairKey = (a: string, b: string) => `${a}->${b}`;
    const edgeSet = new Set(arch.edges.map(e => pairKey(e.from, e.to)));

    const rfNodes: Node[] = arch.nodes.map(n => ({
      id:   n.id,
      type: 'arch',
      position: { x: n.x, y: n.y },
      data: { label: n.label, sublabel: n.sublabel, kind: n.kind },
      width:  ARCH_NODE_W,
      height: ARCH_NODE_H,
      draggable: true,
    }));

    const rfEdges: Edge[] = arch.edges.map((e, i) => {
      const from = pos.get(e.from)!;
      const to   = pos.get(e.to)!;
      const hasReverse = edgeSet.has(pairKey(e.to, e.from));
      const secondary  = hasReverse && (e.dashed || (!arch.edges.some(o => o.from === e.to && o.to === e.from && o.dashed) && e.from > e.to));
      const { sourceHandle, targetHandle } = pickHandles(from, to, secondary);
      return {
        id:     `e${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        sourceHandle,
        targetHandle,
        label:  e.label,
        type:   'smoothstep',
        animated: !e.dashed,
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
        style: {
          stroke: color,
          strokeWidth: 1.6,
          strokeDasharray: e.dashed ? '5 4' : undefined,
          opacity: e.dashed ? 0.55 : 0.9,
        },
        labelStyle:     { fill: '#cfcfcf', fontSize: 10, fontFamily: 'ui-monospace, monospace', fontWeight: 600 },
        labelBgStyle:   { fill: 'rgba(8,8,10,0.9)' },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
      };
    });

    return { rfNodes, rfEdges };
  }, [arch, color]);

  return (
    <ReactFlow
      key={fitKey}
      nodes={rfNodes}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.18 }}
      minZoom={0.3}
      maxZoom={1.8}
      nodesConnectable={false}
      edgesFocusable={false}
      proOptions={{ hideAttribution: true }}
      style={{ background: 'transparent' }}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.05)" />
      <Controls
        showInteractive={false}
        className="!bottom-3 !left-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
      />
    </ReactFlow>
  );
}
