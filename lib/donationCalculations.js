import { donationConfig } from "@/data/donationConfig";
import { financialMeta, ledgerEntries, publicDonationRecords } from "@/data/financialRecords";
import { formatDate, safeLink } from "@/lib/impact";

const hasText = (v) => typeof v === "string" && v.trim().length > 0;

/** Money is held as integer minor units (poisha) so sums never drift (0.1 + 0.2 = 0.30). */
export const toMinor = (amount) => Math.round(Number(amount) * 100);
const validAmount = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;

export function formatMoney(minor) {
  const whole = minor % 100 === 0;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: donationConfig.currency,
    currencyDisplay: "code",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(minor / 100)
    .replace(/\u00a0/g, " ");
}

/* What counts toward totals */
const COUNTED_STATUS = { donation: "confirmed", other_income: "confirmed", deduction: "confirmed", expense: "approved" };
const counts = (e) => validAmount(e?.amount) && COUNTED_STATUS[e.kind] === e.status;

/** All-time totals from AUTHORIZED ledger entries only (never from the public donor list). */
export function computeFinancials(entries) {
  const sum = (kind) => entries.filter((e) => e.kind === kind && counts(e)).reduce((t, e) => t + toMinor(e.amount), 0);
  const donationsMinor = sum("donation");
  const otherIncomeMinor = sum("other_income");
  const expensesMinor = sum("expense");
  const deductionsMinor = sum("deduction");
  return {
    donationsMinor,
    otherIncomeMinor,
    expensesMinor,
    deductionsMinor,
    balanceMinor: donationsMinor + otherIncomeMinor - expensesMinor - deductionsMinor,
  };
}

/** Public ledger rows: reviewed, approved for disclosure, and counted. No private fields exist on entries. */
export function getPublicLedger(entries) {
  return entries
    .filter((e) => e.isPublic === true && counts(e) && hasText(e.id) && hasText(e.description) && formatDate(e.date))
    .map((e) => {
      const isIncome = e.kind === "donation" || e.kind === "other_income";
      return {
        id: e.id,
        date: e.date,
        dateLabel: formatDate(e.date),
        description: e.description.trim(),
        category: hasText(e.category) ? e.category.trim() : null,
        incomeMinor: isIncome ? toMinor(e.amount) : null,
        expenseMinor: isIncome ? null : toMinor(e.amount),
        statusLabel: e.status === "approved" ? "Approved" : "Confirmed",
        kind: e.kind,
        projectLabel: hasText(e.projectLabel) ? e.projectLabel.trim() : null,
        documentUrl: safeLink(e.documentUrl),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getPublicExpenses = (entries) => getPublicLedger(entries).filter((r) => r.kind === "expense");

/** Whitelist mapping: private fields on a record can never reach the UI. */
export function getPublicDonations(records) {
  const purposeLabel = Object.fromEntries(donationConfig.purposes.map((p) => [p.id, p.label]));
  return records
    .filter((r) => r?.status === "confirmed" && r.isRefunded !== true && r.isPublished === true && hasText(r.id) && formatDate(r.date))
    .map((r) => {
      const isNamed = r.isAnonymous !== true && r.showName === true && hasText(r.displayName);
      return {
        id: r.id,
        date: r.date,
        dateLabel: formatDate(r.date),
        displayName: isNamed ? r.displayName.trim() : "Anonymous Donor",
        isNamed,
        amountMinor: r.showAmount === true && validAmount(r.amount) ? toMinor(r.amount) : null,
        purposeLabel: r.showPurpose === true ? purposeLabel[r.purpose] ?? null : null,
        methodLabel: hasText(r.methodLabel) ? r.methodLabel.trim() : null,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Everything the page needs. `published` is false (no numbers at all) unless the organization
 * has established a reporting baseline AND provided ledger entries. To use a Laravel API later,
 * make this async and fetch the same shapes.
 */
export function getDonationPageData() {
  const publicDonations = getPublicDonations(publicDonationRecords);
  const baseline = financialMeta.baselineEstablished === true && ledgerEntries.length > 0;
  return {
    donations: publicDonations,
    report: baseline
      ? {
          published: true,
          ...computeFinancials(ledgerEntries),
          publishedDonationCount: publicDonations.length,
          reportingPeriod: hasText(financialMeta.reportingPeriod) ? financialMeta.reportingPeriod.trim() : null,
          lastUpdated: formatDate(financialMeta.lastUpdated),
          ledger: getPublicLedger(ledgerEntries),
          expenses: getPublicExpenses(ledgerEntries),
        }
      : { published: false, ledger: [], expenses: [] },
  };
}
