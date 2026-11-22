// ─────────────────────────────────────────────────────────────────────────────
// CALCULATION LAYER (replaceable)
// In API mode the Laravel backend returns finished records, statuses and totals
// and NONE of this file is used. In mock mode it plays the role of the backend.
// Rule: an amount only counts as paid when a payment is VERIFIED. Pending payments
// never count as paid; rejected payments are ignored.
// ─────────────────────────────────────────────────────────────────────────────
import { monthShort } from './format';

export function deriveContributionRecords(contributions, payments) {
  return contributions
    .map((c) => {
      const linked = payments.filter((p) => p.contributionId === c.id);
      const verified = linked.filter((p) => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
      const pending = linked.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
      const lastVerified = linked.filter((p) => p.status === 'verified').map((p) => p.paymentDate).sort().pop() || null;

      let status = 'due';
      if (verified >= c.requiredAmount) status = 'paid';
      else if (pending > 0) status = 'pending_verification';
      else if (verified > 0) status = 'partial';

      return {
        id: c.id,
        year: c.year,
        month: c.month,
        dueDate: c.dueDate,
        requiredAmount: c.requiredAmount,
        paidAmount: Math.min(verified, c.requiredAmount),
        pendingAmount: status === 'pending_verification' ? pending : 0,
        dueAmount: status === 'due' || status === 'partial' ? c.requiredAmount - verified : 0,
        paymentDate: lastVerified,
        status,
      };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month); // newest first
}

export function summarizeContributions(records) {
  const sum = (key) => records.reduce((s, r) => s + r[key], 0);
  const expectedAmount = sum('requiredAmount');
  const paidAmount = sum('paidAmount');
  return {
    expectedAmount,
    paidAmount,
    dueAmount: sum('dueAmount'),
    pendingAmount: sum('pendingAmount'),
    outstandingAmount: Math.max(expectedAmount - paidAmount, 0),
    paidMonths: records.filter((r) => r.status === 'paid').length,
    dueMonths: records.filter((r) => r.status === 'due' || r.status === 'partial').length,
    pendingMonths: records.filter((r) => r.status === 'pending_verification').length,
    completionPercent: expectedAmount ? Math.round((paidAmount / expectedAmount) * 100) : 0,
  };
}

export function filterContributions(records, { month, year, status, search } = {}) {
  const q = (search || '').trim().toLowerCase();
  return records.filter((r) => {
    if (month && r.month !== Number(month)) return false;
    if (year && r.year !== Number(year)) return false;
    if (status && r.status !== status) return false;
    if (q && !`${monthShort(r.month)} ${r.year}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function paginate(items, page = 1, pageSize = 10) {
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  return {
    items: items.slice((safePage - 1) * pageSize, safePage * pageSize),
    pagination: { page: safePage, pageSize, total, totalPages },
  };
}

export function buildMonthlyChart(records) {
  return [...records]
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map(({ year, month, requiredAmount, paidAmount, pendingAmount, dueAmount, status }) => ({
      year, month, requiredAmount, paidAmount, pendingAmount, dueAmount, status,
    }));
}

// Oldest unpaid month (due / partial). Falls back to a month awaiting verification.
export function findUpcomingDue(records) {
  const asc = [...records].sort((a, b) => a.year - b.year || a.month - b.month);
  return asc.find((r) => r.status === 'due' || r.status === 'partial') || asc.find((r) => r.status === 'pending_verification') || null;
}
