import AuthGuard from "@/components/auth/AuthGuard";

export const metadata = {
  title: "Member | Proyash Songgothon",
  robots: { index: false, follow: false },
};

export default function MemberLayout({ children }) {
  // SECURITY TODO: this layout does NOT authorize anyone yet.
  // Before real data is shown, verify the session and an admin/super_admin
  // role on the server (middleware or a server-side check against the Laravel
  // API), and enforce the same permissions on every Laravel admin endpoint.
  return (
    <AuthGuard roles={["member"]}>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
