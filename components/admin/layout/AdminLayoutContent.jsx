"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AdminTopbar from "./AdminTopbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutContent({ children }) {
  const router = useRouter();
  const { user, logout, ready } = useAuth();

const handleLogout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    logout();
    router.replace("/auth");
  }
};

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={user} onLogout={handleLogout} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
