'use client';

import { useI18n } from './i18n';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#7c3aed] opacity-35 blur-[80px] -top-24 -left-36" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#2563eb] opacity-35 blur-[80px] -bottom-12 -right-24" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 w-full">
        <p className="text-[#a855f7] text-lg font-medium mb-3">{t.hero.greeting}</p>

        <h1 className="font-extrabold leading-[1.05] tracking-[-1px] mb-3 bg-gradient-to-br from-white via-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
          Mustafa Turhal
        </h1>

        <p className="text-[#888] mb-5 font-light" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
          {t.hero.role}
        </p>

        <p className="text-[#888] text-[1.05rem] max-w-[620px] mb-7 leading-[1.8]">
          {t.hero.intro}
        </p>
        {t.hero.intro2 && (
          <p className="text-[#888] text-[1.05rem] max-w-[620px] mb-7 leading-[1.8] -mt-3">
            {t.hero.intro2}
          </p>
        )}

        <div className="flex flex-wrap gap-2.5 mb-8">
          {t.hero.badges.map(b => (
            <span
              key={b}
              className="bg-white/5 border border-white/[0.09] rounded-full px-3.5 py-1 text-[0.82rem] text-[#888] backdrop-blur-md"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:mustafa.turhal08@gmail.com"
            className="bg-[#a855f7] text-white px-6 py-2.5 rounded-[10px] font-semibold text-[0.95rem] hover:opacity-85 transition-opacity no-underline shadow-[0_0_24px_rgba(168,85,247,0.25)]"
          >
            {t.hero.contact}
          </a>
          <a
            href="https://github.com/mustafatur46"
            target="_blank" rel="noopener noreferrer"
            className="bg-white/5 border border-white/[0.09] text-white px-6 py-2.5 rounded-[10px] font-semibold text-[0.95rem] hover:border-[#a855f7] hover:text-[#a855f7] transition-colors no-underline"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/mustafa-turhal-9963ba26a"
            target="_blank" rel="noopener noreferrer"
            className="bg-white/5 border border-white/[0.09] text-white px-6 py-2.5 rounded-[10px] font-semibold text-[0.95rem] hover:border-[#a855f7] hover:text-[#a855f7] transition-colors no-underline"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
}
