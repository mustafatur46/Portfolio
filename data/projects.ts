import { Project, CategoryDef } from '@/types/project';

// ─── Kategorie-Definitionen ──────────────────────────────────────────────────
// Jede Kategorie liefert die Farbe für die Projekt-Punkte/Akzente.
export const CATEGORIES: CategoryDef[] = [
  { id: 'ai-ml',    label: 'AI / ML',   icon: '🤖', color: '#a855f7' },
  { id: 'web',      label: 'Web Dev',   icon: '🌐', color: '#3b82f6' },
  { id: 'mobile',   label: 'Mobile',    icon: '📱', color: '#10b981' },
  { id: 'research', label: 'Research',  icon: '🔬', color: '#f59e0b' },
];

// ─── Projekte (nur Struktur) ─────────────────────────────────────────────────
// Texte (title/short/full/notes/period) liegen in data/i18n/{de,en}.json unter
// `projects.<id>` und werden via useProjectText(id) gelesen.
// Diagramm-Labels sind bewusst technisch/englisch gehalten → in beiden Sprachen lesbar.
export const PROJECTS: Project[] = [
  {
    id: 'chatbot',
    category: 'ai-ml',
    tags: ['RAG', 'Gemini API', 'Python', 'Flask', 'NumPy', 'Vercel'],
    architecture: {
      nodes: [
        { id: 'browser', label: 'Browser', sublabel: 'Vanilla JS + Showdown', kind: 'client',  x: 320, y: 0   },
        { id: 'flask',   label: 'Flask /api/chat', sublabel: 'Vercel Serverless', kind: 'server', x: 320, y: 180 },
        { id: 'embed',   label: 'Gemini Embedding 001', sublabel: 'RETRIEVAL_QUERY', kind: 'service', x: 640, y: 70  },
        { id: 'numpy',   label: 'NumPy cosine', sublabel: 'matmul vs. matrix', kind: 'process', x: 640, y: 180 },
        { id: 'flash',   label: 'Gemini 2.5 Flash', sublabel: 'generate + guardrail', kind: 'service', x: 640, y: 290 },
        { id: 'json',    label: 'embeddings.json', sublabel: 'normalized matrix', kind: 'data', x: 320, y: 380 },
        { id: 'build',   label: 'build_index.py', sublabel: 'profile.md → chunks', kind: 'process', x: 320, y: 520 },
      ],
      edges: [
        { from: 'browser', to: 'flask', label: 'POST' },
        { from: 'flask', to: 'embed',  label: '1 · embed' },
        { from: 'flask', to: 'numpy',  label: '2 · retrieve' },
        { from: 'flask', to: 'flash',  label: '4 · generate' },
        { from: 'json',  to: 'numpy',  label: 'matrix · top-3' },
        { from: 'build', to: 'json',   label: 'offline', dashed: true },
      ],
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/mustafatur46/ChatBot' },
    ],
    featured: true,
  },
  {
    id: 'rl-traffic',
    category: 'ai-ml',
    tags: ['Reinforcement Learning', 'MaskablePPO', 'Gymnasium', 'SUMO / TraCI', 'PyTorch', 'Optuna', 'Python'],
    architecture: {
      nodes: [
        { id: 'training', label: 'training.py', sublabel: 'entry point', kind: 'process', x: 20,  y: 40  },
        { id: 'vecenv',   label: 'SubprocVecEnv', sublabel: 'N× parallel', kind: 'process', x: 20,  y: 180 },
        { id: 'ppo',      label: 'MaskablePPO', sublabel: 'sb3-contrib · PyTorch', kind: 'server', x: 20, y: 320 },
        { id: 'optuna',   label: 'Optuna', sublabel: 'HPO + TensorBoard', kind: 'process', x: 20, y: 470 },
        { id: 'mask',     label: 'MaskedSumoEnv', sublabel: 'ActionMasker', kind: 'process', x: 280, y: 320 },
        { id: 'env',      label: 'SumoEnvironment', sublabel: 'Gymnasium env', kind: 'process', x: 540, y: 320 },
        { id: 'sumo',     label: 'SUMO', sublabel: 'junction J13', kind: 'sim', x: 820, y: 320 },
        { id: 'observer', label: 'SumoObserver', sublabel: '13-key Dict-Obs', kind: 'process', x: 470, y: 150 },
        { id: 'reward',   label: 'RewardCalculator', sublabel: 'wait+queue+fair', kind: 'process', x: 720, y: 150 },
        { id: 'tl',       label: 'TrafficLightManager', sublabel: 'phase FSM', kind: 'process', x: 470, y: 500 },
        { id: 'curr',     label: 'CurriculumManager', sublabel: '4 levels · HDF5', kind: 'data', x: 720, y: 500 },
        { id: 'weather',  label: 'WeatherManager', sublabel: 'Open-Meteo → μ', kind: 'service', x: 960, y: 500 },
      ],
      edges: [
        { from: 'training', to: 'vecenv', label: 'spawn' },
        { from: 'vecenv',   to: 'ppo',    label: 'rollouts' },
        { from: 'optuna',   to: 'ppo',    label: 'tunes', dashed: true },
        { from: 'ppo',      to: 'mask',   label: 'action' },
        { from: 'mask',     to: 'env',    label: 'wraps' },
        { from: 'env',      to: 'sumo',   label: 'TraCI' },
        { from: 'sumo',     to: 'env',    label: 'state', dashed: true },
        { from: 'env',      to: 'observer', label: 'obs' },
        { from: 'env',      to: 'reward',   label: 'reward' },
        { from: 'env',      to: 'tl',       label: 'phases' },
        { from: 'env',      to: 'curr',     label: 'metrics' },
        { from: 'env',      to: 'weather',  label: 'params' },
      ],
    },
  },
  {
    id: 'beautify',
    category: 'mobile',
    tags: ['Expo', 'React Native', 'Supabase', 'Stripe Connect', 'Escrow', 'TypeScript'],
    architecture: {
      nodes: [
        { id: 'app',      label: 'Expo App', sublabel: 'iOS · Android (RN)', kind: 'client', x: 40,  y: 150 },
        { id: 'supabase', label: 'Supabase', sublabel: 'Postgres · Auth · RLS', kind: 'data', x: 360, y: 40  },
        { id: 'edge',     label: 'Edge Function', sublabel: 'escrow logic', kind: 'server', x: 360, y: 280 },
        { id: 'stripe',   label: 'Stripe Connect', sublabel: 'Escrow + Payout', kind: 'service', x: 700, y: 150 },
      ],
      edges: [
        { from: 'app',    to: 'supabase', label: 'data · auth' },
        { from: 'app',    to: 'edge',     label: 'book · pay' },
        { from: 'edge',   to: 'supabase', label: 'update' },
        { from: 'edge',   to: 'stripe',   label: 'PaymentIntent' },
      ],
    },
    links: [
      { label: 'Website', url: 'https://www.beautify-app.de' },
    ],
    featured: true,
  },
  {
    id: 'cicd',
    category: 'web',
    tags: ['GitLab CI', 'Semgrep', 'Gitleaks', 'Dependency-Check', 'Trivy', 'OWASP ZAP', 'Angular', 'DevSecOps', 'Docker'],
    architecture: {
      nodes: [
        { id: 'juice',     label: 'OWASP Juice Shop', sublabel: 'Node.js target', kind: 'data',   x: 20,   y: 70  },
        { id: 'todo',      label: 'ToDoList', sublabel: 'Java · Maven', kind: 'data',              x: 20,   y: 200 },
        { id: 'scheduler', label: 'Scheduler', sublabel: 'cron · cache cleanup', kind: 'process', x: 20,   y: 340 },
        { id: 'gitlab',    label: 'GitLab CI', sublabel: 'multi-stage Pipeline', kind: 'server',   x: 300,  y: 195 },
        { id: 'semgrep',   label: 'Semgrep', sublabel: 'SAST', kind: 'service',                    x: 580,  y: 20  },
        { id: 'gitleaks',  label: 'Gitleaks', sublabel: 'secret scan', kind: 'service',            x: 580,  y: 120 },
        { id: 'depcheck',  label: 'Dependency-Check', sublabel: 'SCA · deps', kind: 'service',     x: 580,  y: 220 },
        { id: 'trivy',     label: 'Trivy', sublabel: 'SCA · container/fs', kind: 'service',        x: 580,  y: 320 },
        { id: 'zap',       label: 'OWASP ZAP', sublabel: 'DAST', kind: 'service',                  x: 580,  y: 420 },
        { id: 'reports',   label: 'Reports', sublabel: 'JSON / SARIF', kind: 'data',               x: 880,  y: 220 },
        { id: 'dashboard', label: 'Angular Dashboard', sublabel: 'Count · ID · Fix-Link', kind: 'client', x: 1130, y: 220 },
      ],
      edges: [
        { from: 'juice',     to: 'gitlab', label: 'push' },
        { from: 'todo',      to: 'gitlab', label: 'push' },
        { from: 'scheduler', to: 'gitlab', label: 'cron', dashed: true },
        { from: 'gitlab', to: 'semgrep',  label: 'SAST' },
        { from: 'gitlab', to: 'gitleaks', label: 'secrets' },
        { from: 'gitlab', to: 'depcheck', label: 'SCA' },
        { from: 'gitlab', to: 'trivy',    label: 'container' },
        { from: 'gitlab', to: 'zap',      label: 'DAST' },
        { from: 'semgrep',  to: 'reports' },
        { from: 'gitleaks', to: 'reports' },
        { from: 'depcheck', to: 'reports' },
        { from: 'trivy',    to: 'reports' },
        { from: 'zap',      to: 'reports' },
        { from: 'reports', to: 'dashboard', label: 'aggregate' },
      ],
    },
  },
  {
    id: 'rl-slotcar',
    category: 'ai-ml',
    tags: ['Reinforcement Learning', 'Deep Q-Learning', 'PPO', 'OpenCV', 'Python', 'Hardware'],
    architecture: {
      nodes: [
        { id: 'cam',   label: 'Webcam', sublabel: 'top-down feed', kind: 'client',  x: 40,  y: 60  },
        { id: 'cv',    label: 'OpenCV Filter', sublabel: 'B/W + green mask', kind: 'process', x: 320, y: 60  },
        { id: 'agent', label: 'RL Agent', sublabel: 'DQN → PPO', kind: 'server',     x: 640, y: 60  },
        { id: 'track', label: 'Track Mapping', sublabel: 'frame-by-frame', kind: 'process', x: 320, y: 220 },
        { id: 'poti',  label: 'Digital-Poti', sublabel: 'Speed 0–100', kind: 'client', x: 640, y: 240 },
        { id: 'car',   label: 'Slot-Car', sublabel: 'physical track', kind: 'sim',    x: 40,  y: 400 },
      ],
      edges: [
        { from: 'cam',   to: 'cv',    label: 'frames' },
        { from: 'cv',    to: 'agent', label: 'car position' },
        { from: 'cv',    to: 'track', label: 'map · step 1' },
        { from: 'track', to: 'agent', label: 'track model', dashed: true },
        { from: 'agent', to: 'poti',  label: 'speed 0–100' },
        { from: 'poti',  to: 'car',   label: 'drives motor' },
        { from: 'car',   to: 'cam',   label: 'top-down view', dashed: true },
      ],
    },
  },
  {
    id: 'idle-game',
    category: 'research',
    tags: ['C#', 'Unity', 'UI Toolkit', 'Tilemap', 'Idle Game', 'OOP'],
    architecture: {
      nodes: [
        { id: 'player',   label: 'Player', sublabel: 'mouse input', kind: 'client',           x: 40,  y: 60  },
        { id: 'gui',      label: 'UI Toolkit', sublabel: 'UIInteraction', kind: 'process',     x: 320, y: 60  },
        { id: 'eco',      label: 'EcoPoints', sublabel: 'currency · +/s', kind: 'server',      x: 620, y: 60  },
        { id: 'gamemgr',  label: 'GameManager', sublabel: 'Save/Load · Offline', kind: 'process', x: 900, y: 60 },
        { id: 'upgrade',  label: 'UpgradeObject', sublabel: 'cost · eco/s · level', kind: 'data', x: 320, y: 240 },
        { id: 'main',     label: 'Main', sublabel: 'places upgrades', kind: 'server',           x: 620, y: 240 },
        { id: 'tilemap',  label: 'Tilemap', sublabel: 'city (Aschaffenburg)', kind: 'sim',      x: 900, y: 240 },
        { id: 'prestige', label: 'PrestigeSystem', sublabel: 'Multiplier + Bar', kind: 'process', x: 620, y: 440 },
      ],
      edges: [
        { from: 'player',  to: 'gui',     label: 'mouse input' },
        { from: 'gui',     to: 'eco',     label: 'buys upgrade' },
        { from: 'eco',     to: 'gui',     label: 'eco/s · UI', dashed: true },
        { from: 'gamemgr', to: 'eco',     label: 'Save/Load · Offline' },
        { from: 'eco',     to: 'main',    label: 'trigger upgrade' },
        { from: 'upgrade', to: 'main',    label: 'Definition' },
        { from: 'main',    to: 'tilemap', label: 'places tiles' },
        { from: 'main',    to: 'prestige', label: 'hands upgrades' },
      ],
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/mustafatur46/IdleGame' },
    ],
  },
];
