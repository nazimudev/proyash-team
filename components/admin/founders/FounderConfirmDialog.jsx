"use client";

import { useState } from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import ModalShell, { btnPrimary, btnSecondary, btnDanger } from "./ModalShell";

const COPY = {
  delete: { title: "Delete this founder profile?", action: "Delete Profile", busy: "Deleting…", cls: btnDanger },
  publish: { title: "Publish this profile?", action: "Publish", busy: "Publishing…", cls: btnPrimary },
  unpublish: { title: "Unpublish this profile?", action: "Unpublish", busy: "Unpublishing…", cls: btnPrimary },
};

function Body({ type, founder, busy, error, onCancel, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  const c = COPY[type];
  const needsCheck = type === "publish";
  const name = founder.full_name_en || "this founder";
  return (
    <ModalShell open onClose={onCancel} busy={busy} title={c.title} description={founder.full_name_en || undefined}
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={busy} className={btnSecondary}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy || (needsCheck && !confirmed)} className={c.cls}>{busy ? c.busy : c.action}</button>
        </>
      }>
      <div className="space-y-4 text-sm text-gray-700">
        {type === "delete" ? (
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Deleting {name}&rsquo;s profile removes it from the website once the change is saved. Only continue if you are sure.</p>
          </div>
        ) : null}
        {type === "publish" ? (
          <>
            <p>Publishing makes this profile eligible to appear on the public website.</p>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-green-600" />
              <span>I confirm that the founder supplied or approved this content.</span>
            </label>
          </>
        ) : null}
        {type === "unpublish" ? <p>The profile goes back to Draft and will no longer appear on the public website once the change is saved. Its content is kept.</p> : null}
        {error ? <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</p> : null}
      </div>
    </ModalShell>
  );
}

export default function FounderConfirmDialog({ type, founder, ...rest }) {
  if (!type || !founder) return null;
  return <Body key={`${type}-${founder.id}`} type={type} founder={founder} {...rest} />;
}
