/**
 * PRIVACY POLICY CONTENT — all wording lives here; components contain no policy text.
 *
 * ACCURACY NOTES (read before publishing)
 *  - The text describes what the website's code actually does today (checked against the project):
 *    the donation form, the membership application and sign-in pages, the public donor list, and the
 *    absence of analytics, advertising trackers, cookie banners and browser-storage of form data.
 *  - Several features (donation submission, membership registration, sign-in) are built but not yet
 *    connected to a backend. The policy therefore says how information is handled "where these
 *    features are available". Re-check this page when each backend goes live.
 *  - Nothing here invents retention periods, certifications, security measures, hosting providers,
 *    analytics tools, or contact details. Items the organization must still confirm are listed in the
 *    hand-off summary, not on the public page.
 *
 * DATES: leave null until a real date is confirmed ("YYYY-MM-DD"). They are only shown when set.
 */

export const policyMeta = {
  title: "Privacy Policy",
  intro:
    "This policy explains what personal information Proyash may collect through this website, how it is used and protected, and the choices you have.",
  effectiveDate: null,
  lastUpdated: null,
};

/*
 * Block types: { p: "paragraph" } | { ul: ["item", ...] } | { note: "highlighted note" } | { h3: "sub-heading" }
 * Section ids are stable anchors; changing one breaks existing links to it.
 */
export const policySections = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      { p: "Proyash Songgothon is a social welfare organization based in Madhupur, Tangail, Bangladesh. We respect your privacy and want to be clear about how personal information is handled on this website." },
      { p: "This policy covers this website, including its donation, membership application and sign-in features. It does not cover other websites or services, such as our Facebook page or your payment provider." },
      { note: "Some features described in this policy, such as online donation submission, membership applications and member sign-in, may not be available yet. This policy explains how information is handled when they are." },
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    blocks: [
      { p: "We only collect information that you choose to submit through our forms, plus limited technical information described below. Depending on the feature you use, this may include:" },
      { h3: "Donation details" },
      { ul: [
        "Your name (for named donations).",
        "The donation amount, the payment method you used, and the transaction ID or reference from your payment.",
        "Your phone number (required for some payment methods) and your email address (optional).",
        "A donation purpose and a message (both optional).",
        "Your choices about whether your name and amount may be shown publicly.",
      ] },
      { h3: "Membership application and account details" },
      { ul: [
        "Your name in English and, optionally, in Bengali; your father’s and mother’s names; your date of birth; nationality; occupation; marital status; and educational qualification.",
        "Optional details: religion, gender and blood group.",
        "Your mobile number, email address, and permanent and present addresses.",
        "An optional profile photo.",
        "Your email address and a password for your member account, and your confirmation that you accept the membership conditions, the declaration, and this policy.",
      ] },
      { h3: "Technical information" },
      { p: "Like most websites, the systems that serve this website may automatically record basic technical information, such as your IP address, browser type, device type, the pages you request, and the time of your visit." },
      { p: "We do not request information through this website that is not listed here. The website does not currently have a contact form, so messages sent through our Facebook page are handled by Facebook as described in the section on third-party services." },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    blocks: [
      { p: "We use personal information only for purposes connected with our work, including to:" },
      { ul: [
        "Verify donations and record them accurately once they are confirmed.",
        "Keep records and prepare financial reports that show how contributions are managed. Published reports are intended to show totals and approved records, not private donor details.",
        "Review membership applications, create and manage member accounts, and let applicants check the status of their own application.",
        "Contact you about your donation or application when needed.",
        "Operate, protect and improve the website, and prevent misuse or fraud.",
        "Meet legal or regulatory obligations that apply to us.",
      ] },
    ],
  },
  {
    id: "donations-and-payment-information",
    title: "Donations and Payment Information",
    blocks: [
      { p: "Donations are made manually. You send your donation yourself through bKash, Rocket, Nagad, bank transfer or another method we have approved, and then submit your donation details on this website so that we can verify the payment." },
      { ul: [
        "This website does not process payments. We do not collect card numbers, and we do not receive money through the website.",
        "Submitting the donation form does not confirm a donation. A donation is recorded as pending until we have verified the payment, and only then is it treated as confirmed.",
        "To verify a payment we may compare the details you provide, such as the transaction ID, amount and phone number, with payment records.",
      ] },
      { note: "Never share your payment PIN, OTP, password or account login credentials with anyone. We will never ask for them, and this website never asks for them." },
    ],
  },
  {
    id: "anonymous-donations-and-public-donor-records",
    title: "Anonymous Donations and Public Donor Records",
    blocks: [
      { p: "Our supporter list can show confirmed donations that have been approved for publication. You decide how you appear:" },
      { ul: [
        "If you choose an anonymous donation, you appear publicly as “Anonymous Donor”.",
        "If you make a named donation, your name is shown publicly only if you choose to allow it. This choice is off by default.",
        "Your donation amount is shown publicly only if you choose to allow it. This choice is also off by default.",
        "Your message is not displayed publicly.",
      ] },
      { p: "Private details, including phone numbers, email addresses, transaction IDs, payment evidence and internal verification notes, are not meant to be shown on the public list." },
      { h3: "What anonymous does and does not mean" },
      { p: "Anonymous refers to how you appear on the public list. We may still need limited private information to verify your payment and keep accurate records, and that information is intended to be available only to authorized people." },
      { p: "We cannot promise complete anonymity. Your payment provider or bank keeps its own records, and people who already know about your donation may be able to recognise it from details such as the amount or date if you allow those to be shown." },
    ],
  },
  {
    id: "cookies-and-similar-technologies",
    title: "Cookies and Similar Technologies",
    blocks: [
      { ul: [
        "This website does not currently use analytics tools, advertising trackers, or tracking pixels.",
        "The website does not store your form entries or passwords in your browser’s local storage or session storage.",
        "When member sign-in is available, the sign-in system may use cookies or similar technology that are needed to keep you signed in.",
      ] },
      { p: "Your browser lets you view and delete cookies. Blocking cookies that are needed for sign-in may prevent you from signing in." },
      { p: "If we introduce analytics or other tracking technologies in the future, we will update this policy first." },
    ],
  },
  {
    id: "information-sharing-and-disclosure",
    title: "Information Sharing and Disclosure",
    blocks: [
      { p: "We do not publish your private donation or membership details. Your information may be accessed or shared in these limited ways:" },
      { ul: [
        "Authorized Proyash personnel who handle donations, membership applications and the website.",
        "Service providers that host the website and run the systems that store submitted information.",
        "Payment providers and banks involved in a donation, which handle your payment under their own terms. We may refer to their records to verify a payment.",
        "Public display, only as described in the section on anonymous donations and public donor records and only in line with your choices.",
        "Authorities or other parties when we are required to do so by law.",
      ] },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    blocks: [
      { p: "We have not set fixed retention periods. We keep personal information only for as long as it is reasonably needed for the purposes in this policy, for example while verifying a donation, while an application or membership is active, or where we need to keep accurate financial and accountability records, or where the law requires it." },
      { p: "Records of confirmed donations and approved expenses may need to be kept for longer so that our financial reporting stays accurate. When information is no longer needed, we intend to delete it or remove details that identify you." },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    blocks: [
      { p: "We aim to protect personal information with reasonable measures, including:" },
      { ul: [
        "Limiting access to private donor and applicant information to authorized people.",
        "Keeping private details separate from the records shown on the public pages.",
        "Intending to store account passwords only in protected (hashed) form, never as readable text.",
        "Never asking you for payment PINs, OTPs or passwords.",
      ] },
      { p: "No website or method of transmission is completely secure, so we cannot guarantee absolute security. Please use a strong password that you do not use elsewhere, and keep it private." },
    ],
  },
  {
    id: "your-privacy-choices-and-rights",
    title: "Your Privacy Choices and Rights",
    blocks: [
      { h3: "Choices you can make when you use the website" },
      { ul: [
        "Choose a named or anonymous donation, and whether your name and amount may be shown publicly.",
        "Leave optional fields blank, including your email address, donation message, religion, gender, blood group and profile photo.",
      ] },
      { h3: "Requests you can make to us" },
      { p: "You can contact us to ask what personal information we hold about you, to ask us to correct inaccurate information, to ask us to delete information or restrict how we use it, or to change how a donation is shown on the public list." },
      { p: "We will consider each request in line with applicable law. We may need to confirm your identity first, and we may need to keep some records, such as confirmed donation and financial records, even after a request." },
      { note: "The website does not currently offer automatic self-service deletion or privacy settings. Requests are handled by contacting us." },
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    blocks: [
      { p: "This website is intended for adults. We do not knowingly want personal information from children without the involvement of a parent or guardian, and we encourage anyone under 18 to ask a parent or guardian before submitting information." },
      { p: "When we publish photographs of our activities, we intend to publish identifiable photographs, especially of children, only with appropriate consent, and to avoid publishing personal details about children." },
      { p: "If you believe we hold or have published information about a child that should be removed, please contact us and we will review your request." },
    ],
  },
  {
    id: "third-party-services-and-external-links",
    title: "Third-Party Services and External Links",
    blocks: [
      { p: "This website links to other services that we do not control, including our official Facebook page. When you follow a link, you leave this website and the other service’s own privacy practices apply. This includes any messages you send us through Facebook." },
      { p: "bKash, Rocket, Nagad and banks are separate companies. They collect and use your information under their own terms when you make a payment." },
    ],
  },
  {
    id: "international-data-transfers",
    title: "International Data Transfers",
    blocks: [
      { p: "Proyash Songgothon is based in Bangladesh. The service providers that host this website and its systems may store or process information in other countries. Where that happens, your information may be handled under the laws of those countries. We aim to use service providers that handle information responsibly." },
    ],
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    blocks: [
      { p: "We may update this policy from time to time, for example when we add or change a feature. The latest version is always the one on this page, and any dates shown at the top show when it took effect or was last updated. Please check this page periodically." },
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    blocks: [
      { p: "If you have a question about this policy or want to make a privacy request, you can reach us through our official Facebook page or the Contact section of our website." },
      { p: "We have not published a dedicated email address or phone number for privacy requests. If one becomes available, it will be listed here." },
    ],
  },
];

export const policyContact = {
  title: "Questions about your privacy?",
  text: "Get in touch with Proyash Songgothon and we will review your question or request.",
};
