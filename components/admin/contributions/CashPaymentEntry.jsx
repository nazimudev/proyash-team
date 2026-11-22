/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Banknote,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { contributionsApi } from "@/services/admin/contributionsApi";
import { contributionPaymentsApi } from "@/services/admin/contributionPaymentsApi";

function formatAmount(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getMemberName(member) {
  return (
    member?.user?.name ||
    member?.full_name ||
    member?.name ||
    `Member #${member?.id || "—"}`
  );
}


function getDueAmount(contribution) {
  // Pending payments বাদ দেওয়ার পর প্রকৃত available balance
  if (
    contribution?.available_payment_balance !== undefined &&
    contribution?.available_payment_balance !== null
  ) {
    return Number(contribution.available_payment_balance);
  }

  // Backend-এর due_amount থাকলে সেটি ব্যবহার
  if (
    contribution?.due_amount !== undefined &&
    contribution?.due_amount !== null
  ) {
    return Number(contribution.due_amount);
  }

  const required = Number(contribution?.required_amount || 0);
  const waived = Number(contribution?.waived_amount || 0);
  const paid = Number(
    contribution?.approved_payments_sum_amount ??
      contribution?.approved_payments_sum ??
      contribution?.paid_amount ??
      0,
  );

  return Math.max(0, required - waived - paid);
}


function getContributionLabel(contribution) {
  const month = Number(contribution?.month);

  const monthName = month
    ? new Date(2000, month - 1, 1).toLocaleString("en", {
        month: "long",
      })
    : `Month ${contribution?.month || "—"}`;

  return `${monthName} ${contribution?.year || ""}`.trim();
}

function getDueRecords(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;

  return [];
}

export default function CashPaymentEntry() {
  const today = new Date().toISOString().slice(0, 10);

  const [dueRecords, setDueRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [memberId, setMemberId] = useState("");
  const [contributionId, setContributionId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today);
  const [notes, setNotes] = useState("");

  const [successResult, setSuccessResult] = useState(null);

  const fetchDueRecords = useCallback(async () => {
    try {
      setLoading(true);

      const response = await contributionsApi.getDueMembers({
        per_page: 100,
      });

      setDueRecords(getDueRecords(response));
    } catch (error) {
      toast.error(error.message || "Failed to load due contributions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDueRecords();
  }, [fetchDueRecords]);

  // Group outstanding contribution records by member.
  const members = useMemo(() => {
    const map = new Map();

    dueRecords.forEach((record) => {
      const member = record.member;

      if (!member?.id) return;

      if (!map.has(String(member.id))) {
        map.set(String(member.id), {
          id: member.id,
          name: getMemberName(member),
          records: [],
        });
      }

      map.get(String(member.id)).records.push(record);
    });

    return Array.from(map.values());
  }, [dueRecords]);

  const selectedMember = members.find(
    (member) => String(member.id) === String(memberId),
  );

  const memberContributions = selectedMember?.records || [];

  const selectedContribution = memberContributions.find(
    (item) => String(item.id) === String(contributionId),
  );

  const selectedDueAmount = selectedContribution
    ? getDueAmount(selectedContribution)
    : 0;

  const handleMemberChange = (value) => {
    setMemberId(value);
    setContributionId("");
    setAmount("");
    setSuccessResult(null);
  };

  const handleContributionChange = (value) => {
    setContributionId(value);

    const contribution = memberContributions.find(
      (item) => String(item.id) === String(value),
    );

    setAmount(contribution ? String(getDueAmount(contribution)) : "");

    setSuccessResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!memberId || !contributionId) {
      toast.error("Please select a member and contribution.");
      return;
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    if (paymentAmount > selectedDueAmount) {
      toast.error(
        `Payment cannot exceed the outstanding amount of ${formatAmount(selectedDueAmount)}.`,
      );
      return;
    }

    if (!paymentDate) {
      toast.error("Please select the payment date.");
      return;
    }

    try {
      setSubmitting(true);
      setSuccessResult(null);

      const response = await contributionPaymentsApi.storeCashPayment({
        member_id: Number(memberId),
        contribution_id: Number(contributionId),
        amount: paymentAmount,
        payment_date: paymentDate,
        notes: notes.trim() || null,
      });

      toast.success(response.message || "Cash payment recorded successfully.");

      setSuccessResult({
        message: response.message || "Cash payment recorded successfully.",
        data: response.data,
      });

      setMemberId("");
      setContributionId("");
      setAmount("");
      setPaymentDate(today);
      setNotes("");

      await fetchDueRecords();
    } catch (error) {
      toast.error(error.message || "Failed to record cash payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Banknote size={22} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Record Cash Payment
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Record a cash contribution payment received from a member.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchDueRecords}
            disabled={loading || submitting}
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="mx-auto animate-spin text-green-700" />
            <p className="mt-2 text-sm text-gray-500">
              Loading members and due contributions...
            </p>
          </div>
        ) : (
          <>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {/* Member */}
              <div>
                <label
                  htmlFor="cash-member"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Member <span className="text-red-500">*</span>
                </label>

                <select
                  id="cash-member"
                  value={memberId}
                  onChange={(e) => handleMemberChange(e.target.value)}
                  required
                  disabled={submitting}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Choose a member</option>

                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} — #{member.id}
                    </option>
                  ))}
                </select>

                {members.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    No members with outstanding contributions found.
                  </p>
                )}
              </div>

              {/* Contribution */}
              <div>
                <label
                  htmlFor="cash-contribution"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Monthly Contribution <span className="text-red-500">*</span>
                </label>

                <select
                  id="cash-contribution"
                  value={contributionId}
                  onChange={(e) => handleContributionChange(e.target.value)}
                  required
                  disabled={!memberId || submitting}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                >
                  <option value="">Choose a contribution</option>

                  {memberContributions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getContributionLabel(item)} — Due:{" "}
                      {formatAmount(getDueAmount(item))}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="cash-amount"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Payment Amount (BDT) <span className="text-red-500">*</span>
                </label>

                <input
                  id="cash-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={selectedDueAmount || undefined}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={!contributionId || submitting}
                  placeholder="Enter amount"
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                />

                {selectedContribution && (
                  <p className="mt-2 text-xs text-gray-500">
                    Outstanding amount:{" "}
                    <span className="font-semibold text-gray-800">
                      {formatAmount(selectedDueAmount)}
                    </span>
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="cash-payment-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Payment Date <span className="text-red-500">*</span>
                </label>

                <input
                  id="cash-payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  disabled={submitting}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mt-5">
              <label
                htmlFor="cash-notes"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Notes
              </label>

              <textarea
                id="cash-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                maxLength={1000}
                placeholder="Optional payment notes..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
              />
            </div>

            {/* Submit */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Cash payments are recorded as approved by the backend.
              </p>

              <button
                type="submit"
                disabled={submitting || !members.length}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Banknote size={17} />
                    Record Cash Payment
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>

      {/* Success */}
      {successResult && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 size={20} />
            <h3 className="font-semibold">Payment Recorded Successfully</h3>
          </div>
          <p className="mt-2 text-sm text-green-800">{successResult.message}</p>
        </div>
      )}

      {/* Info */}
      {!loading && members.length === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <AlertCircle size={19} className="mt-0.5 shrink-0 text-blue-700" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              No Outstanding Contributions
            </h3>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              There are currently no outstanding contribution records available
              for cash payment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
