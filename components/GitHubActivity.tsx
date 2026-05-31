'use client';

import { useEffect, useState } from 'react';
import { useI18n } from './i18n';
import { toneFor } from '@/data/palette';

interface Repo {
  id:               number;
  name:             string;
  full_name:        string;
  description:      string | null;
  html_url:         string;
  language:         string | null;
  stargazers_count: number;
  forks_count:      number;
  updated_at:       string;
  topics:           string[];
  fork:             boolean;
  archived:         boolean;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d    = Math.floor(diff / 86_400_000);
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30)  return `${d}d ago`;
  const m = Math.floor(d / 30);
  if (m < 12)  return `${m}mo ago`;
  return `${Math.floor(m / 12)}y ago`;
}

function RepoCard({ repo }: { repo: Repo }) {
  const { t } = useI18n();
  const lc = repo.language ? toneFor(repo.language) : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-4 no-underline transition-all duration-200 hover:bg-white/[0.055] hover:border-white/[0.14]"
    >
      {/* Name row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Repo icon */}
          <svg
            className="w-4 h-4 flex-shrink-0 text-[#555]"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
          </svg>
          <span className="text-[0.85rem] font-semibold text-white truncate group-hover:text-[#e3a857] transition-colors">
            {repo.name}
          </span>
        </div>
        {repo.archived && (
          <span className="flex-shrink-0 text-[0.62rem] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
            {t.github.archived}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[0.78rem] text-[#666] leading-relaxed line-clamp-2 flex-1">
        {repo.description ?? (
          <span className="italic text-[#3a3a3a]">{t.github.noDescription}</span>
        )}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map(t => (
            <span
              key={t}
              className="text-[0.63rem] px-1.5 py-[2px] rounded-full bg-[#e3a857]/10 border border-[#e3a857]/20 text-[#efc78a]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer: lang + stars + forks + updated */}
      <div className="flex items-center gap-3 mt-auto pt-1 flex-wrap">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: lc ?? '#888' }}
            />
            <span className="text-[0.72rem] text-[#666]">{repo.language}</span>
          </div>
        )}

        {repo.stargazers_count > 0 && (
          <div className="flex items-center gap-1 text-[#555]">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <span className="text-[0.72rem]">{repo.stargazers_count}</span>
          </div>
        )}

        {repo.forks_count > 0 && (
          <div className="flex items-center gap-1 text-[#555]">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
            <span className="text-[0.72rem]">{repo.forks_count}</span>
          </div>
        )}

        <span className="text-[0.7rem] text-[#3a3a3a] ml-auto">{timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  );
}

export default function GitHubActivity() {
  const { t } = useI18n();
  const [repos, setRepos]       = useState<Repo[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showAll, setShowAll]   = useState(false);

  useEffect(() => {
    fetch('/api/github')
      .then(r => r.json())
      .then((data: Repo[] | { error: string }) => {
        if ('error' in data) { setError(data.error); return; }
        // Filter out forks, show non-archived first
        const sorted = [...data].filter(r => !r.fork).sort((a, b) => {
          if (!a.archived && b.archived)  return -1;
          if (a.archived  && !b.archived) return 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        setRepos(sorted);
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const displayed = showAll ? repos : repos.slice(0, 6);

  return (
    <section id="github" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h2
              className="section-title mb-2"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
            >
              {t.github.heading}
            </h2>
            <p className="text-[#888] text-[1.05rem] max-w-[520px]">
              {t.github.intro}
            </p>
          </div>
          <a
            href="https://github.com/mustafatur46"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 border border-white/[0.09] text-[#888] text-[0.85rem] px-4 py-2 rounded-[10px] hover:border-white/20 hover:text-white transition-all no-underline"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {t.github.viewProfile}
          </a>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[160px] rounded-[14px] bg-white/[0.025] border border-white/[0.05] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-[#555] text-[0.9rem]">
              {t.github.error}
            </p>
            <a
              href="https://github.com/mustafatur46"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[#e3a857] text-[0.85rem] hover:underline"
            >
              {t.github.errorLink}
            </a>
          </div>
        )}

        {/* Repos grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>

            {repos.length > 6 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="bg-white/[0.04] border border-white/[0.09] text-[#888] text-[0.85rem] font-medium px-6 py-2.5 rounded-[10px] hover:border-white/20 hover:text-white transition-all"
                >
                  {showAll
                    ? t.github.showLess
                    : t.github.showAll.replace('{n}', String(repos.length))}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
