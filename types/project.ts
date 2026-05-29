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
  /** Smaller second line under the label. */
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
  /** Key architectural decisions / highlights, shown as accent-colored bullets in the panel. */
  notes?: string[];
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  tags: string[];
  /** Real architecture pulled from the project's own source — reflected in the detail panel. */
  architecture?: Architecture;
  links?: Array<{ label: string; url: string }>;
  featured?: boolean;
  period?: string;
}

export interface CategoryDef {
  id: Category;
  label: string;
  icon: string;
  color: string;
}
