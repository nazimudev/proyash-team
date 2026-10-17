import MembershipHero from "@/components/membership/MembershipHero";
import MembershipForm from "@/components/membership/MembershipForm";
import { isConfigured } from "@/lib/membershipService";

export const metadata = {
  title: "Join | Proyash",
  description:
    "Apply to become a member of Proyash, a social welfare organization in Madhupur, Tangail, Bangladesh. Applications are reviewed by the Proyash administration.",
};

export default function JoinPage() {
  return (
    <>
      <MembershipHero />
      <MembershipForm applicationsOpen={isConfigured("apply")} />
    </>
  );
}
