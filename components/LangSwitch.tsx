'use client';

import { useI18n, type Lang } from './i18n';

const OPTS: Lang[] = ['de', 'en'];

export default function LangSwitch() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center rounded-full border border-white/[0.12] bg-white/[0.04] p-0.5">
      {OPTS.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className="px-2.5 py-1 rounded-full text-[0.72rem] font-bold uppercase tracking-wide transition-all"
          style={
            lang === l
              ? { background: '#a855f7', color: '#fff' }
              : { background: 'transparent', color: '#888' }
          }
        >
          {l}
        </button>
      ))}
    </div>
  );
}
