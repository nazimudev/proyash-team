"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { dashboardFor } from "@/data/site";

export default function AuthGuard({ roles = [], children }) {
  const { loggedIn, role, ready } = useAuth();
  const router = useRouter();

  const allowed = loggedIn && roles.includes(role);

  useEffect(() => {
    if (!ready) return;

    if (!loggedIn) {
      router.replace("/auth");
      return;
    }

    if (!allowed) {
      router.replace(dashboardFor(role));
    }
  }, [ready, loggedIn, allowed, role, router]);

  if (!ready || !allowed) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return children;
}
