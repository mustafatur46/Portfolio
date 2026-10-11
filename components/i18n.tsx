'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
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

// The chosen language lives in localStorage; React reads it as an external
// store. The server snapshot is 'de', so hydration matches and the saved
// choice is applied right after.
const LANG_EVENT = 'lang-change';
let memLang: Lang = 'de'; // fallback when storage is blocked, so switching still works
const readLang = (): Lang => {
  try {
    const v = localStorage.getItem('lang');
    return v === 'en' || v === 'de' ? v : memLang;
  } catch { return memLang; }
};
const subscribeLang = (cb: () => void) => {
  window.addEventListener(LANG_EVENT, cb);
  window.addEventListener('storage', cb); // other tabs
  return () => {
    window.removeEventListener(LANG_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribeLang, readLang, () => 'de' as Lang);

  const setLang = (l: Lang) => {
    memLang = l;
    try { localStorage.setItem('lang', l); } catch {}
    document.documentElement.lang = l;
    window.dispatchEvent(new Event(LANG_EVENT));
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
