export const teamMembers = [];

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

// Official members mapping
export function mapOfficialMembers(data = []) {
  return data
    .filter((member) => member.status === "approved")
    .map((member) => ({
      id: `member-${member.id}`,
      name: member.full_name_bn,
      role: member.occupation || "Member",
      memberType: "official",
      image: member.profile_photo_path
        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${member.profile_photo_path}`
        : null,
      bio: "",
      socialLinks: {},
      displayOrder: member.id,
    }));
}

// Advisors mapping
export function mapAdvisors(data = []) {
  return data.map((advisor) => ({
    id: `advisor-${advisor.id}`,
    name: advisor.name,
    role: advisor.designation || "Advisor",
    memberType: "advisor",
    image:
      advisor.image_url ||
      (advisor.image
        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${advisor.image}`
        : null),
    bio: advisor.address || "",
    socialLinks: {},
    displayOrder: advisor.id,
  }));
}

