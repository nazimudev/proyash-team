/**
 * DONATION CONFIGURATION (public, non-secret).
 *
 * Nothing here is a real account, endpoint or financial figure. It is a template
 * to be filled in ONLY with confirmed information.
 */
export const donationConfig = {
  currency: "BDT",
  organizationName: "Proyash",

  /**
   * URL that accepts donation submissions (POST, JSON). EMPTY on purpose: no backend
   * exists yet and none has been invented. While empty, the form cannot be submitted
   * and says so; it never pretends data was saved.
   *
   * Contract this frontend expects from the future Laravel endpoint:
   *   request  body = payload built in components/donation/DonationForm.jsx (includes clientRequestId
   *            for duplicate protection; the SERVER must still validate everything)
   *   success  2xx; optional JSON { "reference": "<backend-generated reference>" }
   *   failure  any non-2xx
   * The donation is always created as "pending verification" by the backend.
   */
  submissionEndpoint: "",

  quickAmounts: [100, 500, 1000, 5000], // BDT, shortcuts only; no minimum/maximum policy is implied
  purposes: [
    { id: "community", label: "Community Support" },
    { id: "education", label: "Educational Support" },
    { id: "environment", label: "Tree Plantation and Environmental Awareness" },
    { id: "general", label: "General Support" },
    { id: "other", label: "Other" },
  ],

  /** No Privacy Policy page exists yet. Set to its route (e.g. "/privacy") once it does and the form will link to it. */
  privacyPolicyHref: null,

  publicListPageSize: 10,
};
