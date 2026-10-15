"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Renders the current year on the client (keeps the page statically prerenderable). */
export default function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => ""
  );
  return <span suppressHydrationWarning>{year}</span>;
}
