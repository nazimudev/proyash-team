/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useCallback, useEffect, useState } from "react";

// Runs an async service call whenever `deps` change. Keeps the previous data while refetching
// (so filters don't flash a skeleton) and exposes reload() for retry buttons.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then(
        (data) => !cancelled && setState({ data, error: null, loading: false }),
      )
      .catch(
        (error) =>
          !cancelled && setState({ data: null, error, loading: false }),
      );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
