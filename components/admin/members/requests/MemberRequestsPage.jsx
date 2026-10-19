/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  RotateCcw,
  ClipboardCheck,
  SearchX,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import RequestsTable from "./RequestsTable";
import ApplicationDetailDialog from "./ApplicationDetailDialog";
import DecisionDialog from "./DecisionDialog";
import { btnSecondary, inputCls } from "./ModalShell";
import {
  STATUS_FILTERS,
  EMPTY_REQUEST_FILTERS,
  PAGE_SIZE,
  filterRequests,
  calculateRequestSummary,
} from "@/lib/memberRequestUtils";
import {
  fetchMemberApplications,
  approveApplication,
  rejectApplication,
} from "@/services/memberRequestService";

export default function MemberRequestsPage() {
  const [applications, setApplications] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [filters, setFilters] = useState(EMPTY_REQUEST_FILTERS);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null); // { id, mode: "view" | "review" }
  const [decision, setDecision] = useState(null); // { type: "approve" | "reject", id }
  const [busy, setBusy] = useState(false);
  const [decisionError, setDecisionError] = useState(null);
  const [reasonError, setReasonError] = useState(null);
  const [toast, setToast] = useState(null);
  const inFlight = useRef(false); // blocks double submits before state updates

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      setApplications(await fetchMemberApplications());
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const byId = useMemo(
    () => Object.fromEntries(applications.map((a) => [a.id, a])),
    [applications],
  );
  const summary = useMemo(
    () => calculateRequestSummary(applications),
    [applications],
  );
  const filtered = useMemo(
    () => filterRequests(applications, filters),
    [applications, filters],
  );
  const hasFilters =
    JSON.stringify(filters) !== JSON.stringify(EMPTY_REQUEST_FILTERS);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const setFilter = (k) => (e) => {
    setFilters((f) => ({ ...f, [k]: e.target.value }));
    setPage(1);
  };
  const clear = () => {
    setFilters(EMPTY_REQUEST_FILTERS);
    setPage(1);
  };

  const openDecision = (type, app) => {
    setDecisionError(null);
    setReasonError(null);
    setDecision({ type, id: app.id });
  };
  const closeDecision = () => {
    if (!busy) setDecision(null);
  };

  const confirmDecision = async (reason) => {
    if (inFlight.current || !decision) return;
    inFlight.current = true;
    setBusy(true);
    setDecisionError(null);
    setReasonError(null);
    const { type, id } = decision;
    try {
      // The server confirms and decides the resulting status. Nothing changes here unless these resolve.
      const result =
        type === "approve"
          ? await approveApplication(id)
          : await rejectApplication(id, reason);
      setApplications((l) =>
        l.map((a) =>
          a.id === id
            ? {
                ...a,
                ...(result?.application ?? {}),
                status:
                  result?.application?.status ??
                  (type === "approve" ? "approved" : "rejected"),
              }
            : a,
        ),
      );
      setToast({
        tone: "success",
        text:
          type === "approve"
            ? "Application approved. It is now awaiting the membership fee."
            : "Application rejected.",
      });
      setDecision(null);
      setDetail(null);
    } catch (err) {
      if (err?.name === "BackendNotConnectedError")
        setDecisionError(
          "Not saved. The review API isn't connected yet, so this application's status was not changed.",
        );
      else if (err?.fieldErrors?.rejection_reason) {
        setReasonError(err.fieldErrors.rejection_reason);
        setDecisionError("The server rejected the reason. Please correct it.");
      } else
        setDecisionError(
          "Something went wrong and the decision was not saved. Please try again.",
        );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  const detailApp = detail ? (byId[detail.id] ?? null) : null;
  const decisionApp = decision ? (byId[decision.id] ?? null) : null;
  const noApplications = applications.length === 0;
  const queueEmpty =
    !noApplications &&
    filtered.length === 0 &&
    !filters.search.trim() &&
    filters.status === "pending";

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard <span aria-hidden="true">/</span> Members{" "}
        <span aria-hidden="true">/</span>{" "}
        <span className="text-gray-900">Member Requests</span>
      </nav>
      <PageHeader
        title="Member Requests"
        description="Review and verify membership applications submitted through the website."
      />

      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Sample data only. These are fictional applicants and the counts below
        are sample counts. Approve and reject are not connected to a backend
        yet, so they can&rsquo;t save a decision.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending Requests"
          icon={Clock}
          value={summary.pending}
          note="Awaiting review"
        />
        <StatCard
          label="Approved Applications"
          icon={BadgeCheck}
          value={summary.approved}
          note="Awaiting membership fee"
        />
        <StatCard
          label="Rejected Applications"
          icon={XCircle}
          value={summary.rejected}
        />
      </div>

      <section
        className="rounded-xl border border-gray-200 bg-white"
        aria-label="Membership applications"
      >
        <div className="grid gap-3 border-b border-gray-100 p-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search applications"
              value={filters.search}
              onChange={setFilter("search")}
              placeholder="Search by name, mobile, email, or application ID"
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            aria-label="Status"
            value={filters.status}
            onChange={setFilter("status")}
            className={`${inputCls} md:w-52`}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort by submitted date"
            value={filters.sort}
            onChange={setFilter("sort")}
            className={`${inputCls} md:w-44`}
          >
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
          </select>
          <button
            type="button"
            onClick={clear}
            disabled={!hasFilters}
            className={btnSecondary}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters
          </button>
        </div>

        {loadState === "loading" ? (
          <div
            className="space-y-3 p-4"
            role="status"
            aria-label="Loading applications"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : loadState === "error" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
            <p className="text-sm text-gray-700">
              We couldn&rsquo;t load the applications.
            </p>
            <button type="button" onClick={load} className={btnSecondary}>
              Try again
            </button>
          </div>
        ) : noApplications || filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              {queueEmpty || noApplications ? (
                <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
              ) : (
                <SearchX className="h-6 w-6" aria-hidden="true" />
              )}
            </span>
            <h2 className="mt-4 text-base font-medium text-gray-900">
              {noApplications
                ? "No applications yet"
                : queueEmpty
                  ? "No pending requests"
                  : "No applications found"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {noApplications
                ? "Applications submitted through the website will appear here."
                : queueEmpty
                  ? "Nothing is waiting for review right now."
                  : "No applications match the current filters."}
            </p>
            {!noApplications && hasFilters ? (
              <button
                type="button"
                onClick={clear}
                className={`${btnSecondary} mt-4`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear
                Filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <RequestsTable
              applications={rows}
              onView={(a) => setDetail({ id: a.id, mode: "view" })}
              onReview={(a) => setDetail({ id: a.id, mode: "review" })}
            />
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {start + 1}–{start + rows.length} of {filtered.length}{" "}
                application{filtered.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-3">
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />{" "}
                  Previous
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <ApplicationDetailDialog
        application={detailApp}
        mode={detail?.mode}
        onClose={() => setDetail(null)}
        onSwitchToReview={() =>
          setDetail((d) => (d ? { ...d, mode: "review" } : d))
        }
        onDecide={openDecision}
      />
      <DecisionDialog
        decision={decision?.type}
        application={decisionApp}
        busy={busy}
        error={decisionError}
        serverReasonError={reasonError}
        onCancel={closeDecision}
        onConfirm={confirmDecision}
      />

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-60"
      >
        {toast ? (
          <div className="pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-lg">
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-green-600"
              aria-hidden="true"
            />
            {toast.text}
          </div>
        ) : null}
      </div>
    </div>
  );
}
