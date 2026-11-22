// Central switches for the Member Panel.
// NEXT_PUBLIC_MEMBER_DATA_MODE=mock (default) | api
export const MEMBER_DATA_MODE = (
  process.env.NEXT_PUBLIC_MEMBER_DATA_MODE || "api"
).toLowerCase();
export const isMock = MEMBER_DATA_MODE !== "api";

// Laravel base URL, e.g. http://localhost:8000 (no trailing slash). Used only in api mode.
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
  /\/$/,
  "",
);

// Where unauthenticated members / logout go. Point this at your existing login page.
export const LOGIN_PATH = process.env.NEXT_PUBLIC_LOGIN_PATH || "/auth";

export const ORG_NAME = "Proyash Team";
// Set to a public path (e.g. '/logo.png') to show your real logo instead of the icon mark.
export const ORG_LOGO_SRC = process.env.NEXT_PUBLIC_ORG_LOGO || "";

// Set false if your root layout already renders <Toaster /> from sonner (avoids duplicate toasts).
export const MEMBER_RENDERS_TOASTER = true;
