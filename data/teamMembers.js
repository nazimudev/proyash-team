/**
 * TEAM DATA
 *
 * `teamMembers` is the REAL list. It is intentionally empty: no names, roles or
 * qualifications have been confirmed yet, and none are invented here.
 *
 * Add a person by appending an object to `teamMembers` (template below).
 * While `teamMembers` is empty, the page falls back to `sampleTeamMembers`,
 * which are clearly labelled "Sample profile" on the page. As soon as you add
 * one real profile, the samples disappear automatically.
 *
 * Fields (shaped to match a future Laravel API response):
 *   id            unique string
 *   name          full name (required)
 *   role          confirmed designation (required) — only use titles the
 *                 organization has confirmed
 *   memberType    "official" | "advisor"
 *   image         path under /public, e.g. "/images/team/rahim-uddin.jpg"
 *                 (4:5 portrait works best). Use null if there is no photo yet.
 *   bio           optional, 1–3 sentences
 *   socialLinks   optional; only non-empty, valid https URLs render
 *                 { facebook, linkedin, instagram, website }
 *   displayOrder  number; lower comes first within its category
 *
 * Template:
 * {
 *   id: "member-1",
 *   name: "Full Name",
 *   role: "Confirmed role",
 *   memberType: "official",
 *   image: "/images/team/full-name.jpg",
 *   bio: "",
 *   socialLinks: { facebook: "", linkedin: "", instagram: "", website: "" },
 *   displayOrder: 1,
 * },
 *
 * Do not store private contact details (phone, email, home address) here.
 */
export const teamMembers = [];

/** DEVELOPMENT ONLY — placeholder layout previews. Not real people. */
export const sampleTeamMembers = [
  {
    id: "sample-official-1",
    isSample: true,
    name: "Sample Member",
    role: "Role to be confirmed",
    memberType: "official",
    image: "/images/team/sample-1.jpg",
    bio: "A short biography will appear here once a real profile is added.",
    socialLinks: {},
    displayOrder: 1,
  },
  {
    id: "sample-official-2",
    isSample: true,
    name: "Sample Member",
    role: "Role to be confirmed",
    memberType: "official",
    image: "/images/team/sample-2.jpg",
    bio: "",
    socialLinks: {},
    displayOrder: 2,
  },
  {
    id: "sample-official-3",
    isSample: true,
    name: "Sample Member",
    role: "Role to be confirmed",
    memberType: "official",
    image: "/images/team/sample-3.jpg",
    bio: "",
    socialLinks: {},
    displayOrder: 3,
  },
  {
    id: "sample-advisor-1",
    isSample: true,
    name: "Sample Advisor",
    role: "Advisory role to be confirmed",
    memberType: "advisor",
    image: "/images/team/sample-advisor-1.jpg",
    bio: "Professional background and a short biography will appear here once a real profile is added.",
    socialLinks: {},
    displayOrder: 1,
  },
  {
    id: "sample-advisor-2",
    isSample: true,
    name: "Sample Advisor",
    role: "Advisory role to be confirmed",
    memberType: "advisor",
    image: "/images/team/sample-advisor-2.jpg",
    bio: "",
    socialLinks: {},
    displayOrder: 2,
  },
];

export const teamCategories = [
  { id: "all", label: "All Members" },
  { id: "official", label: "Official Members" },
  { id: "advisor", label: "Advisors" },
];

/** Team-page content that is not a profile. `heroPhoto`: set to a { src, alt } object to show a real team photo. */
export const teamPage = {
  heroPhoto: null,
};

/** Single access point; swap this for a Laravel API fetch later. */
export function getTeamProfiles() {
  const usingSamples = teamMembers.length === 0;
  const list = usingSamples ? sampleTeamMembers : teamMembers;
  const members = [...list].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );
  return { members, usingSamples };
}
