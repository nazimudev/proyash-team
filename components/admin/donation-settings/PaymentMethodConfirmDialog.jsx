"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { checkPaymentMethodUsage } from "@/services/paymentMethodService";
import Modal, { btnPrimary, btnSecondary, btnDanger } from "../donation/Modal";

function Body({ action, method, busy, onCancel, onConfirm }) {
  const isDelete = action === "delete";
  const [usage, setUsage] = useState(isDelete ? undefined : null); // undefined = still checking

  useEffect(() => {
    if (!isDelete) return;
    let live = true;
    checkPaymentMethodUsage(method.id).then((u) => live && setUsage(u)).catch(() => live && setUsage({ checked: false, hasDonations: null }));
    return () => { live = false; };
  }, [isDelete, method.id]);

  const blocked = isDelete && usage?.checked && usage.hasDonations;

  return (
    <Modal open onClose={onCancel} busy={busy} title={isDelete ? `Delete ${method.name}?` : `Deactivate ${method.name}?`}
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={busy} className={btnSecondary}>Cancel</button>
          {blocked ? null : (
            <button type="button" onClick={onConfirm} disabled={busy || usage === undefined} className={isDelete ? btnDanger : btnPrimary}>
              {busy ? "Working…" : isDelete ? "Delete" : "Deactivate"}
            </button>
          )}
        </>
      }>
      {isDelete ? (
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Deleting this configuration may affect future donations. Donors will no longer be able to choose it.</p>
          </div>
          {usage === undefined ? <p className="text-gray-500">Checking usage…</p>
            : blocked ? <p className="font-medium text-red-700">This method has donation records, so it can't be deleted. Deactivate it instead.</p>
            : <p>This prototype can't see whether donation records use this method. The backend must block deletion when they do. If you're unsure, deactivate it instead.</p>}
        </div>
      ) : (
        <p className="text-sm text-gray-700">
          Donors will no longer see this method once the backend is connected. Its configuration and past donation records are kept, and you can activate it again later.
        </p>
      )}
    </Modal>
  );
}

export default function PaymentMethodConfirmDialog({ action, method, ...rest }) {
  if (!action || !method) return null;
  return <Body key={`${action}-${method.id}`} action={action} method={method} {...rest} />;
}
