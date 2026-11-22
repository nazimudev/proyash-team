/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";

import { contributionPaymentsApi } from "@/services/admin/contributionPaymentsApi";

const STATUS_OPTIONS = [
  { label: "All Payments", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
  })}`;
}

function getStatusStyle(status) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-600";
}

function getMemberName(member) {
  return (
    member?.user?.name ||
    member?.full_name ||
    member?.name ||
    `Member #${member?.id || "—"}`
  );
}

function getStorageUrl(path) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  return `${backendUrl}/storage/${path.replace(/^\/?storage\//, "")}`;
}

export default function ContributionPayments() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [rejectPaymentId, setRejectPaymentId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const result = await contributionPaymentsApi.getPayments({
        status,
        page,
      });

      setPayments(result.data || []);
      setPagination(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const openDetails = async (id) => {
    try {
      setDetailsLoading(true);
      setSelectedPayment(null);

      const payment = await contributionPaymentsApi.getPayment(id);

      setSelectedPayment(payment);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this payment?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await contributionPaymentsApi.approvePayment(id);

      toast.success("Payment approved successfully.");

      setSelectedPayment(null);
      await fetchPayments();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    try {
      setActionLoading(true);

      await contributionPaymentsApi.rejectPayment(
        rejectPaymentId,
        rejectReason.trim(),
      );

      toast.success("Payment rejected successfully.");

      setRejectPaymentId(null);
      setRejectReason("");
      setSelectedPayment(null);

      await fetchPayments();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const currentPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Contribution Payments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage member payment submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-green-600"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={fetchPayments}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Contribution</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-green-700" />
                    <p className="mt-2 text-gray-500">Loading payments...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {getMemberName(payment.member)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        ID: {payment.member_id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {payment.contribution
                        ? `${payment.contribution.month}/${payment.contribution.year}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {payment.payment_method?.name || "—"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(payment.payment_date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyle(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openDetails(payment.id)}
                          title="View details"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Eye size={16} />
                        </button>

                        {payment.status === "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleApprove(payment.id)}
                              title="Approve"
                              className="rounded-lg border border-green-200 p-2 text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectPaymentId(payment.id);
                                setRejectReason("");
                              }}
                              title="Reject"
                              className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing {pagination.from || 0} to {pagination.to || 0} of{" "}
              {pagination.total || 0} payments
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {lastPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Reject Payment
              </h3>

              <button
                type="button"
                onClick={() => setRejectPaymentId(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Please provide a reason for rejecting this payment.
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              maxLength={1000}
              className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-red-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectPaymentId(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReject}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {(detailsLoading || selectedPayment) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h3>

              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto animate-spin text-green-700" />
                <p className="mt-2 text-sm text-gray-500">
                  Loading payment details...
                </p>
              </div>
            ) : (
              selectedPayment && (
                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Payment ID</p>
                      <p className="font-semibold text-gray-900">
                        #{selectedPayment.id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(selectedPayment.status)}`}
                    >
                      {selectedPayment.status}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Member"
                      value={getMemberName(selectedPayment.member)}
                    />
                    <DetailItem
                      label="Member ID"
                      value={selectedPayment.member_id}
                    />
                    <DetailItem
                      label="Amount"
                      value={formatAmount(selectedPayment.amount)}
                    />
                    <DetailItem
                      label="Payment Method"
                      value={selectedPayment.payment_method?.name}
                    />
                    <DetailItem
                      label="Payment Date"
                      value={formatDate(selectedPayment.payment_date)}
                    />
                    <DetailItem
                      label="Phone Number"
                      value={selectedPayment.phone_number}
                    />
                    <DetailItem
                      label="Transaction ID"
                      value={selectedPayment.transaction_id}
                    />
                    <DetailItem
                      label="Verified At"
                      value={formatDate(selectedPayment.verified_at)}
                    />
                    <DetailItem
                      label="Verified By"
                      value={selectedPayment.verifier?.name}
                    />
                    <DetailItem
                      label="Contribution"
                      value={
                        selectedPayment.contribution
                          ? `${selectedPayment.contribution.month}/${selectedPayment.contribution.year}`
                          : "—"
                      }
                    />
                  </div>

                  {selectedPayment.notes && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-500">
                        Notes
                      </p>
                      <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        {selectedPayment.notes}
                      </p>
                    </div>
                  )}

                  {selectedPayment.receipt_path && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Payment Receipt
                      </p>

                      <a
                        href={getStorageUrl(selectedPayment.receipt_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-green-700 hover:bg-green-50"
                      >
                        <ReceiptText size={16} />
                        View Receipt
                      </a>
                    </div>
                  )}

                  {selectedPayment.logs?.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Payment Activity
                      </h4>

                      <div className="space-y-3">
                        {selectedPayment.logs.map((log) => (
                          <div
                            key={log.id}
                            className="rounded-lg border border-gray-100 p-3"
                          >
                            <p className="text-sm font-medium capitalize text-gray-800">
                              {log.old_status || "Created"} → {log.new_status}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {log.changed_by
                                ? `Admin #${log.changed_by}`
                                : "System"}{" "}
                              · {formatDate(log.created_at)}
                            </p>

                            {log.note && (
                              <p className="mt-2 text-sm text-gray-600">
                                {log.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPayment.status === "pending" && (
                    <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => {
                          setRejectPaymentId(selectedPayment.id);
                          setRejectReason("");
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleApprove(selectedPayment.id)}
                        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
                      >
                        Approve Payment
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}
