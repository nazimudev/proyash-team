import { validUrl } from "@/lib/url";
import {
  impactStatistics,
  impactFocusAreas,
  impactTimeline,
  impactStories,
  impactGallery,
  reportingInformation,
  futurePriorities,
} from "@/data/impact";

/* ---------- small helpers ---------- */
const hasText = (v) => typeof v === "string" && v.trim().length > 0;
const approved = (r) => r?.isVerified === true && r?.isPublished === true;

/** Allows https/http URLs and internal paths; everything else (javascript:, etc.) is dropped. */
export function safeLink(url) {
  if (!hasText(url)) return null;
  const u = url.trim();
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  return validUrl(u);
}

export function formatNumber(n) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

export function formatDate(iso) {
  if (!hasText(iso)) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/* ---------- publication rules ---------- */

/** A statistic is public only if verified, approved, sourced, and holds a real number (0 needs explicit confirmation). */
export function isPublishableStatistic(s) {
  return (
    approved(s) &&
    s.verificationStatus === "verified" &&
    typeof s.value === "number" &&
    Number.isFinite(s.value) &&
    s.value >= 0 &&
    (s.value > 0 || s.zeroConfirmed === true) &&
    hasText(s.sourceLabel)
  );
}

export const getPublishedStatistics = (list) =>
  list.filter(isPublishableStatistic);

export function getPublishedTimeline(list) {
  return list
    .filter(
      (t) =>
        approved(t) &&
        hasText(t.title) &&
        hasText(t.description) &&
        (hasText(t.date) || hasText(t.period)),
    )
    .filter((t) => !t.image || t.consentConfirmed === true)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export const getPublishedStories = (list) =>
  list.filter(
    (s) =>
      approved(s) &&
      hasText(s.title) &&
      hasText(s.summary) &&
      s.consentConfirmed === true,
  );

export const getPublishedGallery = (list) =>
  list.filter(
    (g) =>
      approved(g) &&
      hasText(g.src) &&
      hasText(g.alt) &&
      g.consentConfirmed === true,
  );

/** Progress only when the target is approved and both numbers are valid. Otherwise null. */
export function getTargetProgress(t) {
  if (t?.approvalStatus !== "approved") return null;
  if (!Number.isFinite(t.value) || t.value <= 0) return null;
  if (!Number.isFinite(t.currentVerifiedValue) || t.currentVerifiedValue < 0)
    return null;
  return {
    percent: Math.min(
      100,
      Math.round((t.currentVerifiedValue / t.value) * 100),
    ),
    current: t.currentVerifiedValue,
    target: t.value,
  };
}

/** Reporting info with empty fields removed; `hasAny` false means show the empty note. */
export function getReportingInfo(info) {
  const reports = (info.reports ?? [])
    .map((r) => ({ ...r, url: safeLink(r.url) }))
    .filter((r) => hasText(r.label) && r.url);
  const rows = [
    ["Reporting Period", info.reportingPeriod],
    ["Last Updated", formatDate(info.lastUpdated)],
    ["Source of Information", info.sourceOfInformation],
    ["Verification Notes", info.verificationNotes],
  ].filter(([, v]) => hasText(v));
  return { rows, reports, hasAny: rows.length > 0 || reports.length > 0 };
}

/**
 * Single access point for the page. To move to Laravel later, make this async,
 * fetch the same shapes from the API, and keep the rest of the page unchanged.
 */
export function getImpactData() {
  const statistics = getPublishedStatistics(impactStatistics);
  const publishedIds = new Set(statistics.map((s) => s.id));
  const timeline = getPublishedTimeline(impactTimeline);
  const gallery = getPublishedGallery(impactGallery);
  return {
    statistics,
    pendingStatistics: impactStatistics.filter((s) => !publishedIds.has(s.id)),
    focusAreas: impactFocusAreas.map((area) => ({
      ...area,
      statistics: statistics.filter((s) => s.focusAreaId === area.id),
      activities: timeline.filter((t) => t.focusAreaId === area.id).slice(0, 3),
      image: gallery.find((g) => g.focusAreaId === area.id) ?? null,
    })),
    timeline,
    stories: getPublishedStories(impactStories),
    gallery,
    reporting: getReportingInfo(reportingInformation),
    priorities: futurePriorities.map((p) => ({
      ...p,
      targets: (p.targets ?? [])
        .map((t) => ({ ...t, progress: getTargetProgress(t) }))
        .filter(
          (t) => t.approvalStatus === "approved" && hasText(t.description),
        ),
    })),
  };
}
