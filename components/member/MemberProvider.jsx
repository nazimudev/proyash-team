"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getMemberAccount } from "@/services/memberProfileService";

const MemberContext = createContext({
  member: null,
  loading: true,
  error: null,
  refresh: async () => {},
});



export function MemberProvider({ children }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const memberRef = useRef(null);
  const requestRef = useRef(null);
  const mountedRef = useRef(false);

  const loadAccount = useCallback(async (force = false) => {
    // Use cached data if available.
    if (!force && memberRef.current) {
      return memberRef.current;
    }

    // Reuse an ongoing request.
    if (requestRef.current) {
      return requestRef.current;
    }

    setLoading(true);
    setError(null);

    const request = getMemberAccount();

    requestRef.current = request;

    try {
      const result = await request;

      memberRef.current = result;

      if (mountedRef.current) {
        setMember(result);
      }

      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }

      throw err;
    } finally {
      if (requestRef.current === request) {
        requestRef.current = null;
      }

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    loadAccount().catch(() => {});

    return () => {
      mountedRef.current = false;
    };
  }, [loadAccount]);

  const refresh = useCallback(() => {
    return loadAccount(true);
  }, [loadAccount]);

  const value = useMemo(
    () => ({
      member,
      loading,
      error,
      refresh,
    }),
    [member, loading, error, refresh],
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export const useMember = () => useContext(MemberContext);
