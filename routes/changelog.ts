export interface Heading { depth: number; slug: string; text: string; }
export interface Section { title: string; html: string; }
export interface Release {
  slug: string;
  version: string;
  date?: string;
  href?: string;
  yanked: boolean;
  intro: string;
  sections: Section[];
}

function safeHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  return /^(https?:\/\/|\/|#)/i.test(href) ? href : undefined;
}

function splitAt(html: string, tag: string, headings: Heading[]) {
  const starts: number[] = [];
  for (const h of headings) starts.push(html.indexOf(`<${tag} id="${h.slug}"`, starts.at(-1) ?? 0));
  return {
    before: html.slice(0, starts[0] ?? html.length),
    chunks: starts.map((start, i) => {
      const chunk = html.slice(start, starts[i + 1]);
      const close = chunk.indexOf(`</${tag}>`);
      return { inner: chunk.slice(chunk.indexOf(">") + 1, close), body: chunk.slice(close + tag.length + 3) };
    }),
  };
}

export function parseChangelog(html: string, headings: Heading[]) {
  const groups: { h2: Heading; h3s: Heading[] }[] = [];
  for (const h of headings) {
    if (h.depth === 2) groups.push({ h2: h, h3s: [] });
    else if (h.depth === 3) groups.at(-1)?.h3s.push(h);
  }

  const { before, chunks } = splitAt(html, "h2", groups.map((g) => g.h2));
  const releases: Release[] = chunks.map(({ inner, body }, i) => {
    const { h2, h3s } = groups[i];
    const notes = splitAt(body, "h3", h3s);
    const yanked = /\[?yanked\]?\s*$/i.test(h2.text);
    const [version, ...rest] = h2.text.replace(/\[?yanked\]?\s*$/i, "").trim().split(/\s+-\s+/);
    return {
      slug: h2.slug,
      version: version.replace(/^\[|\]$/g, ""),
      date: rest.join(" ").match(/\d{4}-\d{2}-\d{2}/)?.[0],
      href: safeHref(inner.match(/<a [^>]*href="([^"]*)"/)?.[1]),
      yanked,
      intro: notes.before.trim(),
      sections: notes.chunks.map((c, j) => ({ title: h3s[j].text, html: c.body.trim() })),
    };
  });

  return {
    title: headings.find((h) => h.depth === 1)?.text ?? "Changelog",
    intro: before.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/, "").trim(),
    releases,
  };
}
