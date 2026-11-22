import PageHeader from "@/components/admin/ui/PageHeader";
import CashPaymentEntry from "@/components/admin/contributions/CashPaymentEntry";

export const instant = false;

export const metadata = {
  title: "Cash Payment Entry | Proyash Admin",
};

export default function CashPaymentEntryPage() {
  return (
    <>
      <PageHeader
        title="Cash Payment Entry"
        description="Record cash payments received from members against their monthly contributions."
      />

      <CashPaymentEntry />
    </>
  );
}
