"use client";

import { TriangleAlert } from "lucide-react";

/** Lists every current error as a link that moves focus to the offending field. Focus the container when it appears. */
export default function ErrorSummary({ errors, labels, innerRef }) {
  const entries = Object.entries(errors).filter(([, msg]) => msg);
  if (entries.length === 0) return null;

  function jump(e, name) {
    e.preventDefault();
    const el = document.getElementById(name);
    el?.scrollIntoView({ block: "center" });
    el?.focus();
  }

  return (
    <div ref={innerRef} tabIndex={-1} role="alert" className="rounded-xl border border-[#b42318]/40 bg-[#fef3f2] p-5 text-[#7a271a]">
      <p className="flex items-center gap-2 font-extrabold">
        <TriangleAlert size={18} aria-hidden="true" />
        Please fix the following {entries.length === 1 ? "problem" : "problems"}:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
        {entries.map(([name, msg]) => (
          <li key={name}>
            <a href={`#${name}`} onClick={(e) => jump(e, name)} className="font-semibold underline underline-offset-2">
              {labels[name] ?? name}
            </a>
            : {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
