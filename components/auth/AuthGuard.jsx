"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { dashboardFor } from "@/data/site";

export default function AuthGuard({ roles, children }) {
  const { loggedIn, role, ready } = useAuth();
  const router = useRouter();
  const allowed = loggedIn && roles.includes(role);

  useEffect(() => {
    if (!ready) return;
    if (!loggedIn) router.replace("/auth");
    else if (!allowed) router.replace(dashboardFor(role)); // member admin page-e gele nijer dashboard-e
  }, [ready, loggedIn, allowed, role, router]);

  if (!ready || !allowed) return <p className="p-10">Loading…</p>;
  return children;
}
