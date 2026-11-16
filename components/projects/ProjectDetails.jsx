import {
  MapPin,
  CalendarDays,
  Wallet,
  FolderOpen,
  Image as ImageIcon,
  Target,
  TreePine,
} from "lucide-react";

import Photo from "@/components/ui/Photo";
import StatusBadge from "@/components/projects/StatusBadge";

const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://127.0.0.1:8000/storage";

function getImageUrl(path) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${STORAGE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function formatDate(date) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatMoney(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "Not specified";
  }

  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-forest">
        <Icon size={19} />
        <h2 className="text-xl font-extrabold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}

export default function ProjectDetails({ project: p }) {
  if (!p) return null;

  const images = Array.isArray(p.images) ? p.images : [];

  const gallery = images
    .filter((image) => image.image_path)
    .sort((a, b) => a.sort_order - b.sort_order);

  const startDate = formatDate(p.start_date);
  const endDate = formatDate(p.expected_end_date);

  const statusLabels = {
    planned: "Planned",
    in_progress: "In Progress",
    complete: "Completed",
    on_hold: "On Hold",
    cancelled: "Cancelled",
  };

  const progress = Math.min(100, Math.max(0, Number(p.progress) || 0));

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Project Hero Image */}
        <div className="overflow-hidden rounded-3xl border border-forest/10 bg-mist">
          <Photo
            src={getImageUrl(p.cover_image)}
            alt={p.name || "Project cover"}
            sizes="100vw"
            className="aspect-16/7 w-full"
            fallback={
              <TreePine
                size={48}
                strokeWidth={1.2}
                className="text-forest/40"
              />
            }
          />
        </div>

        {/* Project Header */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              {p.category?.name && (
                <span className="rounded-full bg-mist px-4 py-1.5 text-xs font-bold text-forest">
                  {p.category.name}
                </span>
              )}

              <StatusBadge
                status={p.status}
                label={statusLabels[p.status] || p.status}
              />
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {p.name}
            </h1>

            {p.location && (
              <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                <MapPin size={17} className="text-forest" />
                {p.location}
              </div>
            )}

            {/* Project Progress */}
            <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-ink">Project Progress</span>
                <span className="text-lg font-extrabold text-forest">
                  {progress}%
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-forest transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Project Information Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-ink">
                Project Information
              </h2>

              <div className="mt-6 space-y-6">
                <InfoItem
                  icon={CalendarDays}
                  label="Start Date"
                  value={startDate || "Not specified"}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Expected Completion"
                  value={endDate || "Not specified"}
                />

                <InfoItem
                  icon={FolderOpen}
                  label="Category"
                  value={p.category?.name || "Not specified"}
                />

                <InfoItem
                  icon={Wallet}
                  label="Allocated Budget"
                  value={formatMoney(p.allocated_budget)}
                />

                {p.funding_source && (
                  <InfoItem
                    icon={Target}
                    label="Funding Source"
                    value={p.funding_source}
                  />
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Project Overview */}
        {p.description && (
          <div className="mt-16 max-w-4xl">
            <SectionHeading
              icon={FolderOpen}
              title="Project Overview"
              description="Learn more about this community initiative."
            />

            <div className="whitespace-pre-line text-base leading-8 text-muted sm:text-lg">
              {p.description}
            </div>
          </div>
        )}

        {/* Project Gallery */}
        {gallery.length > 0 && (
          <div className="mt-16">
            <SectionHeading
              icon={ImageIcon}
              title="Project Gallery"
              description="Moments and memories from this project."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image) => (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-2xl border border-forest/10 bg-white"
                >
                  <Photo
                    src={getImageUrl(image.image_path)}
                    alt={image.alt_text || image.title || p.name}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-4/3 w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    fallback={
                      <ImageIcon size={32} className="text-forest/40" />
                    }
                  />

                  {image.title && (
                    <div className="p-4">
                      <p className="font-semibold text-ink">{image.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mist text-forest">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="mt-1 wrap-break-word font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}
