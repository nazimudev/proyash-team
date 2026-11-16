// Options for the Add Project form. Kept here so they are easy to maintain.
// NOTE: the Projects overview filter still uses PROJECT_CATEGORIES from data/projects.js,
// which has no "Event Management". Import this list there later so both stay in sync.
export const PROJECT_FORM_CATEGORIES = [
  "Education Support",
  "Community Welfare",
  "Tree Plantation",
  "Medical Support",
  "Food Distribution",
  "Emergency Assistance",
  "Event Management",
  "Other",
];

export const FUNDING_SOURCES = [
  "Individual Donations",
  "Organizational Funds",
  "Community Contributions",
  "Grant",
  "Mixed Funding",
  "Other",
];

export const PROJECT_STATUSES = [
  { value: "planned", name: "Planned" },
  { value: "in_progress", name: "In Progress" },
  { value: "complete", name: "Completed" },
  { value: "on_hold", name: "On Hold" },
  { value: "cancelled", name: "Cancelled" },
];