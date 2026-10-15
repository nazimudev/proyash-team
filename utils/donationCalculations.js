// All money is handled as integer minor units (paisa) to avoid floating-point errors.
// Financial totals must come from authorized accounting records, never from the public list.

const BDT = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function toMinorUnits(amount) {
  const n = Number(amount);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

export function formatBDT(minor) {
  return BDT.format(minor / 100);
}

export function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka", // fixed timezone keeps server and client output identical
  });
}

function sumMinor(items) {
  return items.reduce((total, item) => total + (item.amountMinor ?? 0), 0);
}

function inPeriod(dateIso, period) {
  if (!period) return true;
  const t = new Date(dateIso).getTime();
  if (period.from && t < new Date(period.from).getTime()) return false;
  if (period.to && t > new Date(period.to).getTime()) return false;
  return true;
}

// A donation is publicly listable only when confirmed, not refunded, and approved for publication.
export function isPubliclyDisplayable(r) {
  return (
    r.verificationStatus === "confirmed" &&
    !r.refunded &&
    r.publicationApproved === true
  );
}

// Builds the public-safe shape. Private fields (phone, email, transaction ID, message, internal name) are never copied.
export function getPublicDisplay(r) {
  const isAnonymous = Boolean(r.anonymous) || !r.publishName;
  return {
    id: r.id,
    donorName: isAnonymous
      ? "Anonymous Donor"
      : r.publicDisplayName || "Anonymous Donor",
    isAnonymous,
    amountLabel: r.publishAmount ? formatBDT(r.amountMinor) : null,
    date: r.confirmedAt ?? null,
    purpose: r.publicPurpose ?? null,
  };
}

// Accounting model:
// Available = confirmed donations (non-refunded) + confirmed other income
//             - approved expenses - approved refunds/adjustments.
// Refunded donations are excluded from donation totals, so refund records must not double-count them.
export function calculateSummary({
  donations = [],
  otherIncome = [],
  expenses = [],
  refunds = [],
  period = null,
}) {
  const confirmedDonations = donations.filter(
    (d) =>
      d.verificationStatus === "confirmed" &&
      !d.refunded &&
      inPeriod(d.confirmedAt, period),
  );
  const confirmedOther = otherIncome.filter(
    (i) => i.status === "confirmed" && inPeriod(i.date, period),
  );
  const approvedExpenses = expenses.filter(
    (e) => e.status === "approved" && inPeriod(e.date, period),
  );
  const approvedRefunds = refunds.filter(
    (r) => r.status === "approved" && inPeriod(r.date, period),
  );

  const totalDonationsMinor = sumMinor(confirmedDonations);
  const otherIncomeMinor = sumMinor(confirmedOther);
  const expensesMinor = sumMinor(approvedExpenses);
  const refundsMinor = sumMinor(approvedRefunds);

  return {
    totalDonationsMinor,
    otherIncomeMinor,
    expensesMinor,
    refundsMinor,
    availableMinor:
      totalDonationsMinor + otherIncomeMinor - expensesMinor - refundsMinor,
    // Published count is all-time and independent of the reporting period.
    publishedDonationCount: donations.filter(isPubliclyDisplayable).length,
  };
}
