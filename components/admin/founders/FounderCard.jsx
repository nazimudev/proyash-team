import { Pencil, Eye, Globe, EyeOff, Trash2, UserPlus } from "lucide-react";
import FounderPhoto from "./FounderPhoto";
import { btnPrimary, btnSecondary } from "./ModalShell";

export function StatusBadge({ status }) {
  const published = status === "published";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${published ? "bg-green-50 text-green-800 ring-green-200" : "bg-amber-50 text-amber-800 ring-amber-200"}`}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

const Missing = ({ children }) => <span className="italic text-gray-400">{children}</span>;

export function FounderEmptyCard({ slot, onAdd, canAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"><UserPlus className="h-6 w-6" aria-hidden="true" /></span>
      <h3 className="mt-4 text-base font-medium text-gray-900">Founder {slot}: not added</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">Founder name not added. Add verified information supplied by the founder.</p>
      <button type="button" onClick={onAdd} disabled={!canAdd} className={`${btnPrimary} mt-4`}><UserPlus className="h-4 w-4" aria-hidden="true" /> Add Founder</button>
    </div>
  );
}

export default function FounderCard({ founder: f, onEdit, onPreview, onToggle, onDelete }) {
  const published = f.status === "published";
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white" aria-label={f.full_name_en || "Founder profile"}>
      <div className="flex gap-4 p-5">
        <FounderPhoto founder={f} className="h-24 w-24 shrink-0 rounded-xl border border-gray-200" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={f.status} />
            {f.isDemo ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Demo (fictional)</span> : null}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">{f.full_name_en || <Missing>Founder name not added</Missing>}</h3>
          {f.full_name_bn ? <p lang="bn" className="text-sm text-gray-600">{f.full_name_bn}</p> : null}
          <p className="mt-0.5 text-sm text-green-700">{f.designation || <Missing>Designation not added</Missing>}</p>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-100 px-5 py-4 text-sm">
        <div>
          <h4 className="text-xs font-medium text-gray-500">Biography</h4>
          <p className="mt-1 line-clamp-4 text-gray-700">{f.biography || <Missing>Verified biography not added</Missing>}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-500">{f.message_heading || "Founder’s message"}</h4>
          <p className="mt-1 line-clamp-3 text-gray-700">{f.message || <Missing>Founder&rsquo;s message not added</Missing>}</p>
        </div>
        <p className="text-xs text-gray-500">Display order: {f.display_order}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
        <button type="button" onClick={() => onEdit(f)} className={`${btnPrimary} px-3 py-1.5`}><Pencil className="h-4 w-4" aria-hidden="true" />Edit Profile</button>
        <button type="button" onClick={() => onPreview(f)} className={`${btnSecondary} px-3 py-1.5`}><Eye className="h-4 w-4" aria-hidden="true" />Preview Profile</button>
        <button type="button" onClick={() => onToggle(f)} className={`${btnSecondary} px-3 py-1.5`}>
          {published ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Globe className="h-4 w-4" aria-hidden="true" />}{published ? "Unpublish" : "Publish"}
        </button>
        <button type="button" onClick={() => onDelete(f)} aria-label={`Delete ${f.full_name_en || "founder profile"}`} title="Delete"
          className="ml-auto rounded-lg border border-gray-300 bg-white p-2 text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </article>
  );
}
