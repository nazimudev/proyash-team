// ASSUMPTION: status values "new" | "read" | "replied" | "archived". Confirm against the backend.
export const PAGE_SIZE = 10;
export const STATUS_META = {
  new: { label: "New", cls: "bg-green-50 text-green-800 ring-green-200" },
  read: { label: "Read", cls: "bg-gray-100 text-gray-700 ring-gray-200" },
  replied: { label: "Replied", cls: "bg-sky-50 text-sky-800 ring-sky-200" },
  archived: {
    label: "Archived",
    cls: "bg-amber-50 text-amber-800 ring-amber-200",
  },
};
export const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  ...Object.entries(STATUS_META).map(([value, m]) => ({
    value,
    label: m.label,
  })),
];
export const EMPTY_MESSAGE_FILTERS = {
  search: "",
  status: "all",
  sort: "newest",
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

// Reads "YYYY-MM-DDTHH:mm" by hand (no Date object, so no timezone shifts or prerender problems).
// The backend should send timestamps already in the local (Bangladesh) time you want shown, or this needs a timezone step.
export function formatDateTime(iso, { time = true } = {}) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(iso ?? "");
  if (!m) return "—";
  const date = `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  if (!time || m[4] === undefined) return date;
  const h = Number(m[4]);
  return `${date}, ${h % 12 || 12}:${m[5]} ${h >= 12 ? "PM" : "AM"}`;
}

export const isValidEmail = (s) =>
  typeof s === "string" &&
  s.length <= 254 &&
  /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(s.trim());

// Builds a tel: link from digits and a leading + only, so nothing else can be injected into the URL.
export function telHref(phone) {
  if (!phone) return null;
  const cleaned = phone.trim().replace(/(?!^\+)[^\d]/g, "");
  return cleaned.replace(/\D/g, "").length >= 7 ? `tel:${cleaned}` : null;
}

export function mailtoHref(email, subject) {
  if (!isValidEmail(email)) return null;
  return `mailto:${email.trim()}?subject=${encodeURIComponent(`Re: ${subject ?? ""}`.trim())}`;
}

export function filterMessages(list, f) {
  const q = f.search.trim().toLowerCase();
  const phoneLike = /^[\d\s+()-]+$/.test(q); // only treat the query as a phone number if it is one
  const digits = phoneLike ? q.replace(/\D/g, "") : "";
  const dir = f.sort === "oldest" ? 1 : -1;
  return list
    .filter((x) => {
      if (f.status !== "all" && x.status !== f.status) return false;
      if (!q) return true;
      if (
        [x.name, x.email, x.subject]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return true;
      return (
        digits.length > 0 && (x.phone ?? "").replace(/\D/g, "").includes(digits)
      );
    })
    .sort(
      (a, b) =>
        dir *
        (a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id)),
    );
}

export function summarizeMessages(list) {
  const n = (s) => list.filter((x) => x.status === s).length;
  return {
    total: list.length,
    new: n("new"),
    read: n("read"),
    replied: n("replied"),
  };
}
