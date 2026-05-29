'use client';

import { useI18n } from './i18n';

export default function About() {
  const { t } = useI18n();

  const SKILLS = [
    { title: t.about.skillsLanguages, tags: ['Python', 'JavaScript', 'Java', 'C#', 'SQL', 'HTML / CSS'], accent: false },
    { title: t.about.skillsAiMl, tags: ['RAG Pipelines', 'Reinforcement Learning', 'Embeddings', 'Prompt Engineering', 'Gemini API', 'NumPy · pandas · sklearn'], accent: true },
    { title: t.about.skillsTools, tags: ['Flask · Django · Angular', 'React Native', 'Git · Docker', 'Power BI · Power Automate', 'Vercel', 'Cursor · VS Code · Claude Code'], accent: false },
  ];

  return (
    <section id="about" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-bold mb-10 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          {t.about.heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Text */}
          <div className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-7 flex flex-col gap-4">
            <p className="text-[#888] leading-[1.8]">
              {t.about.p1Pre}
              <a href="https://www.beautify-app.de" target="_blank" rel="noopener noreferrer" className="text-[#a855f7] hover:underline">
                {t.about.p1Link}
              </a>
              {t.about.p1Post}
            </p>
            <p className="text-[#888] leading-[1.8]">{t.about.p2}</p>
            <p className="text-[#888] leading-[1.8]">{t.about.p3}</p>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-4">
            {SKILLS.map(s => (
              <div key={s.title} className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5">
                <h3 className="text-[0.8rem] font-bold uppercase tracking-[1.5px] text-[#a855f7] mb-3">
                  {s.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-[0.78rem] px-2.5 py-0.5 rounded-[6px] border ${
                        s.accent
                          ? 'bg-[#a855f7]/12 border-[#a855f7]/30 text-[#c084fc]'
                          : 'bg-white/[0.06] border-white/[0.09] text-[#888]'
                      }`}
                    >
                      {tag}
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
