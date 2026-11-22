/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Upload,
  Loader2,
  Wallet,
  CalendarDays,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

import {
  getMemberPaymentMethods,
  submitMemberContribution,
} from "@/services/memberContributionService";

import { MONTHS, formatTaka } from "@/lib/member/format";
import { toast } from "sonner";

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-wide text-gray-600";

function Field({ label, required, children }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function renderPaymentText(value) {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (typeof parsed === "object" && parsed !== null) {
        return renderPaymentText(parsed);
      }

      return String(parsed);
    } catch {
      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={index} className="block">
        {renderPaymentText(item)}
      </span>
    ));
  }

  if (typeof value === "object") {
    return Object.entries(value).map(([key, item]) => (
      <span key={key} className="block">
        <span className="font-semibold">{key}: </span>
        {renderPaymentText(item)}
      </span>
    ));
  }

  return String(value);
} 

export default function SubmitContributionModal({
  open,
  records = [],
  onClose,
  onSuccess,
}) {
  const [methods, setMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [contributionId, setContributionId] = useState("");
  const [methodId, setMethodId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today());
  const [transactionId, setTransactionId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [notes, setNotes] = useState("");

  const payableRecords = useMemo(
    () => records.filter((item) => Number(item.dueAmount) > 0),
    [records],
  );

  const selectedContribution = payableRecords.find(
    (item) => String(item.id) === String(contributionId),
  );

  const selectedMethod = methods.find(
    (item) => String(item.id) === String(methodId),
  );

  // Prevent background page scrolling while the modal is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Load payment methods.
  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadMethods() {
      setLoadingMethods(true);

      try {
        const result = await getMemberPaymentMethods();

        if (active) {
          setMethods(result);
        }
      } catch (error) {
        if (active) {
          toast.error(error.message || "Could not load payment methods.");
        }
      } finally {
        if (active) setLoadingMethods(false);
      }
    }

    loadMethods();

    return () => {
      active = false;
    };
  }, [open]);

  // Reset form whenever modal opens.
  useEffect(() => {
    if (!open) return;

    setContributionId("");
    setMethodId("");
    setAmount("");
    setPaymentDate(today());
    setTransactionId("");
    setPhoneNumber("");
    setReceipt(null);
    setNotes("");
  }, [open]);

  // Auto-fill remaining contribution amount.
  useEffect(() => {
    if (selectedContribution) {
      setAmount(String(selectedContribution.dueAmount));
    } else {
      setAmount("");
    }
  }, [contributionId, selectedContribution]);

  // Close with Escape.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, submitting, onClose]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedContribution) {
      toast.error("Please select a contribution.");
      return;
    }

    if (!selectedMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      numericAmount > Number(selectedContribution.dueAmount)
    ) {
      toast.error("Enter a valid amount within the remaining balance.");
      return;
    }

    if (selectedMethod.requires_transaction_id && !transactionId.trim()) {
      toast.error("Transaction ID is required.");
      return;
    }

    if (selectedMethod.requires_phone && !phoneNumber.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (selectedMethod.requires_payment_proof && !receipt) {
      toast.error("Payment receipt is required.");
      return;
    }

    if (receipt && receipt.size > 2 * 1024 * 1024) {
      toast.error("Receipt image must be 2 MB or smaller.");
      return;
    }

    const payload = {
      payment_method_id: methodId,
      amount: numericAmount,
      payment_date: paymentDate,
      transaction_id: transactionId.trim(),
      phone_number: phoneNumber.trim(),
      receipt,
      notes: notes.trim(),
    };

    setSubmitting(true);

    try {
      const result = await submitMemberContribution(
        selectedContribution.id,
        payload,
      );

      toast.success(
        result?.message || "Payment submitted. Waiting for admin verification.",
      );

      onClose?.();
      await onSuccess?.();
    } catch (error) {
      const firstError = Object.values(error.errors ?? {})[0];

      toast.error(firstError || error.message || "Payment submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contribution-modal-title"
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl shadow-green-950/20 sm:max-h-[min(850px,calc(100dvh-2rem))] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-green-950 via-green-900 to-green-800 px-5 py-4 text-white sm:px-7 sm:py-5">
          <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 right-28 h-40 w-40 rounded-full bg-emerald-400/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner">
                <Wallet size={21} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="contribution-modal-title"
                    className="text-lg font-bold tracking-tight sm:text-xl"
                  >
                    Submit Contribution
                  </h2>
                  <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-100 sm:inline-flex">
                    MEMBER PAYMENT
                  </span>
                </div>

                <p className="mt-1 text-xs text-green-100/75 sm:text-sm">
                  Submit your monthly payment for verification.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close modal"
              className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <X size={19} />
            </button>
          </div>

          <div className="relative mt-4 flex items-center gap-2 text-[11px] text-green-100/80">
            <ShieldCheck size={14} />
            Secure payment submission · Admin verification required
          </div>
        </div>

        {/* Scrollable content: only this area scrolls */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/80 p-4 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-800">
                      <CalendarDays size={15} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Contribution details
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Select the month you want to pay.
                      </p>
                    </div>
                  </div>

                  <Field label="Monthly contribution" required>
                    <select
                      required
                      value={contributionId}
                      onChange={(event) =>
                        setContributionId(event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Choose a contribution</option>
                      {payableRecords.map((item) => (
                        <option key={item.id} value={item.id}>
                          {MONTHS[item.month - 1]} {item.year} —{" "}
                          {formatTaka(item.dueAmount)} due
                        </option>
                      ))}
                    </select>
                  </Field>

                  {payableRecords.length === 0 && (
                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      No outstanding contributions are available to submit.
                    </div>
                  )}
                </div>

                {/* Balance card */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-900 to-green-700 p-4 text-white shadow-lg shadow-green-900/10">
                  <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full border-18 border-white/5" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-green-100/80">
                        Remaining balance
                      </span>
                      <Wallet size={18} className="text-green-200" />
                    </div>

                    <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                      {selectedContribution
                        ? formatTaka(selectedContribution.dueAmount)
                        : "৳0.00"}
                    </p>

                    <p className="mt-1 text-[11px] text-green-100/70">
                      {selectedContribution
                        ? `${MONTHS[selectedContribution.month - 1]} ${selectedContribution.year}`
                        : "Select a contribution to see the balance"}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-xs">
                      <span className="text-green-100/75">Payment amount</span>
                      <span className="font-bold text-white">
                        {formatTaka(Number(amount) || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-green-800">
                      <CreditCard size={15} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Payment method
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Choose how you made the payment.
                      </p>
                    </div>
                  </div>

                  <Field label="Select payment method" required>
                    <select
                      required
                      value={methodId}
                      onChange={(event) => setMethodId(event.target.value)}
                      disabled={loadingMethods}
                      className={inputClass}
                    >
                      <option value="">
                        {loadingMethods
                          ? "Loading payment methods..."
                          : "Choose payment method"}
                      </option>

                      {methods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {selectedMethod && (
                    <div className="mt-3 rounded-xl border border-green-100 bg-green-50/70 p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-green-700"
                        />
                        <p className="text-sm font-bold text-green-900">
                          {selectedMethod.account_holder || selectedMethod.name}
                        </p>
                      </div>

                      {selectedMethod.account_number && (
                        <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                          {selectedMethod.account_number}
                        </p>
                      )}

                      {selectedMethod.description && (
                        <div className="mt-2 whitespace-pre-line text-xs leading-5 text-gray-600">
                          {renderPaymentText(selectedMethod.description)}
                        </div>
                      )}

                      {selectedMethod.steps && (
                        <p className="mt-2 whitespace-pre-line text-xs leading-5 text-gray-600">
                          {renderPaymentText(selectedMethod.steps)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-800">
                    <ReceiptText size={15} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Payment information
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Enter the details of your transaction.
                    </p>
                  </div>
                </div>

                {/* Amount and date */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Amount (BDT)" required>
                    <input
                      required
                      type="number"
                      min="0.01"
                      max={selectedContribution?.dueAmount || undefined}
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      disabled={!selectedContribution}
                      className={inputClass}
                      placeholder="Enter amount"
                    />
                  </Field>

                  <Field label="Payment date" required>
                    <input
                      required
                      type="date"
                      max={today()}
                      value={paymentDate}
                      onChange={(event) => setPaymentDate(event.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                {/* Dynamic transaction fields */}
                {selectedMethod?.requires_transaction_id && (
                  <Field label="Transaction ID" required>
                    <input
                      required
                      value={transactionId}
                      onChange={(event) => setTransactionId(event.target.value)}
                      className={inputClass}
                      placeholder="Enter transaction ID"
                    />
                  </Field>
                )}

                {selectedMethod?.requires_phone && (
                  <Field label="Payment phone number" required>
                    <div className="relative">
                      <Smartphone
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        className={`${inputClass} pl-10`}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </Field>
                )}

                {/* Receipt */}
                {selectedMethod?.requires_payment_proof && (
                  <Field label="Payment receipt" required>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-green-300 bg-green-50/50 p-3 transition hover:border-green-600 hover:bg-green-50">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-800 shadow-sm">
                        <Upload size={19} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-gray-800">
                          {receipt ? receipt.name : "Upload payment receipt"}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-gray-500">
                          JPG, PNG or WEBP · Max 2 MB
                        </span>
                      </span>

                      <span className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-800">
                        Browse
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required
                        className="hidden"
                        onChange={(event) =>
                          setReceipt(event.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  </Field>
                )}

                {/* Notes */}
                <Field label="Additional notes">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Write any additional payment information..."
                  />
                </Field>

                {/* Verification notice */}
                <div className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-amber-900">
                      Payment verification
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-amber-800">
                      Your payment will remain pending until verified by the
                      organisation. Only approved payments count as paid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed footer */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <p className="hidden items-center gap-1.5 text-[11px] text-gray-400 sm:flex">
              <ShieldCheck size={14} />
              Secure member payment
            </p>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingMethods ||
                  !selectedContribution ||
                  !selectedMethod
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-900/15 transition hover:bg-green-900 hover:shadow-green-900/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Payment
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
