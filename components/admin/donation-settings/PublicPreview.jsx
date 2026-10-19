import { ReceiptText, Phone, FileCheck2 } from "lucide-react";
import { typeInfo, maskDestination } from "@/lib/paymentMethodUtils";

export default function PublicPreview({ methods }) {
  const active = methods.filter((m) => m.isActive).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  return (
    <section aria-labelledby="preview-title" className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 id="preview-title" className="text-sm font-semibold text-gray-900">Public Donation Page Preview</h2>
        <p className="text-xs text-gray-500">Active methods only, as donors would see them.</p>
      </div>
      {active.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">No active payment methods. Donors would have nothing to choose from.</p>
      ) : (
        <ul className="space-y-3 p-4">
          {active.map((m) => {
            const Icon = typeInfo(m.type).icon;
            return (
              <li key={m.id} className="rounded-lg border border-green-100 bg-green-50/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-600 text-white"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{typeInfo(m.type).label}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-green-800">{maskDestination(m)}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">{m.description}</p>
                {m.requiresTransactionId || m.requiresPhone || m.requiresPaymentProof ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5 text-xs text-gray-700">
                    {m.requiresTransactionId ? <li className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-inset ring-gray-200"><ReceiptText className="h-3 w-3" aria-hidden="true" />Transaction ID required</li> : null}
                    {m.requiresPhone ? <li className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-inset ring-gray-200"><Phone className="h-3 w-3" aria-hidden="true" />Phone required</li> : null}
                    {m.requiresPaymentProof ? <li className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-inset ring-gray-200"><FileCheck2 className="h-3 w-3" aria-hidden="true" />Payment proof required</li> : null}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
