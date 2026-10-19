/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Plus, Search, RotateCcw, AlertCircle, CheckCircle2, Wallet, Clock, CalendarDays, Users, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import EmptyState from "@/components/admin/ui/EmptyState";
import StatusBadge from "./StatusBadge";
import DonationActionsMenu from "./DonationActionsMenu";
import DonationDetailsDialog from "./DonationDetailsDialog";
import DonationConfirmDialog from "./DonationConfirmDialog";
import DonationFormDialog from "./DonationFormDialog";
import { btnPrimary, btnSecondary, inputCls } from "./Modal";
import { DONATION_METHODS, DONATION_STATUSES, methodLabel } from "@/lib/donationConfig";
import {
  calculateSummary, filterDonations, sortDonations, dateRangeError, EMPTY_FILTERS, formatCurrency, formatDate,
  donorLabel, donorContact, getInitials, todayIso, emptyFormValues, donationToFormValues, formValuesToDonation,
} from "@/lib/donationUtils";
import * as api from "@/services/donationService";

const PAGE_SIZES = [5, 10, 25];

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [currentMonth, setCurrentMonth] = useState(null); // "YYYY-MM", set in an effect, never during render
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialog, setDialog] = useState(null); // { type: view|add|edit|verify|reject|delete, donation?, formValues? }
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const [d, p] = await Promise.all([api.fetchDonations(), api.fetchProjects()]);
      setDonations(d);
      setProjects(p);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setCurrentMonth(todayIso().slice(0, 7)); }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const projectNames = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p.name])), [projects]);
  const summary = useMemo(() => calculateSummary(donations, currentMonth), [donations, currentMonth]);
  const rangeError = dateRangeError(filters);
  const filtered = useMemo(() => sortDonations(filterDonations(donations, filters), sort), [donations, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  const updateFilter = (key) => (e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); };
  const resetFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };
  const notify = (message, tone = "success") => setToast({ message, tone });
  const patchLocal = (id, patch) => setDonations((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const closeDialog = () => { if (!busy) setDialog(null); };

  const onRowAction = (type, donation) => {
    if (type === "edit") return setDialog({ type, donation, formValues: donationToFormValues(donation) });
    setDialog({ type, donation });
  };
  const openAdd = () => setDialog({ type: "add", formValues: emptyFormValues(todayIso()) });

  const runAction = async (fn, successMessage) => {
    setBusy(true);
    try { await fn(); notify(successMessage); setDialog(null); }
    catch { notify("Something went wrong. Please try again.", "error"); }
    finally { setBusy(false); }
  };

  const confirmAction = (reason) => {
    const { type, donation } = dialog;
    if (type === "verify") return runAction(async () => patchLocal(donation.id, await api.verifyDonation(donation.id)), `${donation.id} verified.`);
    if (type === "reject") return runAction(async () => patchLocal(donation.id, await api.rejectDonation(donation.id, reason)), `${donation.id} rejected.`);
    return runAction(async () => patchLocal(donation.id, await api.archiveDonation(donation.id)), `${donation.id} removed (prototype).`);
  };

  const saveForm = (values) =>
    runAction(async () => {
      let proofFileName = values.proofFileName;
      if (values.proofFile) proofFileName = (await api.uploadPaymentProof(values.proofFile)).fileName;
      const base = { ...formValuesToDonation(values), proofFileName };
      if (dialog.type === "edit") {
        const patch = await api.updateDonation(dialog.donation.id, base); // status and verification history are not touched
        patchLocal(dialog.donation.id, patch);
      } else {
        const verified = values.recordStatus === "verified";
        const created = await api.createDonation({
          ...base, status: values.recordStatus,
          verifiedAt: verified ? new Date().toISOString() : null, // time of recording; the admin identity is unavailable, so verifiedBy stays null
          verifiedBy: null,
        });
        setDonations((list) => [created, ...list]);
        setPage(1);
      }
    }, dialog.type === "edit" ? "Donation updated." : "Donation saved.");

  const dialogDonation = dialog?.donation;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard <span aria-hidden="true">/</span> <span className="text-gray-900">Donations</span>
      </nav>
      <PageHeader
        title="All Donations"
        description="Manage donations, review donor submissions, and track contributions supporting our community initiatives."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} disabled={loadState !== "ready" || filtered.length === 0}
              onClick={() => { api.exportDonations(filtered, projects); notify(`Exported ${filtered.length} record${filtered.length === 1 ? "" : "s"}.`); }}>
              <Download className="h-4 w-4" aria-hidden="true" /> Export Donations
            </button>
            <button type="button" className={btnSecondary} onClick={openAdd} disabled={loadState !== "ready"}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add Donation
            </button>
          </div>
        }
      />

      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Prototype: this page shows sample data and simulated actions. Nothing is saved to a server.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Donations" icon={Wallet} value={formatCurrency(summary.totalConfirmed)} note="Verified donations only" />
        <StatCard label="Pending Verification" icon={Clock} value={summary.pendingCount} note="Not included in totals" />
        <StatCard label="This Month" icon={CalendarDays} value={summary.thisMonth === null ? "—" : formatCurrency(summary.thisMonth)} note="Verified, current calendar month" />
        <StatCard label="Total Donors" icon={Users} value={summary.uniqueDonors} note="Unique named donors; anonymous not counted" />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="space-y-3 border-b border-gray-100 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative md:col-span-2 xl:col-span-4">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input type="search" aria-label="Search donations" value={filters.search} onChange={updateFilter("search")}
                placeholder="Search by donation ID, donor, phone, email, or transaction ID" className={`${inputCls} pl-9`} />
            </div>
            <select aria-label="Status" value={filters.status} onChange={updateFilter("status")} className={inputCls}>
              <option value="all">All Statuses</option>
              {DONATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select aria-label="Payment method" value={filters.method} onChange={updateFilter("method")} className={inputCls}>
              <option value="all">All Methods</option>
              {DONATION_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select aria-label="Project" value={filters.project} onChange={updateFilter("project")} className={inputCls}>
              <option value="all">All Projects</option>
              <option value="general">General Donations</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select aria-label="Sort by" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className={inputCls}>
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-gray-500">Start date
              <input type="date" value={filters.startDate} onChange={updateFilter("startDate")} className={`${inputCls} mt-1`} />
            </label>
            <label className="text-xs text-gray-500">End date
              <input type="date" value={filters.endDate} onChange={updateFilter("endDate")} className={`${inputCls} mt-1`} />
            </label>
            <button type="button" onClick={resetFilters} disabled={!hasFilters} className={btnSecondary}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset Filters
            </button>
          </div>
          {rangeError ? <p role="alert" className="text-xs text-red-700">{rangeError} The date filter is ignored until this is fixed.</p> : null}
        </div>

        {loadState === "error" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
            <p className="text-sm text-gray-700">{`We couldn't load donations.`}</p>
            <button type="button" onClick={load} className={btnSecondary}>Try again</button>
          </div>
        ) : loadState === "loading" ? (
          <div className="space-y-3 p-4" role="status" aria-label="Loading donations">
            {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={Inbox} title="No donations match these filters"
              description={hasFilters ? "Try a different search or reset the filters." : "Recorded donations will appear here."} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-245 text-left text-sm">
                <caption className="sr-only">Donations</caption>
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    {["Donation ID", "Donor", "Amount", "Donation Method", "Transaction ID", "Project / Purpose", "Donation Date", "Status", "Actions"].map((h) => (
                      <th key={h} scope="col" className={`px-4 py-3 font-medium ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((x) => (
                    <tr key={x.id} className="hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{x.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700" aria-hidden="true">
                            {x.donor.isAnonymous ? "?" : getInitials(x.donor.name)}
                          </span>
                          <div>
                            <p className="text-gray-900">{donorLabel(x.donor)}</p>
                            {donorContact(x.donor) ? <p className="text-xs text-gray-500">{donorContact(x.donor)}</p> : null}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{formatCurrency(x.amount)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{methodLabel(x.method)}</td>
                      <td className="px-4 py-3 text-gray-700">{x.transactionId ?? <span className="text-gray-400">{x.method === "cash" ? "Not applicable (cash)" : "Not provided"}</span>}</td>
                      <td className="px-4 py-3 text-gray-700">{x.projectId ? projectNames[x.projectId] ?? x.projectId : "General Donation"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatDate(x.donationDate)}</td>
                      <td className="px-4 py-3"><StatusBadge status={x.status} /></td>
                      <td className="px-4 py-3 text-right"><DonationActionsMenu donation={x} onAction={onRowAction} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {start + 1}–{start + rows.length} of {filtered.length} donation{filtered.length === 1 ? "" : "s"}</p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">Rows per page
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className={`${inputCls} w-auto py-1`}>
                    {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <span>Page {safePage} of {totalPages}</span>
                <button type="button" className={btnSecondary} onClick={() => setPage(safePage - 1)} disabled={safePage <= 1}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                </button>
                <button type="button" className={btnSecondary} onClick={() => setPage(safePage + 1)} disabled={safePage >= totalPages}>
                  Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <DonationDetailsDialog donation={dialog?.type === "view" ? dialogDonation : null}
        projectName={dialogDonation?.projectId ? projectNames[dialogDonation.projectId] : null} onClose={closeDialog} />
      <DonationConfirmDialog action={["verify", "reject", "delete"].includes(dialog?.type) ? dialog.type : null}
        donation={dialogDonation} busy={busy} onCancel={closeDialog} onConfirm={confirmAction} />
      <DonationFormDialog open={dialog?.type === "add" || dialog?.type === "edit"} mode={dialog?.type}
        initialValues={dialog?.formValues} donation={dialogDonation} projects={projects} saving={busy}
        onCancel={closeDialog} onSubmit={saveForm} />

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-60">
        {toast ? (
          <div className={`pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-white text-gray-900"}`}>
            {toast.tone === "error" ? <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />}
            {toast.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
