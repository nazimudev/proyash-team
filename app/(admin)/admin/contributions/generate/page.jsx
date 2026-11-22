import PageHeader from "@/components/admin/ui/PageHeader";
import GenerateContributions from "@/components/admin/contributions/GenerateContributions";

export const instant = false;

export const metadata = {
  title: "Generate Contributions | Proyash Admin",
};

export default function GenerateContributionsPage() {
  return (
    <>
      <PageHeader
        title="Generate Contributions"
        description="Generate monthly contribution records for eligible members."
      />

      <GenerateContributions />
    </>
  );
}
