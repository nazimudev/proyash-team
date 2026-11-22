import PageHeader from "@/components/admin/ui/PageHeader";
import ContributionOverview from "@/components/admin/contributions/ContributionOverview";

export const instant = false;

export const metadata = {
  title: "Contributions | Proyash Admin",
};

export default function AdminContributionsPage() {
  return (
    <>
      <PageHeader
        title="Contributions"
        description="Manage monthly member contributions, payments, and outstanding dues."
      />

      <ContributionOverview />
    </>
  );
}
