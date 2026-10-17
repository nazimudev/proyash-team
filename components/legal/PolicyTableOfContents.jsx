const linkClass =
  "flex gap-2 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-mist hover:text-forest";

function List({ sections }) {
  return (
    <ol className="space-y-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className={linkClass}>
            <span aria-hidden="true" className="w-6 shrink-0 font-bold text-forest">{i + 1}.</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Collapsible list on mobile; sticky sidebar on large screens. Both use plain anchor links (no client JS). */
export default function PolicyTableOfContents({ sections }) {
  return (
    <>
      <details className="mb-10 rounded-xl border border-forest/15 bg-white lg:hidden">
        <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold text-ink">On this page</summary>
        <nav aria-label="On this page" className="border-t border-forest/10 p-2"><List sections={sections} /></nav>
      </details>
      <nav aria-label="Table of contents" className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
        <p className="mb-3 px-2 text-sm font-extrabold text-ink">Table of contents</p>
        <List sections={sections} />
      </nav>
    </>
  );
}
