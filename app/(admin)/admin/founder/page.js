import FounderManagementPage from "@/components/admin/founders/FounderManagementPage";

export const metadata = { title: "Founder Management | Proyash Admin" };

// SECURITY: this page and every founder write must be protected by the backend (authenticated administrators only).
// Nothing in the frontend is an authorization check.
export default function AdminFoundersPage() {
  return <FounderManagementPage />;
}
