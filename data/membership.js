/**
 * MEMBERSHIP PAGE CONTENT — every label, option and statement lives here so it can be edited or
 * translated (e.g. to Bengali) without touching components. Field `name`s match the backend field names.
 */

export const joinHero = {
  eyebrow: "Join Proyash",
  title: "Become a Member of Proyash",
  text:
    "Apply to join Proyash Songgothon, a social welfare organization in Madhupur, Tangail, Bangladesh. Complete the application below and the Proyash administration will review it.",
};

export const joinSteps = [
  { id: "personal", title: "Personal Information" },
  { id: "address", title: "Address" },
  { id: "account", title: "Account & Agreement" },
  { id: "review", title: "Review & Submit" },
];

export const personalFields = [
  { name: "full_name_bn", label: "Full Name (Bengali)", type: "text", required: false, placeholder: "Optional", lang: "bn", autoComplete: "off" },
  { name: "full_name_en", label: "Full Name (English)", type: "text", required: true, placeholder: "Enter your full name", autoComplete: "name" },
  { name: "father_name", label: "Father’s Name", type: "text", required: true, placeholder: "Enter your father’s name", autoComplete: "off" },
  { name: "mother_name", label: "Mother’s Name", type: "text", required: true, placeholder: "Enter your mother’s name", autoComplete: "off" },
  { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, autoComplete: "bday" },
  { name: "nationality", label: "Nationality", type: "text", required: true, placeholder: "e.g. Bangladeshi", autoComplete: "off" },
  { name: "religion", label: "Religion", type: "text", required: false, placeholder: "Optional", autoComplete: "off" },
  { name: "occupation", label: "Occupation", type: "text", required: true, placeholder: "Enter your occupation", autoComplete: "organization-title" },
  { name: "gender", label: "Gender", type: "select", required: false, options: ["Male", "Female", "Other", "Prefer not to say"] },
  { name: "marital_status", label: "Marital Status", type: "select", required: true, options: ["Single", "Married", "Divorced", "Widowed"] },
  { name: "educational_qualification", label: "Educational Qualification", type: "text", required: true, placeholder: "e.g. Higher Secondary", autoComplete: "off" },
  { name: "blood_group", label: "Blood Group", type: "select", required: false, options: ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"] },
  { name: "mobile_number", label: "Mobile Number", type: "tel", required: true, placeholder: "01XXXXXXXXX", autoComplete: "tel", hint: "Bangladeshi mobile number." },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@example.com", autoComplete: "email", hint: "This will be your login email." },
];

/** Address parts, used for both permanent_* and present_* fields. */
export const addressParts = [
  { part: "village", label: "Village", placeholder: "Village" },
  { part: "post_office", label: "Post Office", placeholder: "Post office" },
  { part: "upazila", label: "Upazila", placeholder: "Upazila" },
  { part: "district", label: "District", placeholder: "District" },
];

export const sameAddressLabel = "Present address is the same as permanent address.";

/**
 * MEMBERSHIP CONDITIONS — copied from the organization's membership form as supplied. These are
 * statements from that form, NOT independently verified policies, and are shown for the organization to
 * review before publication. Do not add or change financial obligations here without approval.
 * (Note for review: items 1 and 3 both mention the BDT 50 monthly contribution.)
 */
export const membershipConditions = {
  title: "Membership conditions",
  items: [
    "A monthly contribution of BDT 50.",
    "Participation in regular organizational meetings and programs.",
    "A contribution of BDT 150 when becoming a member and BDT 50 as the monthly contribution.",
    "Members must not be affiliated with political parties or organizations.",
  ],
  note:
    "These conditions are taken from the organization’s membership form and are pending organization review before publication. No payment is collected on this website.",
  acknowledgment: "I have read the membership conditions above.",
};

export const declaration = {
  title: "Applicant declaration",
  text:
    "I declare that the information I have provided is accurate, and I agree to follow the applicable rules and decisions of Proyash Songgothon.",
  privacyTerms: "I have read and accept the applicable Privacy Policy and Terms of Service.",
  documentsPending: "Links to these documents will be added when they are published.",
  notice:
    "Submitting this application does not guarantee membership. Your application will be reviewed by the Proyash administration. You can sign in to check your application status after registration, but Member Dashboard access will remain restricted until your membership is approved.",
};

export const passwordGuidance = {
  title: "Password requirements",
  note: "The final rules are enforced by the server. Use a password you don’t use anywhere else.",
};

/** Plain-language status copy. The status itself must always come from the backend. */
export const statusCopy = {
  pending: { label: "Pending review", description: "Your application has been submitted and is waiting for review by the Proyash administration. Member Dashboard access stays restricted until it is approved." },
  approved: { label: "Approved", description: "Your membership application has been approved by the Proyash administration." },
  rejected: { label: "Rejected", description: "Your application was not approved, so Member Dashboard access is not available for this account." },
  suspended: { label: "Suspended", description: "Your membership access is currently suspended. Please contact the Proyash administration." },
};

export const joinClosedNotice = "We’re not accepting online applications yet. You can complete the form to preview it, but it can’t be submitted until applications open.";
export const loginClosedNotice = "Member sign-in isn’t available yet.";
