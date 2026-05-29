import type { Node, Edge } from '@xyflow/react';
import { PROJECTS, CATEGORIES } from '@/data/projects';
import type { Category } from '@/types/project';

// ─── Hub-Positionen (Diamond-Layout) ─────────────────────────────────────────
const HUB_POS: Record<Category, { x: number; y: number }> = {
  'ai-ml':    { x: 460, y:  30 },
  'web':      { x: 860, y: 320 },
  'mobile':   { x: 460, y: 610 },
  'research': { x:  60, y: 320 },
};

// Winkel zeigt vom Zentrum (460,320) weg — jeder Hub "strahlt nach außen"
const HUB_ANGLE: Record<Category, number> = {
  'ai-ml':    -Math.PI / 2,   // nach oben
  'web':       0,              // nach rechts
  'mobile':    Math.PI / 2,   // nach unten
  'research':  Math.PI,        // nach links
};

const RADIUS   = 270;  // Abstand Hub → Projekt-Node (erhöht für 292px-Karten)
const SPREAD   = 1.05; // Fächerbreite in Radiant für mehrere Projekte

export function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // ── Hub-Nodes ──────────────────────────────────────────────────────────────
  for (const cat of CATEGORIES) {
    nodes.push({
      id: `cat-${cat.id}`,
      type: 'categoryNode',
      position: HUB_POS[cat.id],
      data: { ...cat } as unknown as Record<string, unknown>,
    });
  }

  // ── Projekt-Nodes (radial um ihren Hub) ───────────────────────────────────
  const byCategory = CATEGORIES.map(c => ({
    cat: c,
    projects: PROJECTS.filter(p => p.category === c.id),
  }));

  for (const { cat, projects } of byCategory) {
    const hub    = HUB_POS[cat.id];
    const base   = HUB_ANGLE[cat.id];
    const count  = projects.length;

    projects.forEach((project, i) => {
      const offset = count === 1 ? 0 : (i / (count - 1) - 0.5) * SPREAD;
      const angle  = base + offset;

      const cx = hub.x + Math.cos(angle) * RADIUS;
      const cy = hub.y + Math.sin(angle) * RADIUS;

      nodes.push({
        id: project.id,
        type: 'projectNode',
        // Node-Breite ~280px, Höhe ~120px → zentriert
        position: { x: cx - 140, y: cy - 60 },
        data: { project },
      });

      edges.push({
        id: `e-${cat.id}-${project.id}`,
        source: `cat-${cat.id}`,
        target: project.id,
        style: { stroke: cat.color, strokeWidth: 1.5, opacity: 0.4 },
        animated: project.featured ?? false,
      });
    });
  }

  return { nodes, edges };
}
