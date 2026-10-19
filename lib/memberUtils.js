export const PAGE_SIZE = 10;
export const EMPTY_MEMBER_FILTERS = { search: "", status: "all" };

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

// Formats an ISO date without creating a Date object (no timezone shifts, safe for prerendering).
export function formatJoinDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return MONTHS[m - 1] ? `${d} ${MONTHS[m - 1]} ${y}` : "—";
}

export function getInitials(name) {
  const letters = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return letters || "?";
}

export function filterMembers(members, f) {
  const q = f.search.trim().toLowerCase();
  const phoneLike = /^[\d\s+()-]+$/.test(q); // only treat the query as a phone number if it is one
  const digits = phoneLike ? q.replace(/\D/g, "") : "";
  return members.filter((x) => {
    if (f.status !== "all" && x.status !== f.status) return false;
    if (!q) return true;
    if (
      [x.name, x.memberId, x.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
      return true;
    return (
      digits.length > 0 && (x.phone ?? "").replace(/\D/g, "").includes(digits)
    ); // phone search ignores spaces and dashes
  });
}
