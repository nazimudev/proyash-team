const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(iso) {
  if (!iso) return "—";

  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);

  return MONTHS[m - 1] ? `${d} ${MONTHS[m - 1]} ${y}` : "—";
}

export function getAgreementDate(agreements, type) {
  const agreement = agreements?.find((item) => item.agreement_type === type);

  return agreement?.accepted_at
    ? formatDate(agreement.accepted_at)
    : "Not recorded";
}

