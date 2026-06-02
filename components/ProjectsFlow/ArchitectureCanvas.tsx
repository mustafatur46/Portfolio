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

import ArchNode, { ARCH_NODE_W, ARCH_NODE_H, type ArchSide, type ArchHandle } from './ArchNode';
import type { Architecture } from '@/types/project';

const nodeTypes = { arch: ArchNode };

// Which side of each box an edge leaves from / arrives at, purely from the
// relative position of the two nodes.
function sidesFor(
  from: { x: number; y: number },
  to: { x: number; y: number },
): { sourceSide: ArchSide; targetSide: ArchSide } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0
      ? { sourceSide: 'right', targetSide: 'left' }
      : { sourceSide: 'left',  targetSide: 'right' };
  }
  return dy > 0
    ? { sourceSide: 'bottom', targetSide: 'top' }
    : { sourceSide: 'top',    targetSide: 'bottom' };
}

interface Props {
  architecture: Architecture;
  color: string;
  /** Key that forces React Flow to re-fit when the selected project changes. */
  fitKey?: string;
}

export default function ArchitectureCanvas({ architecture: arch, color, fitKey }: Props) {
  const { rfNodes, rfEdges } = useMemo(() => {
    const pos = new Map(arch.nodes.map(n => [n.id, { x: n.x + ARCH_NODE_W / 2, y: n.y + ARCH_NODE_H / 2 }]));

    // 1) For every edge, decide which side each end attaches to, and record that
    //    attachment under (node, side) together with the *other* end's centre so
    //    we can fan them out without crossing.
    type Slot = { edge: number; type: 'source' | 'target'; otherX: number; otherY: number };
    const slots = new Map<string, Slot[]>();
    const slotKey = (node: string, side: ArchSide) => `${node}|${side}`;
    const push = (node: string, side: ArchSide, s: Slot) => {
      const k = slotKey(node, side);
      (slots.get(k) ?? slots.set(k, []).get(k)!).push(s);
    };

    const sides = arch.edges.map(e => sidesFor(pos.get(e.from)!, pos.get(e.to)!));
    arch.edges.forEach((e, i) => {
      const from = pos.get(e.from)!, to = pos.get(e.to)!;
      push(e.from, sides[i].sourceSide, { edge: i, type: 'source', otherX: to.x,   otherY: to.y });
      push(e.to,   sides[i].targetSide, { edge: i, type: 'target', otherX: from.x, otherY: from.y });
    });

    // 2) Spread the slots along each side. Sorting by the other end's cross-axis
    //    coordinate keeps the lines from crossing; a single slot stays centred.
    const handleOf = new Map<string, string>(); // `${edge}-${type}` → handle id
    const nodeHandles = new Map<string, ArchHandle[]>();
    for (const [k, list] of slots) {
      const [node, side] = k.split('|') as [string, ArchSide];
      const horizontal = side === 'left' || side === 'right';
      list.sort((a, b) =>
        (horizontal ? a.otherY - b.otherY : a.otherX - b.otherX) || a.edge - b.edge,
      );
      const n = list.length;
      list.forEach((s, idx) => {
        const id = `${side}-${s.type[0]}-${idx}`;
        const offset = (idx + 1) / (n + 1);
        handleOf.set(`${s.edge}-${s.type}`, id);
        (nodeHandles.get(node) ?? nodeHandles.set(node, []).get(node)!).push({ id, side, type: s.type, offset });
      });
    }

    const rfNodes: Node[] = arch.nodes.map(n => ({
      id:   n.id,
      type: 'arch',
      position: { x: n.x, y: n.y },
      data: { label: n.label, sublabel: n.sublabel, kind: n.kind, handles: nodeHandles.get(n.id) ?? [] },
      width:  ARCH_NODE_W,
      height: ARCH_NODE_H,
      draggable: true,
    }));

    const rfEdges: Edge[] = arch.edges.map((e, i) => {
      return {
        id:     `e${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        sourceHandle: handleOf.get(`${i}-source`),
        targetHandle: handleOf.get(`${i}-target`),
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
