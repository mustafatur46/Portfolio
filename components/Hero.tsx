'use client';

import { useI18n } from './i18n';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-6 w-full">
        <p className="text-[#e3a857] text-[0.72rem] sm:text-[0.8rem] font-medium uppercase tracking-[0.3em] sm:tracking-[0.35em] mb-3 sm:mb-6">
          Mustafa Turhal
        </p>

        <h1
          data-sky-avoid
          className="section-title leading-[1.08] sm:leading-[1.04] mb-4 sm:mb-6 text-[2.05rem] sm:text-[2.7rem] md:text-[clamp(2.6rem,7vw,5rem)] w-fit -mx-3 px-3 sm:-mx-5 sm:px-5 py-1.5 sm:py-2 rounded-2xl bg-black/40 backdrop-blur-[3px] border border-white/[0.05]"
        >
          {t.hero.headline}{' '}
          <span className="accent-italic">{t.hero.headlineAccent}</span>
        </h1>

        <p className="text-[#7a7a82] text-[0.92rem] sm:text-[1.02rem] max-w-[620px] mb-6 sm:mb-8 leading-[1.7]">
          {t.hero.intro}
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8">
          {t.hero.badges.map(b => (
            <span
              key={b}
              className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1 text-[0.8rem] text-[#888]"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:mustafa.turhal08@gmail.com"
            className="group/cta inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.05] px-5 py-2.5 text-[0.9rem] font-medium text-white no-underline transition-all glow-hover"
          >
            {t.hero.contact}
            <span className="transition-transform group-hover/cta:translate-x-0.5">→</span>
          </a>
          <a
            href="#chatbot"
            className="group/chat inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.9rem] text-[#e3a857] hover:text-[#efc78a] transition-colors no-underline"
          >
            💬 {t.hero.chat}
            <span className="transition-transform group-hover/chat:translate-y-0.5">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
