export const MEMBERSHIP_FEE_BDT = 150;
export const PAGE_SIZE = 10;
export const MEMBER_REQUESTS_ROUTE = "/admin/members/requests";

// ASSUMPTION: confirm these status values and labels against the real backend workflow.
export const STATUS_META = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  approved: {
    label: "Awaiting Membership Fee",
    cls: "bg-sky-50 text-sky-800 ring-sky-200",
  },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-800 ring-red-200" },
};

// The page defaults to the review queue (Pending). Other statuses act as a history view.
export const STATUS_FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Awaiting Membership Fee" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All applications" },
];
export const EMPTY_REQUEST_FILTERS = {
  search: "",
  status: "pending",
  sort: "oldest",
};

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

// Formats an ISO date without a Date object (no timezone shifts, safe for prerendering).
export function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return MONTHS[m - 1] ? `${d} ${MONTHS[m - 1]} ${y}` : "—";
}

export const formatBdt = (n) =>
  `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n)}`;

export function getInitials(name) {
  return (
    (name ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?"
  );
}

export function filterRequests(apps, f) {
  const q = f.search.trim().toLowerCase();
  const phoneLike = /^[\d\s+()-]+$/.test(q); // only treat the query as a phone number if it is one
  const digits = phoneLike ? q.replace(/\D/g, "") : "";
  const list = apps.filter((x) => {
    if (f.status !== "all" && x.status !== f.status) return false;
    if (!q) return true;
    if (
      [x.full_name_en, x.full_name_bn, x.email, x.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
      return true;
    return (
      digits.length > 0 &&
      (x.mobile_number ?? "").replace(/\D/g, "").includes(digits)
    );
  });
  const dir = f.sort === "newest" ? -1 : 1;
  return list.sort(
    (a, b) =>
      dir *
      (a.submitted_at.localeCompare(b.submitted_at) ||
        a.id.localeCompare(b.id)),
  );
}

// Counts come from the data given; with sample data they are sample counts, not organization statistics.
export function calculateRequestSummary(apps) {
  const n = (s) => apps.filter((x) => x.status === s).length;
  return {
    pending: n("pending"),
    approved: n("approved"),
    rejected: n("rejected"),
  };
}

// ASSUMPTION: a reason is required. Remove the requirement if the real workflow doesn't need one.
export function validateRejectionReason(reason) {
  const t = reason.trim();
  if (!t) return "Enter a reason for rejecting this application.";
  if (t.length < 5) return "Please give a little more detail.";
  if (t.length > 500) return "Use 500 characters or fewer.";
  return null;
}
