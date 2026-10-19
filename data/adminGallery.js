// SAMPLE DATA ONLY. These are generated placeholder pictures, not real Proyash Songgothon photos.
// Suggested frontend shape; map it onto the real Laravel API response later.
const placeholder = (label, hue) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='hsl(${hue} 35% 88%)'/><circle cx='400' cy='260' r='70' fill='hsl(${hue} 40% 72%)'/><rect x='250' y='370' width='300' height='24' rx='12' fill='hsl(${hue} 40% 72%)'/><text x='400' y='450' text-anchor='middle' font-family='sans-serif' font-size='28' fill='hsl(${hue} 35% 30%)'>${label}</text></svg>`,
  )}`;

const g = (n, o) => ({
  id: `gal-demo-${String(n).padStart(3, "0")}`,
  description: null,
  activity_date: null,
  alt_text: null,
  image_url: placeholder(
    `Sample photo ${String(n).padStart(2, "0")}`,
    (n * 37) % 360,
  ),
  ...o,
});

export const sampleGalleryPhotos = [
  g(1, {
    title: "Sample: Winter clothing distribution",
    category: "Community Support",
    status: "published",
    activity_date: "2026-10-12",
    created_at: "2026-10-13",
    description: "Placeholder entry for a clothing distribution day.",
    alt_text: "Volunteers handing out warm clothes (sample)",
  }),
  g(2, {
    title: "Sample: Tree planting day",
    category: "Tree Plantation",
    status: "published",
    activity_date: "2026-10-08",
    created_at: "2026-10-09",
    description: "Placeholder entry for a community planting event.",
    alt_text: "People planting saplings (sample)",
  }),
  g(3, {
    title: "Sample: School supply handover",
    category: "Education Support",
    status: "published",
    activity_date: "2026-09-18",
    created_at: "2026-09-19",
    description: "Placeholder entry for a school support program.",
  }),
  g(4, {
    title: "Sample: Community meeting",
    category: "Events",
    status: "draft",
    activity_date: "2026-10-15",
    created_at: "2026-10-16",
  }),
  g(5, {
    title: "Sample: Food pack preparation",
    category: "Community Support",
    status: "draft",
    created_at: "2026-10-14",
    description: "Draft with no activity date set.",
  }),
  g(6, {
    title: "Sample: Evening study circle",
    category: "Education Support",
    status: "published",
    activity_date: "2026-09-05",
    created_at: "2026-09-06",
  }),
  g(7, {
    title: "Sample: Sapling nursery visit",
    category: "Tree Plantation",
    status: "draft",
    activity_date: "2026-09-25",
    created_at: "2026-09-26",
  }),
  g(8, {
    title: "Sample: Volunteer orientation",
    category: "Social Activities",
    status: "published",
    activity_date: "2026-08-30",
    created_at: "2026-08-31",
  }),
  g(9, {
    title: "Sample: Health awareness session",
    category: "Social Activities",
    status: "published",
    activity_date: "2026-08-14",
    created_at: "2026-08-15",
  }),
  g(10, {
    title: "Sample: Annual gathering",
    category: "Events",
    status: "published",
    activity_date: "2026-07-22",
    created_at: "2026-07-23",
    description:
      "A deliberately long placeholder description to check how text wraps in the details view. ".repeat(
        3,
      ),
  }),
  g(11, {
    title: "Sample: Photo with a broken image link",
    category: "Other Activities",
    status: "published",
    activity_date: "2026-07-10",
    created_at: "2026-07-11",
    image_url: "/sample-images/does-not-exist.jpg",
    description:
      "This entry points to a missing file to demonstrate the fallback.",
  }),
  g(12, {
    title: "Sample: Riverbank clean-up",
    category: "Social Activities",
    status: "draft",
    activity_date: "2026-06-28",
    created_at: "2026-06-29",
  }),
  g(13, {
    title: "Sample: Library book donation",
    category: "Education Support",
    status: "published",
    activity_date: "2026-06-12",
    created_at: "2026-06-13",
  }),
  g(14, {
    title: "Sample: Flood relief packing",
    category: "Community Support",
    status: "published",
    activity_date: "2026-05-30",
    created_at: "2026-05-31",
  }),
];
