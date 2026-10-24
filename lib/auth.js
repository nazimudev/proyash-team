"use client";

import { useSyncExternalStore } from "react";

const TOKEN = "auth_token";
const ROLE = "auth_role"; // shudhu menu dekhanor jonno, security na

const subscribe = (cb) => {
  window.addEventListener("storage", cb);
  window.addEventListener("auth-changed", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("auth-changed", cb);
  };
};
const read = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const notify = () => window.dispatchEvent(new Event("auth-changed"));

export const getToken = () => read(TOKEN);

export function saveAuth(token, role) {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(ROLE, role ?? "member");
  notify();
}
export function clearAuth() {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(ROLE);
  notify();
}

export function useAuth() {
  const loggedIn = useSyncExternalStore(
    subscribe,
    () => Boolean(read(TOKEN)),
    () => false,
  );
  const role = useSyncExternalStore(
    subscribe,
    () => read(ROLE),
    () => null,
  );
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return { loggedIn, role, ready, logout: clearAuth };
}
