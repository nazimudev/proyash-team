// Centralized, editable contact content.
// Leave a value as null (or an empty array) to hide that element on the page.

export const organization = {
  name: "Proyash",
  nameBn: "প্রয়াস",
  location: "Madhupur, Tangail, Bangladesh",
  mapQuery: "Madhupur, Tangail, Bangladesh",
};

// TODO: Fill in only verified details supplied by the organization.
export const contactDetails = {
  email: "hello@proyashteam.org", // e.g. "hello@example.org"
  phone: "+880 1782-334455", // e.g. "+880 1XXX-XXXXXX"
  privacyPolicyHref: "/privacy-policy", // e.g. "/privacy-policy" (only once the page exists)
};

// Only verified social links. An empty array hides the card.
export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/proyas3524" },
];

export const hero = {
  eyebrow: "GET IN TOUCH",
  title: "We'd Love to Hear From You",
  description:
    "Have a question, an idea, or want to be part of something meaningful? Reach out to Proyash Songgothon. We'd love to hear from you.",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Contact", href: null },
  ],
};

export const infoCards = {
  location: {
    title: "Our Location",
    description: "Madhupur, Tangail, Bangladesh",
  },
  email: {
    title: "Email Us",
    description: "Have a question? Send us a message.",
  },
  phone: {
    title: "Call Us",
    description: "Need assistance? We'd be happy to hear from you.",
  },
  social: {
    title: "Connect With Us",
    description: "Follow our journey and stay connected with our community.",
  },
};

export const formCopy = {
  heading: "Let's Start a Conversation",
  description:
    "Whether you have a question, a collaboration idea, or want to volunteer, send us a message and we'll review it.",
  reassurance:
    "You can reach out about general questions, partnerships, volunteering, or community initiatives.",
};

export const subjectOptions = [
  "General Inquiry",
  "Volunteering",
  "Partnership",
  "Community Initiative",
  "Other",
];

export const faqItems = [
  {
    question: "How can I get involved with Proyash?",
    answer:
      "You can contact us to express your interest in volunteering or participating in our community initiatives.",
  },
  {
    question: "Can I propose a community initiative?",
    answer:
      "Yes. You can share your idea through the contact form so the team can review it.",
  },
  {
    question: "How can I discuss a partnership?",
    answer:
      "Select Partnership in the contact form and provide details about your proposal.",
  },
  {
    question: "Where is Proyash located?",
    answer:
      "Proyash is associated with Madhupur, Tangail, Bangladesh. Please contact the organization for verified meeting or office details.",
  },
];

// TODO: Confirm these routes exist in the project before launch.
export const cta = {
  title: "Together, We Can Make a Difference",
  description:
    "Every meaningful initiative begins with a conversation. Connect with Proyash and explore how we can work together toward positive change.",
  primary: { label: "Explore Our Work", href: "/our-work" },
  secondary: { label: "Get Involved", href: "/get-involved" },
};
