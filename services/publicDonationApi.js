const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDonationSummary() {
  const response = await fetch(`${API_URL}/public/donations/summary`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch donation summary");
  }

  const result = await response.json();

  return result.data;
}

export async function getPublicDonations() {
  const response = await fetch(`${API_URL}/public/donation-list`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch public donations");
  }

  const result = await response.json();

  if (!result.status || !Array.isArray(result.data)) {
    throw new Error("Invalid donation API response");
  }

  return result.data
    .filter((d) => d.status === "approved" && !d.deleted_at)
    .map((d) => {
      const date = d.donation_date || d.created_at;

      return {
        id: d.id,
        date,
        dateLabel: date
          ? new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
        displayName: "Anonymous Donor",
        isNamed: false,
        amountMinor: null,
        purposeLabel: null,
        methodLabel: null,
      };
    })
    .filter((d) => d.dateLabel);
}


export async function getPublicFinancialLedger() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/financial-ledger`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch financial ledger");
  }

  const result = await response.json();

  if (!result.status || !Array.isArray(result.data?.ledger)) {
    throw new Error("Invalid financial ledger response");
  }

  return result.data.ledger;
}
