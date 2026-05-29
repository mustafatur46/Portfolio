'use client';

import { useI18n } from './i18n';

// Structural data (language-neutral); text comes from i18n by index.
const META = [
  { type: 'work' as const, tags: [] as string[] },
  { type: 'work' as const, companyUrl: 'https://www.beautify-app.de', tags: ['React Native', 'Echtzeit-Booking', 'Payment'] },
  { type: 'edu'  as const, tags: [] as string[] },
  { type: 'work' as const, tags: ['Django', 'Power BI', 'Power Automate', 'SQL'] },
  { type: 'edu'  as const, tags: [] as string[] },
  { type: 'edu'  as const, tags: [] as string[] },
] as const;

export default function Experience() {
  const { t } = useI18n();
  const items = t.experience.items.map((txt, i) => ({ ...META[i], ...txt }));

  return (
    <section id="experience" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-bold mb-10 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          {t.experience.heading}
        </h2>

        <div className="relative flex flex-col gap-5">
          <div className="absolute left-[11px] top-1.5 bottom-1.5 w-[2px] bg-gradient-to-b from-[#a855f7] to-transparent hidden md:block" />

          {items.map((item, i) => {
            const companyUrl = 'companyUrl' in item ? item.companyUrl : undefined;
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[24px_1fr] gap-5 items-start">
                <div className="hidden md:block w-3 h-3 rounded-full bg-[#a855f7] mt-6 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />

                <div className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[0.7rem] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-[5px] ${
                        item.type === 'work'
                          ? 'bg-[#a855f7]/15 text-[#c084fc]'
                          : 'bg-[#2563eb]/15 text-[#60a5fa]'
                      }`}
                    >
                      {item.type === 'work' ? t.experience.work : t.experience.education}
                    </span>
                    <span className="text-[0.78rem] text-[#555]">{item.date}</span>
                  </div>

                  <h3 className="text-[1.05rem] font-semibold text-white mb-0.5">{item.title}</h3>

                  {companyUrl ? (
                    <a href={companyUrl} target="_blank" rel="noopener noreferrer"
                       className="text-[0.85rem] text-[#a855f7] mb-2 block hover:underline">
                      {item.company} ↗
                    </a>
                  ) : (
                    <p className="text-[0.85rem] text-[#a855f7] mb-2">{item.company}</p>
                  )}

                  {item.description && (
                    <p className="text-[0.88rem] text-[#888] leading-relaxed">{item.description}</p>
                  )}

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[0.75rem] px-2 py-0.5 rounded-[5px] bg-white/[0.06] border border-white/[0.09] text-[#888]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
