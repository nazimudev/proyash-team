/**
 * Single source of truth for homepage content.
 * Everything here is plain, serializable data so each list can later be
 * replaced by a Laravel REST API response with the same field names.
 *
 * Nothing in this file is a verified statistic. No numbers, dates, people,
 * or registration details are invented.
 */

export const site = {
  name: "Proyash",
  tagline: "Small Acts of Kindness. Lasting Change.",
  location: "Madhupur, Tangail, Bangladesh",
  facebookUrl: "https://www.facebook.com/proyas3524",
};

export const develop = {
  company: "miniwix",
  url: "https://miniwix.com"
};

/**
 * Destinations for CTAs. Dedicated pages (About, Projects, Gallery,
 * volunteer registration, contact form) do not exist yet, so these point at
 * on-page anchors or the official Facebook page. When a page ships, change
 * the href here and every button updates.
 */
export const links = {
  join: { href: "/volunteer" },
  joinAction: { href: site.facebookUrl, external: true },
  about: { href: site.facebookUrl, external: true },
  projects: { href: site.facebookUrl, external: true },
  gallery: { href: site.facebookUrl, external: true },
  contact: { href: site.facebookUrl, external: true },
  facebook: { href: site.facebookUrl, external: true },
  donation: {href: "/donation"}
};

export const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About Us", href: "/about" },
  { id: "initiatives", label: "Our Impact", href: "/impact" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "our-team", label: "Our Team", href: "/our-team" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "auth", label: "Login", href: "/auth" },
];

/**
 * PHOTOGRAPHY — TEMPORARY SLOTS.
 * Drop real files at these paths inside /public/images (see README).
 * Alt text describes the *intended* subject; update it to match the photo.
 */
export const images = {
  hero: {
    src: "/images/hero.JPG",
    alt: "Community volunteers planting young trees together",
  },
  heroSecondary: {
    src: "/images/hero-students.jpg",
    alt: "A student reading in a classroom",
  },
  intro: {
    src: "/images/intro-together.jpg",
    alt: "Volunteers and neighbours gathered during a community activity",
  },
  impact: {
    src: "/images/impact-care.jpg",
    alt: "People of different ages working side by side outdoors",
  },
};

export const focusAreas = [
  { icon: "HeartHandshake", label: "Community support" },
  { icon: "Sprout", label: "Tree plantation" },
  { icon: "GraduationCap", label: "Educational support" },
];

export const initiatives = [
  {
    id: "community-support",
    icon: "HeartHandshake",
    label: "Community Support",
    title: "Standing Beside Those in Need",
    description:
      "Supporting underprivileged people and helping individuals and families facing difficult circumstances.",
    image: {
      src: "/images/initiative-community-support.jpg",
      alt: "A volunteer offering help to a family in need",
    },
    href: "/#projects",
    cta: "See related stories",
  },
  {
    id: "tree-plantation",
    icon: "Sprout",
    label: "Tree Plantation",
    title: "Growing a Greener Tomorrow",
    description:
      "Encouraging tree plantation and environmental responsibility to help build a greener future for our communities.",
    image: {
      src: "/images/initiative-tree-plantation.jpg",
      alt: "Hands setting a young sapling into the soil",
    },
    href: "/#projects",
    cta: "See related stories",
  },
  {
    id: "educational-support",
    icon: "GraduationCap",
    label: "Educational Support",
    title: "Helping Students Move Forward",
    description:
      "Supporting students from financially disadvantaged backgrounds and encouraging them to continue their education.",
    image: {
      src: "/images/initiative-education.jpg",
      alt: "Students studying together at a desk",
    },
    href: "/#projects",
    cta: "See related stories",
  },
];

/**
 * SAMPLE CONTENT ONLY — these entries demonstrate the card layout and are not
 * real Proyash activities. Replace with API data. `href: null` hides the
 * "Read story" link until a real story page exists; `publishedAt: null`
 * hides the date.
 */
export const projects = [
  {
    id: "sample-1",
    isSample: true,
    category: "Community Support",
    title: "Featured Project",
    excerpt:
      "A short description of the project will appear here once a real story is published.",
    image: {
      src: "/images/project-1.jpg",
      alt: "Sample featured project photograph",
    },
    publishedAt: null,
    href: null,
  },
  {
    id: "sample-2",
    isSample: true,
    category: "Tree Plantation",
    title: "Project Story",
    excerpt:
      "Space for a real plantation story, with photographs and a short summary.",
    image: {
      src: "/images/project-2.jpg",
      alt: "Sample project story photograph",
    },
    publishedAt: null,
    href: null,
  },
  {
    id: "sample-3",
    isSample: true,
    category: "Educational Support",
    title: "Project Story",
    excerpt:
      "Space for a real education-support story, with photographs and a short summary.",
    image: {
      src: "/images/project-3.jpg",
      alt: "Sample project story photograph",
    },
    publishedAt: null,
    href: null,
  },
];

export const impactPoints = [
  {
    icon: "Users",
    title: "Collective action",
    text: "Small efforts add up when many people take part.",
  },
  {
    icon: "BookOpen",
    title: "Educational opportunity",
    text: "A student who can keep studying has more choices ahead.",
  },
  {
    icon: "HeartHandshake",
    title: "Community well-being",
    text: "Looking out for neighbours makes whole communities stronger.",
  },
  {
    icon: "Sprout",
    title: "Environmental responsibility",
    text: "Every tree planted is a gift to the people who come after us.",
  },
];

export const galleryItems = [
  {
    id: "g1",
    src: "/images/gallery-1.jpg",
    alt: "Volunteers and community members planting saplings together",
  },
  {
    id: "g2",
    src: "/images/gallery-2.jpg",
    alt: "A volunteer handing supplies to a family",
  },
  {
    id: "g3",
    src: "/images/gallery-3.jpg",
    alt: "Students studying together in a classroom",
  },
  {
    id: "g4",
    src: "/images/gallery-4.jpg",
    alt: "A row of newly planted young trees",
  },
  {
    id: "g5",
    src: "/images/gallery-5.jpg",
    alt: "Community members gathered outdoors during a service activity",
  },
];
// 