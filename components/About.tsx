const SKILLS = [
  {
    title: 'Languages',
    tags: ['Python', 'JavaScript', 'Java', 'C#', 'SQL', 'HTML / CSS'],
    accent: false,
  },
  {
    title: 'AI / ML',
    tags: ['RAG Pipelines', 'Reinforcement Learning', 'Embeddings', 'Prompt Engineering', 'Gemini API', 'NumPy · pandas · sklearn'],
    accent: true,
  },
  {
    title: 'Tools & Stack',
    tags: ['Flask · Django · Angular', 'React Native', 'Git · Docker', 'Power BI · Power Automate', 'Vercel', 'Cursor · VS Code · Claude Code'],
    accent: false,
  },
];

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-bold mb-10 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          About
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Text */}
          <div className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-7 flex flex-col gap-4">
            <p className="text-[#888] leading-[1.8]">
              Ich bin Software-Entwickler aus Bayern mit Leidenschaft für KI — aktuell im Master
              Informatik mit KI-Spezialisierung an der Goethe-Uni Frankfurt. Neben dem Studium
              führe ich{' '}
              <a href="https://www.beautify-app.de" target="_blank" rel="noopener noreferrer" className="text-[#a855f7] hover:underline">
                Beautify
              </a>
              , eine Mobile-App für Beauty-Buchungen, die ich von Grund auf selbst aufgebaut habe.
            </p>
            <p className="text-[#888] leading-[1.8]">
              Mein Ding ist <strong className="text-white">AI Pair Programming</strong> — ich nutze
              Tools wie Claude, Cursor und Copilot täglich, aber nicht blind. Wer die Architektur
              nicht versteht, verliert sich im Prompt. Wer sie versteht, spielt in einer anderen Liga.
            </p>
            <p className="text-[#888] leading-[1.8]">
              Ich suche Umfelder, in denen KI kein Hype ist, sondern gelebte Praxis —
              und in denen man echte Systeme mit echten Anforderungen baut.
            </p>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-4">
            {SKILLS.map(s => (
              <div key={s.title} className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5">
                <h3 className="text-[0.8rem] font-bold uppercase tracking-[1.5px] text-[#a855f7] mb-3">
                  {s.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span
                      key={t}
                      className={`text-[0.78rem] px-2.5 py-0.5 rounded-[6px] border ${
                        s.accent
                          ? 'bg-[#a855f7]/12 border-[#a855f7]/30 text-[#c084fc]'
                          : 'bg-white/[0.06] border-white/[0.09] text-[#888]'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
