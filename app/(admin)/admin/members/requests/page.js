import MemberRequestsPage from "@/components/admin/members/requests/MemberRequestsPage";

export const metadata = { title: "Member Requests | Proyash Admin" };

// SECURITY: this page and the review actions must be protected by the backend (authenticated administrators only).
// Nothing in the frontend, including this route, is an authorization check.
export default function AdminMemberRequestsPage() {
  return <MemberRequestsPage />;
}
