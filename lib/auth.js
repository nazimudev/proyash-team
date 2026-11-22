/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const TOKEN = "auth_token";
const ROLE = "auth_role";
const USER = "auth_user";

// Subscribe to authentication changes
const subscribe = (callback) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener("auth-changed", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-changed", callback);
  };
};

// Safely read localStorage
const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

// Notify subscribers
const notify = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-changed"));
  }
};

// Get token
export const getToken = () => read(TOKEN);

// Save authentication
export function saveAuth(token, role, user = null) {
  if (!token) {
    throw new Error("Authentication token is required.");
  }

  try {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(ROLE, role ?? "member");

    if (user) {
      localStorage.setItem(USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER);
    }

    notify();
  } catch (error) {
    clearAuth();
    throw new Error("Unable to save authentication data.");
  }
}

// Clear local authentication
export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ROLE);
    localStorage.removeItem(USER);
  } catch (error) {
    console.error("Unable to clear authentication storage:", error);
  }

  notify();
}

// Parse stored user
function parseUser(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// Authentication hook
export function useAuth() {
  const token = useSyncExternalStore(
    subscribe,
    () => read(TOKEN),
    () => null,
  );

  const role = useSyncExternalStore(
    subscribe,
    () => read(ROLE),
    () => null,
  );

  const userData = useSyncExternalStore(
    subscribe,
    () => read(USER),
    () => null,
  );

  // Hydration-safe ready state
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const user = parseUser(userData);
  const loggedIn = Boolean(token);

  return {
    loggedIn,
    role: loggedIn ? role : null,
    user,
    token,
    ready,
    logout: clearAuth,
  };
}
