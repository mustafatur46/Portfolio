import { Project, CategoryDef } from '@/types/project';

// ─── Kategorie-Definitionen ──────────────────────────────────────────────────
// Jede Kategorie wird ein Hub-Node im React Flow Graph.
export const CATEGORIES: CategoryDef[] = [
  { id: 'ai-ml',    label: 'AI / ML',   icon: '🤖', color: '#a855f7' },
  { id: 'web',      label: 'Web Dev',   icon: '🌐', color: '#3b82f6' },
  { id: 'mobile',   label: 'Mobile',    icon: '📱', color: '#10b981' },
  { id: 'research', label: 'Research',  icon: '🔬', color: '#f59e0b' },
];

// ─── Projekte ────────────────────────────────────────────────────────────────
// Neues Projekt hinzufügen = neuen Eintrag hier reinschreiben.
// Der Graph baut sich automatisch auf.
export const PROJECTS: Project[] = [
  {
    id: 'chatbot',
    title: "Portfolio Chatbot",
    shortDescription: 'RAG-Pipeline: Gemini-Embeddings, NumPy-Vektorsuche, Flask Serverless',
    fullDescription:
      'Vollständige RAG-Pipeline: User-Query → Gemini Embedding 001 (RETRIEVAL_QUERY) → Cosine Similarity via NumPy → Top-3 Chunks → Gemini 2.5 Flash mit Guardrail-System-Prompt. ' +
      'Bewusste Entscheidung gegen externe Vektordatenbank: der Index wird offline aus profile.md gebaut und als JSON ins Repo committed — beim Cold Start in eine normalisierte NumPy-Matrix geladen und module-level gecacht. ' +
      'Deployed als Flask-WSGI Serverless Function auf Vercel — kein persistenter Server, keine laufenden Kosten.',
    category: 'ai-ml',
    tags: ['RAG', 'Gemini API', 'Python', 'Flask', 'NumPy', 'Vercel'],
    architecture: {
      nodes: [
        { id: 'browser', label: 'Browser', sublabel: 'Vanilla JS + Showdown', kind: 'client',  x: 320, y: 0   },
        { id: 'flask',   label: 'Flask /api/chat', sublabel: 'Vercel Serverless', kind: 'server', x: 320, y: 180 },
        { id: 'embed',   label: 'Gemini Embedding 001', sublabel: 'RETRIEVAL_QUERY', kind: 'service', x: 640, y: 70  },
        { id: 'numpy',   label: 'NumPy cosine', sublabel: 'matmul vs. Matrix', kind: 'process', x: 640, y: 180 },
        { id: 'flash',   label: 'Gemini 2.5 Flash', sublabel: 'generate + guardrail', kind: 'service', x: 640, y: 290 },
        { id: 'json',    label: 'embeddings.json', sublabel: 'normalisierte Matrix', kind: 'data', x: 320, y: 380 },
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
      notes: [
        'Kein Vektor-DB-Server: vorberechnetes JSON, beim Cold Start als normalisierte NumPy-Matrix geladen & module-level gecacht (Warm Invocations)',
        'Cosine Similarity = Dot-Product normalisierter Vektoren — ein einziges NumPy-matmul',
        'task_type RETRIEVAL_DOCUMENT (Index) vs. RETRIEVAL_QUERY (Frage) für bessere Retrieval-Qualität',
        'Guardrail im System-Prompt: lehnt Off-Topic-Fragen spielerisch ab, antwortet in der Sprache der Frage',
      ],
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/mustafatur46/ChatBot' },
    ],
    featured: true,
    period: '2025',
  },
  {
    id: 'rl-traffic',
    title: 'RL Verkehrssteuerung',
    shortDescription: 'Wetter-bewusster MaskablePPO-Agent für adaptive Ampelsteuerung in SUMO',
    fullDescription:
      'Bachelorarbeit: Reinforcement-Learning-Agent steuert eine 4-Phasen-Ampel (Kreuzung J13) im SUMO-Simulator über die TraCI-API. ' +
      'Trainiert mit MaskablePPO (sb3-contrib): ein ActionMasker blendet ungültige Phasenwechsel aus, ein TrafficLightManager erzwingt Min-Grün, Gelb- und Rot-Gelb-Phasen. ' +
      'Curriculum Learning über 4 Level (HDF5-gestützt, automatischer Level-Up) und ein wetter-bewusstes Modell: echte Open-Meteo-Daten (Regen/Schnee/Nebel) werden über ein empirisches Reibungs- und Sichtmodell in SUMO-Fahrzeugparameter übersetzt. ' +
      'Hyperparameter-Suche via Optuna, vektorisierte parallele Simulation (SubprocVecEnv), TensorBoard-Logging und Checkpoint-Resume.',
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
        { id: 'sumo',     label: 'SUMO', sublabel: 'Kreuzung J13', kind: 'sim', x: 820, y: 320 },
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
      notes: [
        'MaskablePPO statt Vanilla-PPO: ActionMasker maskiert ungültige Aktionen (z.B. Phasen-Hold während Gelb-Übergang)',
        'Wetter-bewusst: echte Open-Meteo-JSONs → empirisches Reibungs-/Sichtmodell → setMaxSpeed/Accel/Tau/MinGap pro Fahrzeug',
        'Curriculum über 4 Level mit HDF5-Performance-Tracking; Level-Up an Reward, Wait, Slope, Violation- & Teleport-Rate gekoppelt',
        'Reward kombiniert Wartezeit, Δ-Wartezeit, Queue, Fairness (std über Gruppen), Teleport- und Violation-Penalty — Gewichte skalieren pro Level',
        'SubprocVecEnv für parallele SUMO-Instanzen, Optuna-HPO, automatischer Checkpoint-Resume',
      ],
    },
    period: '2025',
  },
  {
    id: 'beautify',
    title: 'Beautify',
    shortDescription: 'Escrow-Marketplace für Beauty-Buchungen — Expo, Supabase, Stripe Connect',
    fullDescription:
      'Eigene Gründung: Mobile Marketplace für Beauty-Dienstleistungen mit Escrow-Payment. ' +
      'Ein React-Native-Codebase auf Expo läuft auf iOS und Android. Backend ist Supabase (Postgres, Auth, Row Level Security); ' +
      'Zahlungen laufen über Stripe Connect als Escrow: der Betrag wird bei Buchung gehalten und erst nach erbrachter Dienstleistung an den Anbieter ausgezahlt. ' +
      'Vom MVP bis zum Launch alleine gesteuert — Product, Tech und Business in einer Person.',
    category: 'mobile',
    tags: ['Expo', 'React Native', 'Supabase', 'Stripe Connect', 'Escrow', 'TypeScript'],
    architecture: {
      nodes: [
        { id: 'app',      label: 'Expo App', sublabel: 'iOS · Android (RN)', kind: 'client', x: 40,  y: 150 },
        { id: 'supabase', label: 'Supabase', sublabel: 'Postgres · Auth · RLS', kind: 'data', x: 360, y: 40  },
        { id: 'edge',     label: 'Edge Function', sublabel: 'Escrow-Logik', kind: 'server', x: 360, y: 280 },
        { id: 'stripe',   label: 'Stripe Connect', sublabel: 'Escrow + Payout', kind: 'service', x: 700, y: 150 },
      ],
      edges: [
        { from: 'app',    to: 'supabase', label: 'data · auth' },
        { from: 'app',    to: 'edge',     label: 'book · pay' },
        { from: 'edge',   to: 'supabase', label: 'update' },
        { from: 'edge',   to: 'stripe',   label: 'PaymentIntent' },
      ],
      notes: [
        'Escrow: Betrag wird bei Buchung autorisiert/gehalten und erst nach bestätigter Dienstleistung an den Anbieter ausgezahlt (Stripe Connect)',
        'Ein Expo/React-Native-Codebase → iOS + Android aus einer Quelle',
        'Supabase als Backend: Postgres + Auth + Row Level Security; Stripe-Calls laufen serverseitig über Edge Functions (Secrets bleiben sicher)',
        'Stripe Connect verwaltet Anbieter-Konten & Marketplace-Auszahlungen',
      ],
    },
    links: [
      { label: 'Website', url: 'https://www.beautify-app.de' },
    ],
    featured: true,
    period: '2025 – heute',
  },
  {
    id: 'cicd',
    title: 'CI/CD Vulnerability Detection',
    shortDescription: 'GitLab-CI DevSecOps: SAST/SCA/DAST gegen 2 Apps → Angular-Vuln-Dashboard',
    fullDescription:
      'DevSecOps-Pipelines (GitLab CI) für zwei Anwendungen: die bewusst verwundbare OWASP Juice Shop (Node.js) und eine ToDo-List-App der Profs (Java/Maven). ' +
      'Bei jedem Push durchläuft der Code dieselben Security-Gates: Semgrep (SAST), Gitleaks (Secret-Scan), OWASP Dependency-Check (SCA der Dependencies), Trivy (Container-/Filesystem-Scan) und OWASP ZAP (DAST gegen den deployten Container). ' +
      'Jede Stage exportiert JSON/SARIF-Reports, die ein selbst gebautes Angular-Dashboard aggregiert: Anzahl der Schwachstellen, Art und Name (inkl. ID) sowie — falls vorhanden — die Verlinkung zur Lösung. ' +
      'Geplante Pipelines (cron) leeren zusätzlich die Caches (global + Dependency-Check).',
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
      notes: [
        'Zwei Targets, gleiche Pipeline: OWASP Juice Shop (Node.js) + ToDo-List der Profs (Java/Maven)',
        'Security-Gates: Semgrep (SAST) · Gitleaks (Secrets) · OWASP Dependency-Check (SCA) · Trivy (Container/FS) · OWASP ZAP (DAST)',
        'Stages: build → test → SAST → SCA → publish (Docker) → container-scan → DAST → deploy',
        'Scheduled Pipeline (cron, rules: schedule) leert global- & Dependency-Check-Caches; bei der ToDo-App lief der DAST-Scan ebenfalls per Schedule',
        'Alle Reports (JSON/SARIF) → Angular-Dashboard: Anzahl, Vulnerability-Name + ID, Verlinkung zur Lösung',
      ],
    },
    period: '2024',
  },
  {
    id: 'rl-slotcar',
    title: 'RL Slot-Car',
    shortDescription: 'Autonomes Slot-Car: Top-down-Webcam + OpenCV-Tracking → DQN/PPO → digitales Poti',
    fullDescription:
      'RL-Agent fährt ein echtes Slot-Car autonom. Eine Top-down-Webcam filmt die Bahn; per Bildverarbeitung (OpenCV) wird jeder Frame in Schwarz-Weiß gewandelt und nur Grün behalten — das grün lackierte Auto wird so zuverlässig erkannt. ' +
      'Im ersten Schritt fährt das Auto Frame für Frame ab, um die Strecke abzubilden. ' +
      'Der Agent gibt dann einen kontinuierlichen Speed-Wert zwischen 0 und 100 aus, der über ein digitales Potentiometer die Motorgeschwindigkeit regelt. ' +
      'Autonomes Fahren erst mit Deep Q-Learning, dann mit einem PPO-Ansatz trainiert.',
    category: 'ai-ml',
    tags: ['Reinforcement Learning', 'Deep Q-Learning', 'PPO', 'OpenCV', 'Python', 'Hardware'],
    architecture: {
      nodes: [
        { id: 'cam',   label: 'Webcam', sublabel: 'top-down feed', kind: 'client',  x: 40,  y: 60  },
        { id: 'cv',    label: 'OpenCV Filter', sublabel: 'S/W + Grün-Maske', kind: 'process', x: 320, y: 60  },
        { id: 'agent', label: 'RL Agent', sublabel: 'DQN → PPO', kind: 'server',     x: 640, y: 60  },
        { id: 'track', label: 'Track Mapping', sublabel: 'frame-by-frame', kind: 'process', x: 320, y: 220 },
        { id: 'poti',  label: 'Digital-Poti', sublabel: 'Speed 0–100', kind: 'client', x: 640, y: 240 },
        { id: 'car',   label: 'Slot-Car', sublabel: 'physische Bahn', kind: 'sim',    x: 40,  y: 400 },
      ],
      edges: [
        { from: 'cam',   to: 'cv',    label: 'frames' },
        { from: 'cv',    to: 'agent', label: 'car position' },
        { from: 'cv',    to: 'track', label: 'map · step 1' },
        { from: 'track', to: 'agent', label: 'track model', dashed: true },
        { from: 'agent', to: 'poti',  label: 'speed 0–100' },
        { from: 'poti',  to: 'car',   label: 'regelt Motor' },
        { from: 'car',   to: 'cam',   label: 'top-down gesehen', dashed: true },
      ],
      notes: [
        'Top-down-Webcam + OpenCV: jeder Frame wird S/W gewandelt und nur Grün behalten → das grün lackierte Auto ist eindeutig trackbar',
        'Schritt 1: Auto fährt Frame für Frame ab → die Strecke wird abgebildet (Environment-Aufbau)',
        'Agent-Output = kontinuierlicher Speed-Wert 0–100, geregelt über ein digitales Potentiometer (Hardware-in-the-loop)',
        'Autonomes Fahren erst mit Deep Q-Learning, danach mit PPO-Ansatz trainiert',
      ],
    },
    period: '2023 – 2024',
  },
  {
    id: 'idle-game',
    title: 'Idle City Game',
    shortDescription: 'Cookie-Clicker-artiges Idle Game in Unity/C#: Eco-Punkte → Stadt-Upgrades auf Tilemap',
    fullDescription:
      'Idle Game (Cookie-Clicker-Genre) in Unity/C#: mit der digitalen Währung „Eco-Punkte" kauft man Upgrades, die eine als Tilemap nachgebaute Stadt (Aschaffenburg) wachsen lassen — Bäume, Blumen, Ladestationen, Fahrradwege. ' +
      'Bewusst objektorientiert & dynamisch: jedes Upgrade ist eine UpgradeObject-Instanz (Kosten, Eco/s, Level, erlaubte Tilemap-Bereiche), neue Upgrades brauchen keinen Code-Change. ' +
      'EcoPoints generiert die Währung pro Sekunde (Idle-Mechanik), PrestigeSystem gibt einen Reset-Multiplier, GameManager speichert/lädt und berechnet Offline-Earnings. UI mit Unity UI Toolkit, Assets selbst gezeichnet. ' +
      'Entstanden im Software-Engineering-Projekt mit vollständigem Requirements Engineering & User Testing.',
    category: 'research',
    tags: ['C#', 'Unity', 'UI Toolkit', 'Tilemap', 'Idle Game', 'OOP'],
    architecture: {
      nodes: [
        { id: 'player',   label: 'Spieler', sublabel: 'Maus-Input', kind: 'client',           x: 40,  y: 60  },
        { id: 'gui',      label: 'UI Toolkit', sublabel: 'UIInteraction', kind: 'process',     x: 320, y: 60  },
        { id: 'eco',      label: 'EcoPoints', sublabel: 'Währung · +/s', kind: 'server',       x: 620, y: 60  },
        { id: 'gamemgr',  label: 'GameManager', sublabel: 'Save/Load · Offline', kind: 'process', x: 900, y: 60 },
        { id: 'upgrade',  label: 'UpgradeObject', sublabel: 'cost · eco/s · level', kind: 'data', x: 320, y: 240 },
        { id: 'main',     label: 'Main', sublabel: 'platziert Upgrades', kind: 'server',        x: 620, y: 240 },
        { id: 'tilemap',  label: 'Tilemap', sublabel: 'Stadt (Aschaffenburg)', kind: 'sim',     x: 900, y: 240 },
        { id: 'prestige', label: 'PrestigeSystem', sublabel: 'Multiplier + Bar', kind: 'process', x: 620, y: 440 },
      ],
      edges: [
        { from: 'player',  to: 'gui',     label: 'Maus-Input' },
        { from: 'gui',     to: 'eco',     label: 'kauft Upgrade' },
        { from: 'eco',     to: 'gui',     label: 'eco/s · UI', dashed: true },
        { from: 'gamemgr', to: 'eco',     label: 'Save/Load · Offline' },
        { from: 'eco',     to: 'main',    label: 'trigger Upgrade' },
        { from: 'upgrade', to: 'main',    label: 'Definition' },
        { from: 'main',    to: 'tilemap', label: 'platziert Tiles' },
        { from: 'main',    to: 'prestige', label: 'reicht Upgrades' },
      ],
      notes: [
        'Eco-Punkte = digitale Währung: EcoPoints generiert sie pro Sekunde (Idle-Mechanik) und verrechnet Käufe (ApplyUpgrade/SpendEcoPoints)',
        'Objektorientiert & dynamisch: jedes Upgrade ist eine UpgradeObject-Instanz (cost, eco/s, level, erlaubte Tilemap-Bounds) — neue Upgrades ohne Code-Änderung',
        'Main platziert die Upgrade-Tiles per Vektor-Bounds (zufällig in erlaubten Bereichen) auf der Tilemap — die Stadt wächst sichtbar',
        'PrestigeSystem: Reset für dauerhaften Multiplier; GameManager speichert/lädt und berechnet Offline-Earnings',
        'UI mit Unity UI Toolkit (UIDocument); Buttons grau = nicht leistbar, blau = kaufbar; selbst gezeichnete Cartoon-Assets',
      ],
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/mustafatur46/IdleGame' },
    ],
    period: '2023 – 2024',
  },
];
