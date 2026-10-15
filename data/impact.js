/**
 * IMPACT PAGE CONTENT & RECORDS
 *
 * HOW VERIFIED RECORDS WORK
 * Nothing on the Impact page is a made-up number. A record is shown publicly
 * ONLY when lib/impact.js confirms ALL of the following:
 *   - isVerified === true       (someone has checked it against organizational records)
 *   - isPublished === true      (the organization has approved it for the website)
 *   - required fields present   (see each schema below)
 * Anything else is hidden, or listed only as "Data Not Yet Available".
 *
 * As of this commit the project contained NO verified statistics, activity
 * records, reports or photographs, so every record below is intentionally
 * unverified/unpublished and holds no value.
 *
 * Shaped to match a future Laravel API response: replace the exports with data
 * fetched in lib/impact.js -> getImpactData(); components stay unchanged.
 */

/** Focus area ids are shared by statistics, timeline, stories and gallery. */
export const impactHero = {
  eyebrow: "Our impact",
  title: "Every Effort Can Make a Difference",
  text: "Meaningful change begins with action. Explore the documented activities and verified achievements of Proyash as we work toward supporting people, encouraging education, and building a greener future.",
  transparencyStatement:
    "We believe impact should be measured honestly, communicated clearly, and supported by evidence.",
  primaryCta: { label: "Explore Our Impact", href: "#impact-numbers" },
  secondaryCta: { label: "View Our Initiatives", href: "/#initiatives" },
  // Replace with a real photo at /public/images/impact/hero.jpg (illustrative, not evidence).
  image: {
    src: "/images/impact/hero.jpg",
    alt: "Proyash Songgothon volunteers working together in the community",
  },
};

export const impactNumbersIntro = {
  eyebrow: "By the numbers",
  title: "Our Impact in Numbers",
  text: "Every number tells a story. We share figures only when they can be supported by reliable organizational records.",
};

/**
 * STATISTIC SCHEMA (one object per metric)
 *   id, title, unit, description, focusAreaId   — fixed definition
 *   value               number (required to publish). Leave null until verified.
 *   zeroConfirmed       set true ONLY if records confirm that 0 is accurate
 *   reportingPeriod     e.g. "January – December 2025"
 *   verificationStatus  "verified" | "pending"
 *   isVerified / isPublished   both must be true
 *   sourceLabel         REQUIRED to publish, e.g. "Annual activity register"
 *   sourceUrl           optional link to a report ("https://..." or "/path")
 *   lastVerifiedAt      optional ISO date, shown only if provided
 */
export const impactStatistics = [
  {
    id: "people-supported",
    title: "People Supported",
    unit: "people",
    description: "Individuals with documented support records.",
    focusAreaId: "community-support",
  },
  {
    id: "educational-support-activities",
    title: "Educational Support Activities",
    unit: "activities",
    description: "Documented activities that support students' education.",
    focusAreaId: "educational-support",
  },
  {
    id: "trees-planted",
    title: "Trees Planted",
    unit: "trees",
    description:
      "Trees planted and documented. Does not include trees distributed, and does not measure how many survive.",
    focusAreaId: "environmental-action",
  },
  {
    id: "community-initiatives-completed",
    title: "Community Initiatives Completed",
    unit: "initiatives",
    description: "Initiatives with a documented completion record.",
    focusAreaId: "community-support",
  },
  {
    id: "volunteer-participation",
    title: "Volunteer Participation",
    unit: "volunteers",
    description: "Volunteers with documented participation records.",
    focusAreaId: null,
  },
  {
    id: "total-activities-documented",
    title: "Total Activities Documented",
    unit: "activities",
    description: "All activities with a supporting record.",
    focusAreaId: null,
  },
].map((metric) => ({
  value: null,
  zeroConfirmed: false,
  reportingPeriod: "",
  verificationStatus: "pending",
  isVerified: false,
  isPublished: false,
  sourceLabel: "",
  sourceUrl: "",
  lastVerifiedAt: "",
  ...metric,
}));

export const impactFocusAreasIntro = {
  eyebrow: "Focus areas",
  title: "Where Our Efforts Make a Difference",
};

/** Fixed descriptions of the three focus areas. Verified figures are pulled in automatically. */
export const impactFocusAreas = [
  {
    id: "community-support",
    icon: "HandHeart",
    label: "Community Support",
    title: "Supporting People in Need",
    description:
      "Our community-focused efforts aim to support disadvantaged people with compassion, dignity, and care.",
    galleryLabel: "Community Support",
    storiesLabel: "Community Support Stories",
  },
  {
    id: "educational-support",
    icon: "GraduationCap",
    label: "Educational Support",
    title: "Encouraging Educational Opportunities",
    description:
      "We believe access to education can create opportunities for individuals and strengthen communities.",
    galleryLabel: "Education",
    storiesLabel: "Educational Support Stories",
  },
  {
    id: "environmental-action",
    icon: "Sprout",
    label: "Environmental Action",
    title: "Growing a Greener Future",
    description:
      "We aim to encourage tree plantation, environmental awareness, and community participation in creating a greener future.",
    galleryLabel: "Tree Plantation",
    storiesLabel: "Environmental Action Stories",
  },
];

export const impactTimelineIntro = {
  eyebrow: "Timeline",
  title: "Our Journey of Progress",
  emptyText:
    "Our documented impact stories will appear here as verified activity records become available.",
};

/**
 * TIMELINE RECORD SCHEMA
 *   id, title, description          (required)
 *   date                            ISO "2025-03-14" (preferred) and/or
 *   period                          free text, e.g. "March 2025" — one of the two required
 *   location                        optional, only if documented
 *   focusAreaId                     "community-support" | "educational-support" | "environmental-action"
 *   image                           optional { src, alt } — authentic photo only
 *   consentConfirmed                must be true if the photo shows identifiable people
 *   evidenceLabel / evidenceUrl     optional report or photo link
 *   isVerified / isPublished        both must be true
 */
export const impactTimeline = [];

export const impactStoriesIntro = {
  eyebrow: "Stories",
  title: "Stories Behind the Numbers",
  text: "Social impact is about more than statistics. It also includes the experiences, opportunities, and positive changes that come from community initiatives.",
  privacyNote:
    "We intend to publish stories only with appropriate consent, and to protect people's privacy, especially children's.",
  emptyText:
    "Documented stories will be published here when they are available.",
};

/**
 * STORY RECORD SCHEMA
 *   id, title, summary              (required; factual, no invented quotes)
 *   focusAreaId                     which of the three cards it appears in
 *   publishedAt                     optional ISO date
 *   initiative                      optional related initiative name
 *   image                           optional { src, alt }
 *   consentConfirmed                REQUIRED true to publish (privacy / consent)
 *   sourceLabel / sourceUrl         optional documentation link
 *   isVerified / isPublished        both must be true
 */
export const impactStories = [];

export const impactGalleryIntro = {
  eyebrow: "Gallery",
  title: "A Closer Look at Our Work",
  emptyText:
    "Authentic photographs of our activities will appear here once documented photos are published. We do not use stock images as evidence of our work.",
};

/**
 * GALLERY RECORD SCHEMA (authentic photographs only; files in /public/images/impact/)
 *   id, src, alt                    (required)
 *   focusAreaId                     category label shown only if the photo is verified for it
 *   date (ISO) / location           optional, only if verified
 *   caption                         optional
 *   consentConfirmed                REQUIRED true to publish
 *   isVerified / isPublished        both must be true
 */
export const impactGallery = [];

export const transparencyIntro = {
  eyebrow: "Transparency",
  title: "Built on Trust and Transparency",
  text: "We believe that communicating our work responsibly is essential to building trust. Our goal is to present accurate information, maintain clear records, and make documented achievements understandable to our community.",
  note: "These are principles we aim to follow, not formal policies.",
};

export const transparencyPrinciples = [
  {
    icon: "ShieldCheck",
    title: "Accurate Reporting",
    text: "We aim to publish figures that are supported by reliable records.",
  },
  {
    icon: "FileText",
    title: "Clear Documentation",
    text: "We seek to maintain activity details, dates, and supporting evidence wherever available.",
  },
  {
    icon: "Megaphone",
    title: "Responsible Communication",
    text: "We distinguish verified achievements from plans, goals, and activities still in progress.",
  },
  {
    icon: "RefreshCw",
    title: "Continuous Improvement",
    text: "We aim to learn from documented activities and improve the way we evaluate our work.",
  },
];

/**
 * REPORTING INFORMATION — fill only with real information; empty fields are hidden.
 * Do NOT put today's date in lastUpdated unless a person actually verified the data that day.
 *   reports: [{ id, label, url }]  published reports/documents (real files only)
 */
export const reportingInformation = {
  eyebrow: "Reading the data",
  title: "Reporting Period and Data Sources",
  reportingPeriod: "",
  lastUpdated: "", // ISO date, e.g. "2026-01-31"
  sourceOfInformation: "",
  verificationNotes: "",
  reports: [],
  emptyText:
    "Reporting details will be shown here once verified impact data is published.",
};

export const futurePrioritiesIntro = {
  eyebrow: "Looking ahead",
  title: "Looking Ahead",
  text: "We remain committed to exploring meaningful ways to support people, encourage educational opportunities, and contribute to a greener environment.",
  note: "These are areas of focus, not completed work and not promised outcomes.",
};

/**
 * FUTURE PRIORITIES. `targets` is empty because no targets have been approved.
 * TARGET SCHEMA: { id, description, value, unit, period, approvalStatus: "approved",
 *                  currentVerifiedValue }  — progress is calculated and shown ONLY when the
 * target is approved and both numbers are valid.
 */
export const futurePriorities = [
  {
    id: "community",
    icon: "HeartHandshake",
    title: "Strengthening Community Support",
    text: "Exploring ways to stand beside more people facing difficult circumstances.",
    targets: [],
  },
  {
    id: "education",
    icon: "GraduationCap",
    title: "Encouraging Educational Opportunities",
    text: "Exploring ways to help more students continue their education.",
    targets: [],
  },
  {
    id: "environment",
    icon: "Sprout",
    title: "Expanding Environmental Awareness",
    text: "Exploring ways to encourage tree plantation and care for the environment.",
    targets: [],
  },
];

export const impactCta = {
  title: "Be Part of Positive Change",
  text: "Every meaningful initiative begins with people who care. Explore our work, share your ideas, or connect with Proyash Songgothon to discover how you can contribute.",
  primary: { label: "Explore Our Initiatives", href: "/#initiatives" },
  // No volunteer page exists yet, so this goes to the existing contact section.
  secondary: { label: "Get Involved", href: "/#contact" },
};
