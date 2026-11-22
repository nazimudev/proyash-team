import { isMock } from "@/lib/member/config";
import { memberApi } from "@/lib/member/apiClient";
import { mockDb, simulateLatency } from "@/data/memberMockData";
import {
  deriveContributionRecords,
  filterContributions,
  paginate,
  summarizeContributions,
} from "../lib/member/contributionCalc";

export async function getMemberContributions(filters = {}) {
  if (!isMock) {
    const { pageSize = 6, ...rest } = filters;

    const response = await memberApi.get("/member/contributions", {
      ...rest,
      per_page: pageSize,
    });

    // Laravel response mapping
    const contributionData = response?.contributions ?? {};
    const rawRecords = contributionData.data ?? [];

    const records = rawRecords.map((item) => {
      const requiredAmount = Number(
        item.payable_amount ?? item.required_amount ?? 0,
      );
      const paidAmount = Number(item.paid_amount ?? 0);
      const pendingAmount = Number(item.pending_amount ?? 0);
      const dueAmount = Number(item.due_amount ?? 0);

      let status = "due";

      if (pendingAmount > 0) {
        status = "pending_verification";
      } else if (paidAmount > 0 && dueAmount > 0) {
        status = "partial";
      } else if (dueAmount <= 0) {
        status = "paid";
      }

      return {
        id: item.id,
        year: Number(item.year),
        month: Number(item.month),
        dueDate: item.due_date,
        requiredAmount,
        paidAmount,
        pendingAmount,
        dueAmount,
        paymentDate: item.payment_date ?? null,
        status,
      };
    });

    const rawSummary = response?.summary ?? {};

    const summary = {
      expectedAmount:
        Number(rawSummary.total_required ?? 0) -
        Number(rawSummary.total_waived ?? 0),

      paidAmount: Number(rawSummary.total_paid ?? 0),
      dueAmount: Number(rawSummary.total_due ?? 0),
      pendingAmount: Number(rawSummary.total_pending ?? 0),

      // Temporary counts from the current page.
      // For all-filtered-record counts, backend must provide these.
      paidMonths: records.filter((r) => r.status === "paid").length,
      dueMonths: records.filter(
        (r) => r.status === "due" || r.status === "partial",
      ).length,
      pendingMonths: records.filter((r) => r.status === "pending_verification")
        .length,
    };

    return {
      records,
      summary,

      pagination: {
        page: contributionData.current_page ?? 1,
        pageSize: Number(contributionData.per_page ?? pageSize),
        total: contributionData.total ?? 0,
        totalPages: contributionData.last_page ?? 1,
      },

      filterOptions: {
        years: [...new Set(records.map((r) => r.year))].sort((a, b) => b - a),
      },
    };
  }

  await simulateLatency();

  const all = deriveContributionRecords(mockDb.contributions, mockDb.payments);

  const filtered = filterContributions(all, filters);

  const { items, pagination } = paginate(
    filtered,
    filters.page,
    filters.pageSize || 6,
  );

  return {
    records: items,
    summary: summarizeContributions(filtered),
    pagination,
    filterOptions: {
      years: [...new Set(all.map((r) => r.year))].sort((a, b) => b - a),
    },
  };
}




export async function getMemberPaymentMethods() {
  if (!isMock) {
    const response = await memberApi.get("/member/payment-methods");

    return Array.isArray(response) ? response : [];
  }

  await simulateLatency();

  return (mockDb.paymentMethods ?? []).filter(
    (method) =>
      method.is_active &&
      String(method.name).toLowerCase() !== "cash" &&
      String(method.type).toLowerCase() !== "cash",
  );
}

export async function submitMemberContribution(contributionId, payload) {
  if (!isMock) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return memberApi.post(
      `/member/contributions/${contributionId}/payments`,
      formData,
    );
  }

  await simulateLatency();

  return {
    success: true,
    message: "Payment submitted successfully.",
  };
}




