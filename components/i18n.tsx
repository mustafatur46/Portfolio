'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import de from '@/data/i18n/de.json';
import en from '@/data/i18n/en.json';

export type Lang = 'de' | 'en';

// de.json is the canonical shape; en.json mirrors it.
export type Messages = typeof de;
export interface ProjectText {
  title: string;
  period: string;
  short: string;
  full: string;
  notes: string[];
}

const DICT: Record<Lang, Messages> = { de, en: en as Messages };

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
}

const LanguageContext = createContext<Ctx>({ lang: 'de', setLang: () => {}, t: de });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('de');

  // Restore persisted choice after mount (server renders 'de' to avoid hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'de') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch {}
    document.documentElement.lang = l;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICT[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useI18n = () => useContext(LanguageContext);

/** Localized text for a project by id (title / short / full / notes). */
export function useProjectText(id: string): ProjectText {
  const { t } = useI18n();
  const map = t.projects as Record<string, ProjectText>;
  return map[id];
}
