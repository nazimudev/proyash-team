/**
 * Privacy Policy content and configuration.
 *
 * Fill in `policyConfig` with VERIFIED values only. Anything left as null is
 * simply not shown on the public page.
 *
 * Review before publishing (not rendered anywhere):
 *  - effectiveDate / lastUpdated: only set after the organization approves the policy.
 *  - contact details: reuse your existing site config if you have one.
 *  - cookies, analytics, hosting location, retention periods: confirm each
 *    statement in the sections below matches what the site actually does.
 *  - payment methods and anonymous/named donor options: confirm they match the donation form.
 */

export const policyConfig = {
  organizationName: "Proyash",
  effectiveDate: null, // e.g. "1 January 2026"
  lastUpdated: null, // e.g. "1 January 2026"
  contact: {
    email: null,
    phone: null,
    address: null,
  },
  // Adjust to the real routes in your project; set to null to hide a link.
  routes: {
    home: "/",
    contact: "/contact",
    donation: "/donation",
    terms: "/terms-of-service",
    refund: "/refund-policy",
  },
};

export const policySections = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      { type: "p", text: "This Privacy Policy explains how Proyash Songgothon handles information when you visit our website, contact us, or submit donation information. It applies to information handled through this website and to website-related communications." },
      { type: "p", text: "We aim to collect only the information we need, to explain why we need it, and to handle it with care. By using this website, you acknowledge the practices described here. If you do not agree with them, please do not submit personal information through the website." },
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    blocks: [
      { type: "p", text: "The information we collect depends on how you use the website. We describe only the categories below that apply to features the website offers." },
      { type: "h3", text: "Information you provide" },
      { type: "ul", items: [
        "Your name, email address, and phone number.",
        "Messages you send through the contact form.",
        "Details you voluntarily submit through other website forms, such as a volunteer inquiry.",
      ] },
      { type: "h3", text: "Donation information" },
      { type: "p", text: "When you submit a donation, we may collect:" },
      { type: "ul", items: [
        "The donation amount, selected payment method, and donation purpose.",
        "A payment transaction reference or transaction ID.",
        "Your name, if provided, and the contact details needed to verify the donation.",
        "Whether you want to appear as a named or anonymous donor, and your consent for public display.",
        "Submission and verification records.",
      ] },
      { type: "p", text: "Payment verification may need limited personal information even if you choose to appear publicly as anonymous." },
      { type: "note", text: "We never ask donors for a payment PIN, OTP, password, or account login credentials. If anyone asks you for these in connection with a donation, do not share them." },
      { type: "h3", text: "Technical information" },
      { type: "p", text: "Our website and hosting environment may automatically record basic technical information, such as browser type, device information, IP address, server logs, request timestamps, and diagnostic information. This helps us keep the website working and secure." },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    blocks: [
      { type: "p", text: "We use information for purposes connected to running the organization and the website, including:" },
      { type: "ul", items: [
        "Responding to your inquiries.",
        "Processing and verifying manual donation submissions.",
        "Maintaining donation records and financial accountability.",
        "Respecting donor anonymity and publication preferences.",
        "Publishing authorized donor records.",
        "Improving website functionality and security.",
        "Preventing fraud, duplicate submissions, and misuse.",
        "Meeting applicable legal obligations.",
      ] },
      { type: "p", text: "We do not use your personal information for unrelated advertising, and we do not sell it." },
    ],
  },
  {
    id: "donations-and-payment-information",
    title: "Donations and Payment Information",
    blocks: [
      { type: "p", text: "Donations are made through manual payment methods. Depending on what is currently available, these may include bKash, Rocket, Nagad, bank transfer, and other methods the organization enables. Available methods may change over time." },
      { type: "p", text: "You make the payment through your chosen provider, then submit a transaction reference on the website so we can verify it. This website does not process card payments and does not store payment credentials." },
      { type: "h3", text: "Donation statuses" },
      { type: "ul", items: [
        "Submitted: we have received your donation details but have not checked them.",
        "Pending verification: we are checking your submission against our payment records.",
        "Confirmed: the payment has been verified and recorded as a donation.",
        "Rejected or refunded: the submission could not be verified, or the payment was returned, where applicable.",
      ] },
      { type: "p", text: "Submitting a transaction ID does not guarantee that your payment will be confirmed. Authorized personnel may need to access your submission details to verify payments and keep records." },
    ],
  },
  {
    id: "anonymous-donations-and-public-donor-records",
    title: "Anonymous Donations and Public Donor Records",
    blocks: [
      { type: "p", text: "When you donate, you may be able to choose between a named public donation and an anonymous public donation. Only the options shown on the donation form are available." },
      { type: "p", text: "If you choose anonymous display:" },
      { type: "ul", items: [
        "The public donor list shows “Anonymous Donor” instead of your name.",
        "Your private details are not shown in public records.",
        "Phone numbers, email addresses, transaction IDs, payment evidence, and internal verification notes are never included in public donor listings.",
      ] },
      { type: "p", text: "If you choose a named donation, your name may appear in the public donor list, based on the consent you give when submitting the form." },
      { type: "p", text: "Anonymity in public display does not mean we cannot know who you are. Authorized personnel may still see your identity for verification and recordkeeping, and your payment provider will have its own records of the transaction. We cannot promise complete anonymity." },
    ],
  },
  {
    id: "cookies-and-similar-technologies",
    title: "Cookies and Similar Technologies",
    blocks: [
      { type: "p", text: "Cookies are small files stored on your device. This website uses only cookies and similar technologies that are necessary for it to work, such as maintaining basic site functionality and security." },
      { type: "p", text: "We do not use advertising or tracking cookies. If we introduce analytics or other optional tools in the future, we will update this policy to say what they are and why we use them. You can control or delete cookies through your browser settings, though blocking essential cookies may affect how the site works." },
    ],
  },
  {
    id: "information-sharing-and-disclosure",
    title: "Information Sharing and Disclosure",
    blocks: [
      { type: "p", text: "We share personal information only where appropriate. This may include sharing with:" },
      { type: "ul", items: [
        "Authorized personnel who verify donations or respond to inquiries.",
        "Hosting and infrastructure providers that help us operate the website.",
        "Payment service providers involved in the manual payment you made.",
        "Other service providers needed to run genuine website features.",
        "Relevant authorities, where we are legally required to disclose information.",
      ] },
      { type: "p", text: "We do not sell personal information. Because third-party providers are involved in running the website and in payments, we cannot say that your information is never shared with anyone outside the organization." },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    blocks: [
      { type: "p", text: "We keep information only for as long as reasonably necessary for the purposes it was collected for, and as required by applicable obligations and legitimate recordkeeping needs. Different kinds of information may be kept for different lengths of time, including:" },
      { type: "ul", items: [
        "Contact messages.",
        "Donation submissions.",
        "Confirmed donation records.",
        "Financial accounting records.",
        "Technical and security logs.",
      ] },
      { type: "p", text: "Deletion may be limited where we must keep records for accounting, security, dispute-resolution, or legal purposes. Where we can delete information on request, we will do so as described in the section on your privacy choices." },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    blocks: [
      { type: "p", text: "We take reasonable steps to protect information, such as restricting access to payment verification records and private donor information to authorized personnel, and using secure connections (HTTPS) for the website." },
      { type: "p", text: "Reasonable safeguards reduce risk, but no method of internet transmission or electronic storage can guarantee absolute security. Please contact us promptly if you believe your information has been misused." },
    ],
  },
  {
    id: "your-privacy-choices-and-rights",
    title: "Your Privacy Choices and Rights",
    blocks: [
      { type: "p", text: "You can contact us to:" },
      { type: "ul", items: [
        "Ask for access to the personal information we hold about you.",
        "Ask us to correct inaccurate details.",
        "Ask questions about how your information is used.",
        "Ask us to remove or change how you appear in the public donor list.",
        "Ask us to delete your information, where we are permitted to.",
      ] },
      { type: "p", text: "We cannot always fulfill every request. Verified financial records may need to be kept for recordkeeping even if you change your public display preference. We may need to confirm your identity before acting on a request. Requests are handled by contacting us directly; there is no automated privacy settings page." },
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    blocks: [
      { type: "p", text: "This website is not intended to collect personal information directly from children. If our activities involve children or educational support, we avoid publishing children's names, identifying details, or photographs without appropriate authorization and consent." },
      { type: "p", text: "If you are a parent or guardian, or an appropriate representative, and have a privacy concern about a child's information, please contact us using the details at the end of this policy." },
    ],
  },
  {
    id: "third-party-services-and-external-links",
    title: "Third-Party Services and External Links",
    blocks: [
      { type: "p", text: "Our website may link to external platforms, such as social media sites and payment providers. Those services have their own privacy practices and terms, and Proyash Songgothon does not control them. We encourage you to read their policies before sharing information with them." },
    ],
  },
  {
    id: "international-data-transfers",
    title: "International Data Transfers",
    blocks: [
      { type: "p", text: "Our hosting and service providers may process information in countries other than where you live, depending on how they operate. Where this happens, information may be transferred and handled under the laws that apply to those providers. We do not guarantee that all information stays within Bangladesh." },
    ],
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    blocks: [
      { type: "p", text: "We may update this policy when our website features, data practices, or legal obligations change. When we do, we will update the “Last updated” date shown at the top of this page. Please review this page from time to time." },
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    blocks: [
      { type: "p", text: "If you have questions about this Privacy Policy or how your information is handled, please contact Proyash Songgothon using the details below." },
    ],
  },
];
