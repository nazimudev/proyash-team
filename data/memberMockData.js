// ─────────────────────────────────────────────────────────────────────────────
// DEMONSTRATION DATA — used only when NEXT_PUBLIC_MEMBER_DATA_MODE=mock.
// All demo records live here. UI components never import this file; they go
// through src/services/*. Nothing here is real, and no passwords are stored.
// Changes made in demo mode are kept in memory only (they reset on page reload).
// ─────────────────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const REQUIRED_AMOUNT = 500;

const MONTH_REFS = [
  { year: 2025, month: 12 },
  ...Array.from({ length: 11 }, (_, i) => ({ year: 2026, month: i + 1 })),
];

const contributions = MONTH_REFS.map(({ year, month }) => ({
  id: `CON-${year}-${pad(month)}`,
  year,
  month,
  requiredAmount: REQUIRED_AMOUNT,
  dueDate: `${year}-${pad(month)}-10`,
}));

const METHODS = [
  "bKash",
  "Nagad",
  "bKash",
  "Bank Transfer",
  "Rocket",
  "Cash",
  "bKash",
  "Nagad",
  "bKash",
];
const TXN_PREFIX = {
  bKash: "BK",
  Nagad: "NG",
  Rocket: "RK",
  "Bank Transfer": "BT",
};
const ADMIN = "Rafiq Ahmed (Treasurer)";

const verified = contributions.slice(0, 9).map((c, i) => {
  const method = METHODS[i];
  const day = 4 + ((i * 3) % 7);
  return {
    id: `PAY-${1001 + i}`,
    contributionId: c.id,
    year: c.year,
    month: c.month,
    amount: REQUIRED_AMOUNT,
    method,
    transactionId: TXN_PREFIX[method]
      ? `${TXN_PREFIX[method]}${7340218 + i * 7919}`
      : null,
    receiptNo: method === "Cash" ? `RCPT-${2210 + i}` : null,
    paymentDate: `${c.year}-${pad(c.month)}-${pad(day)}`,
    status: "verified",
    verifiedBy: ADMIN,
    verifiedAt: `${c.year}-${pad(c.month)}-${pad(day + 1)}`,
    rejectionReason: null,
  };
});

const payments = [
  ...verified,
  {
    id: "PAY-1010",
    contributionId: "CON-2026-09",
    year: 2026,
    month: 9,
    amount: 300,
    method: "bKash",
    transactionId: "BK8120045",
    receiptNo: null,
    paymentDate: "2026-09-08",
    status: "verified",
    verifiedBy: ADMIN,
    verifiedAt: "2026-09-09",
    rejectionReason: null,
  },
  {
    id: "PAY-1011",
    contributionId: "CON-2026-10",
    year: 2026,
    month: 10,
    amount: 500,
    method: "Nagad",
    transactionId: "NG6650931",
    receiptNo: null,
    paymentDate: "2026-10-14",
    status: "pending",
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
  },
  {
    id: "PAY-1012",
    contributionId: "CON-2026-11",
    year: 2026,
    month: 11,
    amount: 500,
    method: "Rocket",
    transactionId: "RK0042217",
    receiptNo: null,
    paymentDate: "2026-11-12",
    status: "rejected",
    verifiedBy: ADMIN,
    verifiedAt: "2026-11-13",
    rejectionReason:
      "The transaction ID could not be matched. Please resubmit with the correct ID.",
  },
].sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));

const member = {
  membershipId: "PS-2025-00418",
  nameEn: "Tahmina Akter",
  nameBn: "তাহমিনা আক্তার",
  fatherName: "Abdul Karim",
  motherName: "Rokeya Begum",
  dateOfBirth: "1996-04-12",
  gender: "Female",
  religion: "Islam",
  nationality: "Bangladeshi",
  occupation: "School Teacher",
  education: "B.Sc. in Mathematics",
  bloodGroup: "B+",
  maritalStatus: "Married",
  mobile: "01712345678",
  photoUrl: null, // null → initials avatar
  permanent: {
    village: "Char Kalikapur",
    postOffice: "Sirajganj Sadar",
    upazila: "Sirajganj Sadar",
    district: "Sirajganj",
  },
  present: {
    village: "Mirpur-10",
    postOffice: "Mirpur",
    upazila: "Mirpur",
    district: "Dhaka",
  },
  // Fields the member may NOT edit (server-driven in API mode). Set to [] to allow everything.
  lockedFields: ["nameEn", "dateOfBirth"],
  // membership
  email: "tahmina.akter@example.com",
  status: "approved", // pending | approved | rejected | suspended
  registeredAt: "2025-11-18",
  approvedAt: "2025-11-24",
  feeStatus: "paid", // paid | unpaid | waived
  // account
  account: {
    status: "active",
    createdAt: "2025-11-18",
    updatedAt: "2026-10-02",
  },
};

const clone = (v) => JSON.parse(JSON.stringify(v));

// Mutable in-memory "database" for demo mode.
export const mockDb = {
  member: clone(member),
  contributions: clone(contributions),
  payments: clone(payments),
};

// Emails the demo treats as already registered, to demonstrate the "email taken" error.
export const DEMO_TAKEN_EMAILS = ["admin@example.com", "taken@example.com"];

export const simulateLatency = (ms = 450) =>
  new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 250));
