/**
 * ============================================================================
 * data/aboutProyash.js — single source of truth for the About page content.
 * ============================================================================
 * Every Bengali string shown on /about lives here. Edit this file only.
 *
 * IMPORTANT — what must be supplied by the real organisation:
 *   1. founder.name, founder.designation, founder.bio, founder.purposeNote
 *   2. founder.portrait (put a real file in /public and set src/width/height)
 *   3. founder.socialLinks (only add REAL urls; empty array hides the row)
 *   4. founderMessage.paragraphs (the founder's own words)
 *   5. Review/approve vision, mission, goals, values, commitments
 *      (each carries `isDraft: true` until you flip it to false)
 *   6. All `href` values marked TODO — confirm they match real routes
 *
 * Icons are referenced by string key (see components/about/iconMap.js)
 * so this file stays plain, serialisable data.
 * ============================================================================
 */

export const aboutMeta = {
  title: "About Us | Proyash",
  description:
    "Learn what Proyash is, why it began its journey, and the values and goals that guide our efforts to create positive social change.",
};

/* Section 1 — Hero */
export const hero = {
  eyebrow: "ABOUT PROYASH",
  headline: "Our Endeavor for a Brighter Tomorrow",
  // DRAFT copy — replace with approved wording.
  intro:
    "Proyash is an initiative that believes standing beside people, learning together, and working collectively can lay the foundation for positive social change. Guided by honesty, humanity, and collaboration, we aspire to move forward together.",
  primaryCta: {
    label: "Learn About Us",
    href: "#who-we-are", // anchor on this page — always valid
  },
  secondaryCta: {
    label: "Explore Our Activities",
    href: "/", // TODO: replace with the real activities/programs route
  },
  visualAlt:
    "A symbolic illustration of people connected in a circle, representing collective effort",
};

/* Section 2 — Who we are */
export const organizationIntro = {
  id: "who-we-are",
  title: "Who We Are",
  subtitle: "About Proyash",
  // DRAFT copy — replace with the organisation's own description.
  paragraphs: [
    "Proyash is a community-oriented initiative with people at its heart. We believe that every person has potential and needs only the right support, opportunities, and an environment built on trust to grow.",
    "This initiative is for those who want to learn, move forward, or stand beside others. We aspire to build a society where everyone feels valued and included.",
    "Through small initiatives and collective efforts, we aim to gradually move toward positive social change.",
  ],
  visualAlt:
    "A symbolic illustration of people climbing upward step by step, representing growth and progress",
  highlights: [
    {
      icon: "heartHandshake",
      title: "Human Values",
      description:
        "Placing human dignity, compassion, and empathy at the heart of everything we do.",
    },
    {
      icon: "users",
      title: "Collective Action",
      description:
        "Believing that meaningful change becomes possible when we work together rather than alone.",
    },
    {
      icon: "sprout",
      title: "Positive Change",
      description:
        "Creating opportunities for lasting, positive change through small but meaningful steps.",
    },
  ],
};

/* Section 3 — Goals */
export const goals = {
  id: "goals",
  title: "Our Goals",
  subtitle: "",
  intro: "The areas we aspire to focus on.",
  isDraft: true,
  items: [
    {
      icon: "handHeart",
      title: "Working for People's Well-Being",
      description:
        "Standing beside people when they need support and participating in initiatives that promote well-being.",
    },
    {
      icon: "graduationCap",
      title: "Education, Awareness, and Skill Development",
      description:
        "Expanding access to learning and awareness to help people become more independent and self-reliant.",
    },
    {
      icon: "handshake",
      title: "Collaboration and Human Values",
      description:
        "Encouraging mutual support, cooperation, and compassionate behavior within society.",
    },
    {
      icon: "usersRound",
      title: "A Positive and Inclusive Environment",
      description:
        "Building an environment where everyone can participate with equal dignity and respect.",
    },
  ],
};

/* Section 4 — Vision & Mission (DRAFT — not official policy) */
export const vision = {
  label: "Our Vision",
  labelEn: "",
  icon: "eye",
  isDraft: true,
  text: "A compassionate, educated, and inclusive society where every person has the opportunity to develop their potential and where collective efforts help create a brighter tomorrow.",
};

export const mission = {
  label: "Our Mission",
  labelEn: "",
  icon: "target",
  isDraft: true,
  text: "To work for people's well-being with honesty and transparency, expand opportunities for education and awareness, and move forward together by fostering a spirit of collaboration.",
};

export const draftBadgeLabel = "Draft — Awaiting Approval";

/* Section 5 — Core values */
export const coreValues = {
  id: "core-values",
  title: "Our Core Values",
  subtitle: "",
  intro: "The principles that guide our journey.",
  isDraft: true,
  items: [
    {
      icon: "shieldCheck",
      title: "Integrity",
      titleEn: "Integrity",
      description:
        "Being honest in our words and actions while honoring the trust others place in us.",
    },
    {
      icon: "heart",
      title: "Humanity",
      titleEn: "Humanity",
      description:
        "Treating every person with compassion, empathy, and respect.",
    },
    {
      icon: "handshake",
      title: "Collaboration",
      titleEn: "Collaboration",
      description:
        "Supporting one another and working together to achieve shared goals.",
    },
    {
      icon: "badgeCheck",
      title: "Responsibility",
      titleEn: "Responsibility",
      description:
        "Taking ownership of our work and completing our responsibilities with care.",
    },
    {
      icon: "scanEye",
      title: "Transparency",
      titleEn: "Transparency",
      description:
        "Keeping our work and decisions open, clear, and understandable to everyone.",
    },
    {
      icon: "usersRound",
      title: "Inclusivity",
      titleEn: "Inclusivity",
      description:
        "Welcoming everyone regardless of religion, ethnicity, gender, or identity.",
    },
  ],
};

/* Section 6 — Founder profile
 * ⚠️ ALL values below are PLACEHOLDERS. Do not publish until replaced with
 * the founder's real information. Nothing here is a factual claim.
 */
export const founder = {
  id: "founder",
  title: "Meet Our Founder",
  subtitle: "",
  isPlaceholder: true, // set to false once real data is filled in
  name: "[Enter the Founder's Full Name]",
  designation: "[Enter the Official Designation, e.g., Founder]",
  // Replace with a real biography supplied by the founder.
  bio: [
    "[Write a brief biography of the founder here. Include education, professional experience, and community involvement only when supported by verified information.]",
  ],
  // Short "why Proyash exists" note in the founder's own words.
  purposeNote:
    "[In 2–3 sentences, explain in the founder's own words why Proyash was established and what it hopes to achieve.]",
  portrait: {
    src: null, // e.g. "/images/founder.jpg" (file must exist in /public)
    width: 800,
    height: 1000,
    alt: "Portrait of the founder of Proyash", // update with the founder's name
  },
  // Only add links with REAL urls, e.g. { label: "Facebook", href: "https://..." }
  socialLinks: [],
  placeholderNotice: "Placeholder — Add Verified Information",
};

/* Section 7 — Founder's message */
export const founderMessage = {
  id: "founder-message",
  title: "A Word from Our Founder",
  subtitle: "",
  isPlaceholder: true, // set to false once the official message is provided
  placeholderNotice:
    "Draft Placeholder — This Is Not the Founder's Actual Statement",
  // Replace with the founder's authentic message. One string per paragraph.
  paragraphs: [
    "[Insert the message written or approved by the founder here.]",
    "[Add the founder's personal thoughts about Proyash's purpose, vision, and invitation to others, using their own words.]",
  ],
};

/* Section 8 — Commitments */
export const commitments = {
  id: "commitments",
  title: "Our Commitment",
  subtitle: "",
  intro: "The principles we aspire to uphold throughout our journey.",
  isDraft: true,
  items: [
    {
      title: "Respect for People",
      description:
        "Valuing everyone's opinions, dignity, and individual circumstances.",
    },
    {
      title: "Acting Responsibly",
      description:
        "Striving to complete every task we undertake with sincerity, care, and dedication.",
    },
    {
      title: "Moving Forward Together",
      description:
        "Working hand in hand and ensuring that everyone has the opportunity to move forward with us.",
    },
    {
      title: "Maintaining Transparency",
      description:
        "Being open and clear about our initiatives, activities, and decisions.",
    },
  ],
};

/* Section 9 — Call to action */
export const cta = {
  headline: "Join Us in Our Proyash",
  text: "Your participation can be an important step toward creating positive change.",
  primary: {
    label: "Get Involved",
    href: "/", // TODO: replace with the real join/volunteer route
  },
  secondary: {
    label: "Contact Us",
    href: "/", // TODO: replace with the real contact route
  },
};
