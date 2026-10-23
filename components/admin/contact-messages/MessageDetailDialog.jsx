"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, Copy, Check, MailOpen, CheckCheck, Archive, ArchiveRestore, Trash2, AlertCircle } from "lucide-react";
import ModalShell, { btnPrimary, btnSecondary, btnDanger } from "./ModalShell";
import { StatusBadge } from "./MessagesTable";
import { formatDateTime, telHref, mailtoHref } from "@/lib/contactMessageUtils";

const small = "inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600";

function CopyButton({ value, label }) {
  const [state, setState] = useState("idle"); // idle | copied | failed
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setState("copied"); } catch { setState("failed"); }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button type="button" onClick={copy} className={small}>
      {state === "copied" ? <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}

function Skeleton() {
  return <div role="status" aria-label="Loading message" className="space-y-3">{[60, 40, 100, 100, 70].map((w, i) => <div key={i} className="h-4 animate-pulse rounded bg-gray-100" style={{ width: `${w}%` }} />)}</div>;
}

export default function MessageDetailDialog({ message, detail, detailState, onRetry, busy, notice, onStatus, onDelete, onClose }) {
  const m = message ? { ...message, ...(detail ?? {}), status: message.status } : null; // status always comes from the list state
  const tel = m ? telHref(m.phone) : null;
  const mail = m ? mailtoHref(m.email, m.subject) : null;
  const status = m?.status;

  const footer = m && detailState === "ready" ? (
    <>
      <button type="button" onClick={onClose} disabled={!!busy} className={btnSecondary}>Close</button>
      {status === "new" ? <button type="button" onClick={() => onStatus("read")} disabled={!!busy} className={btnSecondary}><MailOpen className="h-4 w-4" aria-hidden="true" />{busy === "read" ? "Saving…" : "Mark as Read"}</button> : null}
      {status === "new" || status === "read" ? <button type="button" onClick={() => onStatus("replied")} disabled={!!busy} className={btnPrimary}><CheckCheck className="h-4 w-4" aria-hidden="true" />{busy === "replied" ? "Saving…" : "Mark as Replied"}</button> : null}
      {status === "archived"
        ? <button type="button" onClick={() => onStatus("restore")} disabled={!!busy} className={btnSecondary}><ArchiveRestore className="h-4 w-4" aria-hidden="true" />{busy === "restore" ? "Restoring…" : "Restore"}</button>
        : <button type="button" onClick={() => onStatus("archived")} disabled={!!busy} className={btnSecondary}><Archive className="h-4 w-4" aria-hidden="true" />{busy === "archived" ? "Archiving…" : "Archive Message"}</button>}
      <button type="button" onClick={onDelete} disabled={!!busy} className={btnDanger}><Trash2 className="h-4 w-4" aria-hidden="true" />Delete Message</button>
    </>
  ) : m ? <button type="button" onClick={onClose} className={btnSecondary}>Close</button> : null;

  return (
    <ModalShell open={!!message} onClose={onClose} busy={!!busy} size="xl" title={m?.subject ?? ""} description={m ? `From ${m.name}` : ""} footer={footer}>
      {m ? (
        detailState === "loading" ? <Skeleton /> :
        detailState === "error" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-700">We couldn&rsquo;t load this message.</p>
            <button type="button" onClick={onRetry} className={btnSecondary}>Retry</button>
          </div>
        ) : (
          <div className="space-y-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-gray-500">Sender name</dt><dd className="mt-0.5 break-words text-sm text-gray-900">{m.name}</dd></div>
              <div><dt className="text-xs text-gray-500">Current status</dt><dd className="mt-0.5"><StatusBadge status={m.status} /></dd></div>
              <div>
                <dt className="text-xs text-gray-500">Phone number</dt>
                <dd className="mt-0.5 break-words text-sm text-gray-900">{m.phone ?? <span className="text-gray-400">Not provided</span>}</dd>
                {m.phone ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tel ? <a href={tel} className={small}><Phone className="h-3.5 w-3.5" aria-hidden="true" />Call Sender</a> : null}
                    <CopyButton value={m.phone} label="Copy Phone" />
                  </div>
                ) : null}
              </div>
              <div>
                <dt className="text-xs text-gray-500">Email address</dt>
                <dd className="mt-0.5 break-all text-sm text-gray-900">{m.email ?? <span className="text-gray-400">Not provided</span>}</dd>
                {m.email ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mail ? <a href={mail} className={small}><Mail className="h-3.5 w-3.5" aria-hidden="true" />Email Sender</a> : null}
                    <CopyButton value={m.email} label="Copy Email" />
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-2"><dt className="text-xs text-gray-500">Received</dt><dd className="mt-0.5 text-sm text-gray-900">{formatDateTime(m.created_at)}</dd></div>
            </dl>

            <section>
              <h3 className="mb-1 text-xs text-gray-500">Message</h3>
              {/* Rendered as plain text (React escapes it) with line breaks preserved. Never inject it as HTML. */}
              <div className="max-h-[40vh] overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">{m.message}</div>
            </section>

            {notice ? <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{notice}</p> : null}
          </div>
        )
      ) : null}
    </ModalShell>
  );
}
