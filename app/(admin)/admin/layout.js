import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata = {
  title: "Admin | Proyash Songgothon",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  // SECURITY TODO: this layout does NOT authorize anyone yet.
  // Before real data is shown, verify the session and an admin/super_admin
  // role on the server (middleware or a server-side check against the Laravel
  // API), and enforce the same permissions on every Laravel admin endpoint.
  return (
    <AuthGuard roles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
