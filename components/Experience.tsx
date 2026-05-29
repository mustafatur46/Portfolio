const ITEMS = [
  {
    type: 'work' as const,
    date: 'Mai 2026 – heute',
    title: 'Praktikant Prozessoptimierung',
    company: 'Deutsches Institut für Interne Revision e.V.',
    description: 'Prozessoptimierung mit IT-Mitteln: interne Abläufe analysieren, strukturieren und effizienter gestalten — Business-Analyse trifft Software-Hintergrund.',
    tags: [],
  },
  {
    type: 'work' as const,
    date: 'Sep 2025 – heute',
    title: 'Gründer — Beautify',
    company: 'beautify-app.de',
    companyUrl: 'https://www.beautify-app.de',
    description: 'Mobile Marketplace für Beauty-Buchungen — von 0 aufgebaut. Echtzeit-Booking, integriertes Payment, lokale Anbieter-Akquise. Vom MVP bis zum Launch alleine gesteuert.',
    tags: ['React Native', 'Echtzeit-Booking', 'Payment'],
  },
  {
    type: 'edu' as const,
    date: 'SS 2026 – laufend',
    title: 'Master of Science — Informatik',
    company: 'Goethe-Universität Frankfurt am Main',
    description: 'Spezialisierung: Künstliche Intelligenz.',
    tags: [],
  },
  {
    type: 'work' as const,
    date: 'Apr 2022 – Aug 2025',
    title: 'Werkstudent Softwareentwicklung',
    company: 'Bühler Group — Alzenau',
    description: '3+ Jahre im Center of Process Applications: Web-Apps mit Django/SQL, KPI-Dashboards mit Power BI, automatisierte Prozesse mit Power Automate.',
    tags: ['Django', 'Power BI', 'Power Automate', 'SQL'],
  },
  {
    type: 'edu' as const,
    date: 'Sep 2021 – Sep 2025',
    title: 'Bachelor of Science — Software Design',
    company: 'Technische Hochschule Aschaffenburg',
    description: 'Schwerpunkt Data Science. Bachelorarbeit: Reinforcement Learning für adaptive Verkehrssteuerung (Python, SUMO, PPO).',
    tags: [],
  },
  {
    type: 'edu' as const,
    date: 'Sep 2018 – Jul 2021',
    title: 'Abitur',
    company: 'Hanns-Seidel-Gymnasium — Hösbach',
    description: '',
    tags: [],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-bold mb-10 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Experience &amp; Education
        </h2>

        <div className="relative flex flex-col gap-5">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-1.5 bottom-1.5 w-[2px] bg-gradient-to-b from-[#a855f7] to-transparent hidden md:block" />

          {ITEMS.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[24px_1fr] gap-5 items-start">
              {/* Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-[#a855f7] mt-6 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />

              {/* Card */}
              <div className="bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[0.7rem] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-[5px] ${
                      item.type === 'work'
                        ? 'bg-[#a855f7]/15 text-[#c084fc]'
                        : 'bg-[#2563eb]/15 text-[#60a5fa]'
                    }`}
                  >
                    {item.type === 'work' ? 'Work' : 'Education'}
                  </span>
                  <span className="text-[0.78rem] text-[#555]">{item.date}</span>
                </div>

                <h3 className="text-[1.05rem] font-semibold text-white mb-0.5">{item.title}</h3>

                {item.companyUrl ? (
                  <a href={item.companyUrl} target="_blank" rel="noopener noreferrer"
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
                    {item.tags.map(t => (
                      <span key={t} className="text-[0.75rem] px-2 py-0.5 rounded-[5px] bg-white/[0.06] border border-white/[0.09] text-[#888]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
