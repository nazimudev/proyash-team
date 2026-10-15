"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Copies a public payment detail. Reports honestly if the browser blocks clipboard access. */
export default function CopyButton({ value, label }) {
  const [state, setState] = useState("idle"); // idle | copied | failed

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-forest/25 px-3 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
      >
        {state === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? `${label} copied` : state === "failed" ? `Could not copy ${label}` : ""}
      </span>
    </>
  );
}
