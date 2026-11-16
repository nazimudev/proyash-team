export const instant = false;
import AdminContactMessagesPage from "@/components/admin/contact/AdminContactMessagesPage";

export const metadata = { title: "Contact Messages | Proyash Admin" };

// SECURITY: this page and every contact-message endpoint must be protected by the backend
// (authenticated, authorized administrators only). Nothing in the frontend is an authorization check.
export default function MessagesPage() {
  return <AdminContactMessagesPage />;
}
