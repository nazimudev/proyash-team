/**
 * PROJECTS DATA — add, edit, categorize or remove projects here.
 *
 * No documented projects (and no real project photographs) existed in the
 * project when this page was built, so `projects` holds ONE unpublished example.
 * The page therefore shows "Our Projects Are Taking Shape" until you publish
 * real records. Nothing here is a real Proyash activity.
 *
 * HOW A RECORD IS SHOWN (see lib/projects.js)
 *  - Public only if isPublished === true, with a valid unique slug, title,
 *    summary and a known category.
 *  - Status (ongoing / completed / planned), location, dates, timeline,
 *    activities, outcomes and photos are shown ONLY when isVerified === true.
 *    A published but unverified project shows just its title, category, summary
 *    and an "Awaiting verification" label; it is never called ongoing/completed.
 *  - Empty values are hidden. Never write placeholder text into optional fields.
 *
 * FIELDS
 *   id, slug              stable and unique. slug: lowercase-with-hyphens, used in /projects/[slug]
 *   title, summary        required (summary: 1–2 sentences)
 *   description           optional; separate paragraphs with a blank line
 *   category              "community" | "education" | "environment" | "other"
 *   status                "ongoing" | "completed" | "planned"
 *                         ongoing = genuinely started and still active; completed = actually
 *                         finished; planned = documented future plan not yet started
 *   coverImage, imageAlt  file in /public/images/projects/ + accurate description
 *   location              optional, verified only
 *   startDate, completionDate   "YYYY", "YYYY-MM" or "YYYY-MM-DD", or null
 *   objectives            ["..."]
 *   activities            [{ title, description, date? }]
 *   milestones            [{ title, date, description? }]   (shown as the Project Timeline)
 *   outcomes              [{ title, description, evidenceUrl? }]  documented results only
 *   gallery               [{ src, alt, caption?, consentConfirmed: true }]  photos of THIS project only;
 *                         get consent before publishing identifiable people, and protect children's privacy
 *   isVerified, isPublished, isFeatured
 *
 * Shaped to match a future Laravel API response (admin-managed projects).
 */

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "community", label: "Community Support" },
  { id: "education", label: "Educational Support" },
  { id: "environment", label: "Tree Plantation" },
  { id: "other", label: "Other Activities" },
];

export const projectStatuses = [
  { id: "all", label: "All Statuses" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "planned", label: "Planned" },
];

export const projects = [
  // Example record (UNPUBLISHED; the image file does not exist). Copy this shape for real projects.
  {
    id: "example-project",
    slug: "example-project",
    title: "Example Project",
    category: "community",
    status: "planned",
    summary: "Replace this with a verified project description.",
    description: "",
    coverImage: "/images/projects/replace-with-real-image.jpg",
    imageAlt: "Replace with an accurate image description.",
    location: null,
    startDate: null,
    completionDate: null,
    objectives: [],
    activities: [],
    milestones: [],
    outcomes: [],
    gallery: [],
    isVerified: false,
    isPublished: false,
    isFeatured: false,
  },
];

export const projectsHero = {
  eyebrow: "Our projects",
  title: "Turning Our Purpose Into Action",
  text: "Explore the initiatives and projects through which Proyash Songgothon aims to support people in need, encourage educational opportunities, and promote a greener community.",
  cta: { label: "Explore Our Projects", href: "#projects-list" },
};

export const projectsEmpty = {
  title: "Our Projects Are Taking Shape",
  text: "Project updates will be shared here as activities are documented and published.",
  noMatch: "No projects match the selected filters.",
};

export const projectsCta = {
  title: "Help Us Create Meaningful Change",
  text: "Every meaningful initiative begins with people who care. Join Proyash Songgothon in supporting communities, encouraging education, and caring for the environment.",
};
