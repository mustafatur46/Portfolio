import { NextResponse } from 'next/server';

export async function GET() {
  const headers: HeadersInit = {
    Accept:               'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      'https://api.github.com/users/mustafatur46/repos?sort=updated&per_page=30&type=owner',
      {
        headers,
        // Next.js Route Handler cache: revalidate every hour
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `GitHub API ${res.status}: ${text}` },
        { status: res.status },
      );
    }

    const repos = await res.json();
    // Strip noise — only return fields we actually display
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clean = repos.map((r: any) => ({
      id:          r.id,
      name:        r.name,
      full_name:   r.full_name,
      description: r.description,
      html_url:    r.html_url,
      language:    r.language,
      stargazers_count: r.stargazers_count,
      forks_count:      r.forks_count,
      updated_at:       r.updated_at,
      topics:           r.topics ?? [],
      fork:             r.fork,
      archived:         r.archived,
    }));

    return NextResponse.json(clean);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
