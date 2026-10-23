import ContactMessagesPage from "@/components/admin/contact-messages/ContactMessagesPage";

export const metadata = { title: "Contact Messages | Proyash Admin" };

// SECURITY: this page and every contact-message endpoint must be protected by the backend
// (authenticated, authorized administrators only). Nothing in the frontend is an authorization check.
export default function AdminContactMessagesPage() {
  return <ContactMessagesPage />;
}
