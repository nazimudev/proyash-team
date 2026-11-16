/* eslint-disable react-hooks/error-boundaries */
import DonorList from "./DonorList";
import { getPublicDonations } from "@/services/publicDonationApi";

export default async function DonorListContent({ pageSize }) {
  try {
    const donations = await getPublicDonations();

    return <DonorList donations={donations} pageSize={pageSize} />;
  } catch (error) {
    console.error("Public donations error:", error);

    return (
      <section className="bg-white py-16 text-center">
        <p className="text-muted">
          Unable to load supporter records right now.
        </p>
      </section>
    );
  }
}
