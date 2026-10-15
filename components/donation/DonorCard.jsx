import { UserRound, CalendarDays } from "lucide-react";
import { formatMoney } from "@/lib/donationCalculations";

/** Renders only whitelisted public fields. Name/amount/purpose appear only if the donor allowed it. */
export default function DonorCard({ donor }) {
  const initials = donor.isNamed ? donor.displayName.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") : null;
  return (
    <li className="flex h-full flex-col rounded-2xl border border-forest/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist font-extrabold text-forest">
          {initials || <UserRound size={20} />}
        </span>
        <div className="min-w-0">
          <p className="truncate font-extrabold text-ink">{donor.displayName}</p>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <CalendarDays size={12} aria-hidden="true" />
            <time dateTime={donor.date}>{donor.dateLabel}</time>
          </p>
        </div>
      </div>
      {(donor.amountMinor !== null || donor.purposeLabel || donor.methodLabel) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {donor.amountMinor !== null && <span className="rounded-full bg-forest px-3 py-1 text-sm font-bold text-white">{formatMoney(donor.amountMinor)}</span>}
          {donor.purposeLabel && <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">{donor.purposeLabel}</span>}
          {donor.methodLabel && <span className="rounded-full border border-forest/15 px-3 py-1 text-xs font-semibold text-muted">{donor.methodLabel}</span>}
        </div>
      )}
    </li>
  );
}
