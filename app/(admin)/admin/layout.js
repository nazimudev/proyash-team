import AdminLayoutContent from "@/components/admin/layout/AdminLayoutContent";
import AuthGuard from "@/components/auth/AuthGuard";


export const metadata = {
  title: "Admin | Proyash Songgothon",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  
  return (
    <AuthGuard roles={["admin"]}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthGuard>
  );
}
