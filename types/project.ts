export type Category = 'ai-ml' | 'web' | 'mobile' | 'research';

/** Visual class of an architecture node — drives its color in the diagram. */
export type ArchKind =
  | 'client'    // app / browser / device the user touches
  | 'server'    // own backend / serverless function
  | 'service'   // external API (Gemini, Stripe, …)
  | 'data'      // datastore / file / DB
  | 'process'   // offline job / training loop / pipeline step
  | 'sim';      // simulator / engine

export interface ArchNode {
  id: string;
  label: string;
  /** Smaller second line under the label. Kept technical/neutral (works in DE & EN). */
  sublabel?: string;
  kind?: ArchKind;
  /** Top-left grid position (arbitrary units; the overlay lays them out as given). */
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  /** Label drawn on the edge (e.g. "POST", "TraCI"). */
  label?: string;
  /** Dashed = secondary / offline / async flow. */
  dashed?: boolean;
}

export interface Architecture {
  /** Nodes of the data-flow diagram, rendered as a React Flow graph in the overlay. */
  nodes: ArchNode[];
  /** Directed edges between nodes. */
  edges: ArchEdge[];
}

/**
 * Structural project data only — language-neutral.
 * Title, descriptions, notes and period live in the i18n files (de.json / en.json)
 * keyed by `id`; read them via useProjectText(id).
 */
export interface Project {
  id: string;
  category: Category;
  tags: string[];
  architecture?: Architecture;
  links?: Array<{ label: string; url: string }>;
  featured?: boolean;
}

export interface CategoryDef {
  id: Category;
  label: string;
  icon: string;
  color: string;
}
