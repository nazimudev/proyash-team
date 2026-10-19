// SAMPLE DATA ONLY. These records are not real organizational financial data.
// Amounts are numbers; dates are ISO strings (YYYY-MM-DD); projectId references sampleProjects.
const d = (o) => ({
  transactionId: null, projectId: null, message: null, adminNote: null,
  proofFileName: null, verifiedAt: null, verifiedBy: null, rejectionReason: null, archived: false, ...o,
});

export const sampleDonations = [
  d({ id: "DON-0001", donor: { isAnonymous: false, name: "Sample Donor Rahim", phone: "01700000001", email: "rahim@example.com" },
      amount: 5000, method: "bkash", transactionId: "SAMPLE-BK-7A21X9", donationDate: "2026-10-12", status: "verified",
      verifiedAt: "2026-10-13T09:30:00.000Z", message: "For those who need it most." }),
  d({ id: "DON-0002", donor: { isAnonymous: false, name: "Sample Donor Nusrat", phone: "01800000002", email: null },
      amount: 2500, method: "nagad", transactionId: "SAMPLE-NG-55K2Q1", donationDate: "2026-10-15", status: "pending",
      proofFileName: "sample-nagad-receipt.png" }),
  d({ id: "DON-0003", donor: { isAnonymous: false, name: "Sample Foundation Ltd.", phone: null, email: "accounts@example.org" },
      amount: 50000, method: "bank_transfer", transactionId: "SAMPLE-BT-000123", projectId: "prj-002",
      donationDate: "2026-09-28", status: "verified", verifiedAt: "2026-09-29T11:00:00.000Z",
      adminNote: "Sample note: matched to bank statement." }),
  d({ id: "DON-0004", donor: { isAnonymous: false, name: "Sample Donor Karim", phone: "01900000004", email: null },
      amount: 1000, method: "cash", donationDate: "2026-10-05", status: "verified", verifiedAt: "2026-10-05T14:00:00.000Z",
      projectId: "prj-001" }),
  d({ id: "DON-0005", donor: { isAnonymous: true, name: null, phone: null, email: null },
      amount: 10000, method: "other", donationDate: "2026-10-09", status: "verified", verifiedAt: "2026-10-10T08:00:00.000Z" }),
  d({ id: "DON-0006", donor: { isAnonymous: false, name: "Sample Donor Tania", phone: "01600000006", email: "tania@example.com" },
      amount: 3000, method: "rocket", transactionId: "SAMPLE-RK-INVALID", donationDate: "2026-10-14", status: "rejected",
      rejectionReason: "Transaction reference could not be matched." }),
  d({ id: "DON-0007", donor: { isAnonymous: false, name: "Sample Donor Rahim", phone: "01700000001", email: "rahim@example.com" },
      amount: 1500, method: "bkash", transactionId: "SAMPLE-BK-9C77L3", projectId: "prj-003", donationDate: "2026-08-20",
      status: "verified", verifiedAt: "2026-08-21T10:00:00.000Z" }),
  d({ id: "DON-0008", donor: { isAnonymous: false, name: "Sample Donor Imran", phone: "01500000008", email: null },
      amount: 750, method: "bkash", transactionId: "SAMPLE-BK-2M40P8", donationDate: "2026-10-16", status: "pending" }),
];
