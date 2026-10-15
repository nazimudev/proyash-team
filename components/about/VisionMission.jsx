/* eslint-disable react-hooks/static-components */
import DraftBadge from "./DraftBadge";
import { getIcon } from "./iconMap";

export default function VisionMission({ vision, mission, draftLabel }) {
  const VisionIcon = getIcon(vision.icon);
  const MissionIcon = getIcon(mission.icon);

  return (
    <section
      aria-label="ভিশন ও মিশন"
      className="bg-neutral-50 py-16 sm:py-24 dark:bg-neutral-900"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Vision — light */}
        <article
          aria-labelledby="vision-heading"
          className="rounded-3xl bg-white p-8 ring-1 ring-emerald-900/15 sm:p-10 dark:bg-neutral-950 dark:ring-emerald-100/15"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950">
              <VisionIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            {vision.isDraft && <DraftBadge>{draftLabel}</DraftBadge>}
          </div>
          <h2
            id="vision-heading"
            className="mt-6 text-3xl font-bold leading-snug text-emerald-950 dark:text-emerald-50"
          >
            {vision.label}
          </h2>
          <p
            className="mt-1 font-medium text-emerald-700 dark:text-amber-300"
            lang="en"
          >
            {vision.labelEn}
          </p>
          <p className="mt-6 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
            {vision.text}
          </p>
        </article>

        {/* Mission — dark */}
        <article
          aria-labelledby="mission-heading"
          className="rounded-3xl bg-emerald-900 p-8 text-white sm:p-10 dark:bg-emerald-950 dark:ring-1 dark:ring-emerald-300/20"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-amber-300">
              <MissionIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            {mission.isDraft && (
              <DraftBadge tone="dark">{draftLabel}</DraftBadge>
            )}
          </div>
          <h2
            id="mission-heading"
            className="mt-6 text-3xl font-bold leading-snug"
          >
            {mission.label}
          </h2>
          <p className="mt-1 font-medium text-amber-300" lang="en">
            {mission.labelEn}
          </p>
          <p className="mt-6 text-lg leading-8 text-emerald-50">
            {mission.text}
          </p>
        </article>
      </div>
    </section>
  );
}
