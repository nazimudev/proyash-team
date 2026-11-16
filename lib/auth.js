"use client";

import { useSyncExternalStore } from "react";

const TOKEN = "auth_token";
const ROLE = "auth_role";
const USER = "auth_user";

const subscribe = (cb) => {
  window.addEventListener("storage", cb);
  window.addEventListener("auth-changed", cb);

  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("auth-changed", cb);
  };
};

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const notify = () => {
  window.dispatchEvent(new Event("auth-changed"));
};

// Get token
export const getToken = () => read(TOKEN);

// Save authentication
export function saveAuth(token, role, user = null) {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(ROLE, role ?? "member");

  if (user) {
    localStorage.setItem(USER, JSON.stringify(user));
  }

  notify();
}

// Clear authentication
export function clearAuth() {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(ROLE);
  localStorage.removeItem(USER);

  notify();
}

// Get stored user
function getStoredUser() {
  try {
    const user = read(USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
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

  // Subscribe to serialized user data
  const userData = useSyncExternalStore(
    subscribe,
    () => read(USER),
    () => null,
  );

  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  return {
    loggedIn,
    role,
    user,
    ready,
    token: getToken(),
    logout: clearAuth,
  };
}
