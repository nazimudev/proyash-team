import { projectCategories, projectStatuses, projects as allProjects } from "@/data/projects";
import { safeLink } from "@/lib/impact";

const hasText = (v) => typeof v === "string" && v.trim().length > 0;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUS_IDS = new Set(["ongoing", "completed", "planned"]);
const categoryLabel = Object.fromEntries(projectCategories.map((c) => [c.id, c.label]));
const statusLabel = Object.fromEntries(projectStatuses.map((s) => [s.id, s.label]));

/** Accepts "YYYY", "YYYY-MM" or "YYYY-MM-DD"; returns a readable label or null. Never invents precision. */
export function formatProjectDate(value) {
  if (!hasText(value)) return null;
  const m = value.trim().match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  if (!mo) return y;
  const date = new Date(Date.UTC(+y, +mo - 1, d ? +d : 1));
  if (Number.isNaN(date.getTime()) || date.getUTCMonth() !== +mo - 1) return null;
  return date.toLocaleDateString("en-GB", { ...(d ? { day: "numeric" } : {}), month: "long", year: "numeric", timeZone: "UTC" });
}

const list = (v) => (Array.isArray(v) ? v : []);

/** Cleans one raw record into exactly what the UI may show. Unverified records lose all status/fact fields. */
function normalize(p) {
  const verified = p.isVerified === true;
  const status = verified && STATUS_IDS.has(p.status) ? p.status : null;
  const start = verified ? formatProjectDate(p.startDate) : null;
  const end = verified ? formatProjectDate(p.completionDate) : null;

  let dateLabel = null;
  if (status === "completed") dateLabel = end ? `Completed ${end}` : start ? `Started ${start}` : null;
  else if (status === "ongoing") dateLabel = start ? `Started ${start}` : null;
  else if (status === "planned") dateLabel = start ? `Planned start: ${start}` : null;

  const paragraphs = hasText(p.description) ? p.description.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) : [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title.trim(),
    summary: p.summary.trim(),
    category: p.category,
    categoryLabel: categoryLabel[p.category],
    isVerified: verified,
    status,
    statusLabel: status ? statusLabel[status] : null,
    location: verified && hasText(p.location) ? p.location.trim() : null,
    startLabel: start,
    completionLabel: end,
    dateLabel,
    cover: hasText(p.coverImage) ? { src: p.coverImage, alt: hasText(p.imageAlt) ? p.imageAlt.trim() : `Cover image for ${p.title.trim()}` } : null,
    paragraphs,
    objectives: list(p.objectives).filter(hasText),
    // The facts below are documentation claims, so they require verification.
    activities: verified ? list(p.activities).filter((a) => hasText(a?.title)).map((a) => ({ title: a.title.trim(), description: hasText(a.description) ? a.description.trim() : null, dateLabel: formatProjectDate(a.date) })) : [],
    milestones: verified ? list(p.milestones).filter((m) => hasText(m?.title) && formatProjectDate(m.date)).map((m) => ({ title: m.title.trim(), description: hasText(m.description) ? m.description.trim() : null, dateLabel: formatProjectDate(m.date) })) : [],
    outcomes: verified ? list(p.outcomes).filter((o) => hasText(o?.title)).map((o) => ({ title: o.title.trim(), description: hasText(o.description) ? o.description.trim() : null, evidenceUrl: safeLink(o.evidenceUrl) })) : [],
    gallery: verified ? list(p.gallery).filter((g) => hasText(g?.src) && hasText(g?.alt) && g.consentConfirmed === true).map((g) => ({ src: g.src, alt: g.alt.trim(), caption: hasText(g.caption) ? g.caption.trim() : null })) : [],
    isFeatured: p.isFeatured === true,
  };
}

/** Only published, well-formed records with a unique slug. */
export function getPublishedProjects(source = allProjects) {
  const seen = new Set();
  return source
    .filter((p) => p?.isPublished === true && hasText(p.id) && hasText(p.title) && hasText(p.summary) && hasText(p.slug) && SLUG.test(p.slug) && categoryLabel[p.category] && p.category !== "all")
    .filter((p) => (seen.has(p.slug) ? false : seen.add(p.slug)))
    .map(normalize);
}

export const getProjectBySlug = (slug) => getPublishedProjects().find((p) => p.slug === slug) ?? null;

/** Featured = first published, VERIFIED project flagged isFeatured. Otherwise none. */
export const getFeaturedProject = (projects) => projects.find((p) => p.isFeatured && p.isVerified) ?? null;

export function getRelatedProjects(project, projects, max = 3) {
  const others = projects.filter((p) => p.slug !== project.slug);
  return [...others.filter((p) => p.category === project.category), ...others.filter((p) => p.category !== project.category)].slice(0, max);
}

/**
 * Single access point for the pages. For a Laravel API later, make this async
 * and fetch the same shape; the UI stays unchanged.
 * Filters only list categories/statuses that actually occur, and only appear when there is a real choice.
 */
export function getProjectsData() {
  const projects = getPublishedProjects();
  const usedCategories = projectCategories.filter((c) => c.id === "all" || projects.some((p) => p.category === c.id));
  const usedStatuses = projectStatuses.filter((s) => s.id === "all" || projects.some((p) => p.status === s.id));
  return {
    projects,
    featured: getFeaturedProject(projects),
    categories: usedCategories.length > 2 ? usedCategories : [],
    statuses: usedStatuses.length > 2 ? usedStatuses : [],
  };
}
