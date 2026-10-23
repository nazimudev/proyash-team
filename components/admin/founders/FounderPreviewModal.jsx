"use client";

import { GraduationCap, Briefcase, HeartHandshake, Quote, Info } from "lucide-react";
import ModalShell, { btnSecondary } from "./ModalShell";
import FounderPhoto from "./FounderPhoto";

function InfoBlock({ icon: Icon, title, text }) {
  if (!text) return null; // empty sections are never shown
  return (
    <section className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700"><Icon className="h-4 w-4" aria-hidden="true" /></span>
      <div><h4 className="text-sm font-semibold text-gray-900">{title}</h4><p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-gray-700">{text}</p></div>
    </section>
  );
}

// Approximates how the profile could look on the public site. The real public section may differ.
export default function FounderPreviewModal({ founder: f, onClose }) {
  return (
    <ModalShell open={!!f} onClose={onClose} size="xl" title="Profile Preview" description="Approximate public appearance"
      footer={<button type="button" onClick={onClose} className={btnSecondary}>Close</button>}>
      {f ? (
        <div className="space-y-5">
          {f.status !== "published" ? (
            <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />This profile is a draft. It would not appear on the public website.</p>
          ) : null}
          {f.isDemo ? <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">Fictional demo content. It is not a real founder and not verified information.</p> : null}

          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <FounderPhoto founder={f} className="h-36 w-36 shrink-0 rounded-2xl border border-gray-200" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{f.full_name_en}</h3>
              {f.full_name_bn ? <p lang="bn" className="text-base text-gray-600">{f.full_name_bn}</p> : null}
              <p className="mt-1 inline-block rounded-full bg-green-50 px-3 py-0.5 text-sm font-medium text-green-800">{f.designation}</p>
              {f.biography ? <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">{f.biography}</p> : null}
            </div>
          </div>

          <div className="space-y-4">
            <InfoBlock icon={GraduationCap} title="Education" text={f.education} />
            <InfoBlock icon={Briefcase} title="Professional experience" text={f.professional_experience} />
            <InfoBlock icon={HeartHandshake} title="Community involvement" text={f.community_involvement} />
          </div>

          {f.message ? (
            <blockquote className="rounded-xl border border-green-200 bg-green-50/60 p-5">
              <Quote className="h-5 w-5 text-green-600" aria-hidden="true" />
              <h4 className="mt-2 text-base font-semibold text-green-900">{f.message_heading}</h4>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-800">{f.message}</p>
              <footer className="mt-3 text-sm font-medium text-green-800">{f.full_name_en}</footer>
            </blockquote>
          ) : null}
        </div>
      ) : null}
    </ModalShell>
  );
}
