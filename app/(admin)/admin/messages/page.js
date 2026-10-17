import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Contact Messages | Proyash Admin" };

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Contact Messages" description="Read messages sent through the contact form." />
      <EmptyState title="No messages to show yet" description="Contact form messages will appear here once the API is connected." />
    </>
  );
}
