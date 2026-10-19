import { ImagePlus, SearchX, AlertCircle, RotateCcw, Plus } from "lucide-react";
import { btnPrimary, btnSecondary } from "./ModalShell";

export default function GalleryEmptyState({ variant, onAdd, onClear, onRetry }) {
  const cfg = {
    empty: { Icon: ImagePlus, title: "No photos yet", text: "Add photos of Proyash activities, such as community programs, tree planting, and education support.", tone: "bg-gray-100 text-gray-400" },
    noResults: { Icon: SearchX, title: "No photos found", text: "No photos match the current search or filters.", tone: "bg-gray-100 text-gray-400" },
    error: { Icon: AlertCircle, title: "We couldn't load the gallery", text: "Something went wrong while loading the photos. Please try again.", tone: "bg-red-50 text-red-500" },
  }[variant];
  const { Icon } = cfg;
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${cfg.tone}`}><Icon className="h-6 w-6" aria-hidden="true" /></span>
      <h2 className="mt-4 text-base font-medium text-gray-900">{cfg.title}</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{cfg.text}</p>
      <div className="mt-4">
        {variant === "empty" ? <button type="button" onClick={onAdd} className={btnPrimary}><Plus className="h-4 w-4" aria-hidden="true" /> Add New Photo</button> : null}
        {variant === "noResults" ? <button type="button" onClick={onClear} className={btnSecondary}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters</button> : null}
        {variant === "error" ? <button type="button" onClick={onRetry} className={btnSecondary}>Retry</button> : null}
      </div>
    </div>
  );
}
