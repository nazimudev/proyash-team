/**
 * API CONTRACT — GET /api/member/payments   (auth: Sanctum, role: member)
 * Query: search (transaction ID or reference), status (verified|pending|rejected), method,
 *        date_from, date_to (YYYY-MM-DD), page, per_page
 * Response: { data: {
 *   payments: [{ id, contributionId, year, month, amount, method, transactionId|null, receiptNo|null,
 *                paymentDate, status, verifiedBy|null, verifiedAt|null, rejectionReason|null }],
 *   summary: { total, verified, pending, rejected },
 *   pagination: { page, pageSize, total, totalPages }
 * } }
 * Method values: bKash | Nagad | Rocket | Bank Transfer | Cash
 * Only status "verified" may be presented as paid. Errors: 401, 403, 422.
 */
import { isMock } from "@/lib/member/config";
import { memberApi } from "@/lib/member/apiClient";
import { mockDb, simulateLatency } from "@/data/memberMockData";
import { paginate } from "@/lib/member/contributionCalc";

// INTEGRATE: real call is already wired; `dateFrom/dateTo/pageSize` are mapped to snake_case.
export async function getMemberPayments(filters = {}) {
  if (!isMock) {
    const { dateFrom, dateTo, pageSize, ...rest } = filters;
    return memberApi.get("/member/payments", {
      ...rest,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: pageSize,
    });
  }
  await simulateLatency();
  const q = (filters.search || "").trim().toLowerCase();
  const filtered = mockDb.payments.filter((p) => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.method && p.method !== filters.method) return false;
    if (filters.dateFrom && p.paymentDate < filters.dateFrom) return false;
    if (filters.dateTo && p.paymentDate > filters.dateTo) return false;
    if (
      q &&
      !`${p.transactionId || ""} ${p.receiptNo || ""} ${p.id}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  });
  const { items, pagination } = paginate(
    filtered,
    filters.page,
    filters.pageSize || 6,
  );
  const count = (s) => mockDb.payments.filter((p) => p.status === s).length;
  return {
    payments: items,
    summary: {
      total: mockDb.payments.length,
      verified: count("verified"),
      pending: count("pending"),
      rejected: count("rejected"),
    },
    pagination,
  };
}
