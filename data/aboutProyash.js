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
    "Humanity is our inspiration, and collective action is our strength.",
    "Proyash is a youth-led voluntary organization dedicated to upholding humanitarian values, supporting disadvantaged and underprivileged communities, promoting education and social awareness, protecting the environment, and nurturing the younger generation into responsible leaders.",
    "We believe that positive social change cannot be achieved through individual efforts alone, but rather through a shared sense of responsibility, empathy, and sustained collective initiatives.",
    "Alongside our commitment to serving humanity, Proyash creates opportunities for young people to develop their skills, leadership abilities, creativity, and sense of social responsibility. Through active community participation, environmental stewardship, and collective initiatives, we aspire to build a society where everyone has the opportunity to move forward with dignity, equality, and the freedom to realize their full potential.",
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
  title: "Our Areas of Work",
  subtitle: "",
  intro: "The areas we aspire to focus on.",
  isDraft: false,
  items: [
    {
      icon: "handHeart",
      title: "Education and Awareness:",
      description:
        "Organizing educational programmes, awareness sessions, and participatory activities to enhance students' knowledge, social awareness, and positive values.",
    },
    {
      icon: "graduationCap",
      title: "Healthcare and Public Health:",
      description:
        "Contributing to community health and well-being through free medical camps, health screenings, health awareness initiatives, and voluntary blood donation programmes.",
    },
    {
      icon: "handshake",
      title: "Humanitarian Assistance and Social Welfare:",
      description:
        "Supporting disadvantaged and underprivileged communities through winter clothing distribution, Eid gift initiatives, iftar arrangements for working communities, and needs-based humanitarian assistance.",
    },
    {
      icon: "usersRound",
      title: "Environmental Conservation and Climate Initiatives:",
      description:
        "Promoting environmentally responsible practices and youth engagement through tree plantation drives, cleanliness campaigns, environmental education, waste management initiatives, and programmes such as Proyash Green Generation.",
    },
    {
      icon: "usersRound",
      title: "Youth Development and Leadership:",
      description:
        "Creating opportunities for young people to develop their skills and leadership capabilities through volunteerism, mentorship, teamwork, training, and participation in practical community projects.",
    },
    {
      icon: "usersRound",
      title: "Equality and Social Inclusion:",
      description:
        "Raising awareness and undertaking collaborative initiatives to promote the rights, dignity, equal opportunities, and social participation of children with special needs, persons with disabilities, and marginalized communities.",
    },
  ],
};

/* Section 4 — Vision & Mission (DRAFT — not official policy) */
export const vision = {
  label: "Our Vision",
  labelEn: "",
  icon: "eye",
  isDraft: false,
  text: "To help build a compassionate, equitable, and sustainable society where every individual can live with dignity and equal opportunities, communities are socially aware and empowered, young people lead positive change, and humanity and nature thrive in harmony.",
};

export const mission = {
  label: "Our Mission",
  labelEn: "",
  icon: "target",
  isDraft: false,
  text: "To serve communities through meaningful humanitarian initiatives, promote education and social awareness, support accessible healthcare, protect the environment, and empower young people through leadership, skill development, and active community engagement.",
};

export const draftBadgeLabel = "Draft — Awaiting Approval";

/* Section 5 — Core values */
export const coreValues = {
  id: "core-values",
  title: "Our Core Values",
  subtitle: "",
  intro:
    "The principles that guide every initiative, decision, and action undertaken by Proyash.",
  isDraft: false,
  items: [
    {
      icon: "shieldCheck",
      title: "Integrity and Accountability",
      titleEn: "Integrity and Accountability",
      description:
        "Practising transparency, honesty, responsibility, and ethical conduct in every action while ensuring the proper use of resources.",
    },
    {
      icon: "heart",
      title: "Humanity and Empathy",
      titleEn: "Humanity and Empathy",
      description:
        "Understanding the hardships of others and standing beside those in need with dignity, compassion, and sincerity.",
    },
    {
      icon: "handshake",
      title: "Equality and Inclusion",
      titleEn: "Equality and Inclusion",
      description:
        "Ensuring dignity, equal opportunities, and meaningful participation for all, regardless of religion, socioeconomic background, gender, or personal identity.",
    },
    {
      icon: "badgeCheck",
      title: "Volunteerism and Collective Action",
      titleEn: "Volunteerism and Collective Action",
      description:
        "Contributing time, effort, skills, and resources to the welfare of society, placing collective well-being above personal interests.",
    },
    {
      icon: "scanEye",
      title: "Youth Leadership and Empowerment",
      titleEn: "Youth Leadership and Empowerment",
      description:
        "Creating opportunities for young people to develop their ideas, creativity, skills, and decision-making abilities while encouraging responsible leadership",
    },
    {
      icon: "Award",
      title: "Education and Awareness",
      titleEn: "Education and Awareness",
      description:
        "Promoting access to education, encouraging lifelong learning, and raising awareness of important social, humanitarian, and environmental issues.",
    },
    {
      icon: "UsersRound",
      title: "Respect and Human Dignity",
      titleEn: "Respect and Human Dignity",
      description:
        "Recognizing the inherent worth of every individual and treating everyone with fairness, dignity, kindness, and respect.",
    },
    {
      icon: "Users",
      title: "Sustainable Development and Environmental Responsibility",
      titleEn: "Sustainable Development and Environmental Responsibility",
      description:
        "Meeting present needs while protecting natural resources and preserving a safe, clean, and sustainable environment for future generations.",
    },
    {
      icon: "MessageCircleCheck",
      title: "Commitment and Perseverance:",
      titleEn: "Education and Awareness",
      description:
        "Maintaining dedication, consistency, and determination in pursuing our objectives and fulfilling our responsibilities towards society.",
    },
  ],
};


export const founder = [
  {
    id: 1,
    name: "Alif Siddique Taj",
    designation: "Founder & President",
    portrait: {
      src: "/images/about/taz1.jpeg", // e.g. "/images/founder.jpg" (file must exist in /public)
      width: 800,
      height: 1000,
      alt: "Portrait of the founder of Proyash", // update with the founder's name
    },
    isPlaceholder: false,
    placeholderNotice: "",
    bio: [],
    purposeNote: "",
    socialLinks: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/tiptap.taj",
      },
      {
        label: "Linkedin",
        href: "https://www.linkedin.com/in/md-soa-alif-siddique-taj-86993b225",
      },
    ],
  },
  {
    id: 2,
    name: "Md Selim Talukdar",
    designation: "Founder & General Secretary",
    portrait: {
      src: "/images/about/selim.jpg", // e.g. "/images/founder.jpg" (file must exist in /public)
      width: 800,
      height: 1000,
      alt: "Portrait of the founder of Proyash", // update with the founder's name
    },
    isPlaceholder: false,
    placeholderNotice: "",
    bio: [],
    purposeNote: "",
    socialLinks: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/selimtalukdar99",
      },
      {
        label: "Linkedin",
        href: "https://www.linkedin.com/in/selim-talukder-298059235",
      },
    ],
  },
];


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
  isDraft: false,
  items: [
    {
      title: "Respect for People",
      description:
        "Valuing everyone's opinions, dignity, and individual circumstances.",
    }
  ],
};

/* Section 9 — Call to action */
export const cta = {
  headline: "Join Us in Our Proyash",
  text: "Your participation can be an important step toward creating positive change.",
  primary: {
    label: "Get Involved",
    href: "/volunteer", // TODO: replace with the real join/volunteer route
  },
  secondary: {
    label: "Contact Us",
    href: "/contact", // TODO: replace with the real contact route
  },
};


export const organizationStory = {
  id: "our-story",
  eyebrow: "Our Story",
  title: "প্রয়াসের পথচলার গল্প: একটি ছোট উদ্যোগ থেকে মানবতার পথে",
  subtitle: "",
  image: "/images/about/rafi.png",
  imageAlt: "Proyash volunteers working with the community",
  lekhok: "লেখক",
  imageCaption: "শাহরিয়ার রাফি",
  paragraphs: [
    "প্রয়াসের পথচলার গল্পটি মূলত এক কাকতালীয় ঘটনার মধ্য দিয়ে শুরু হলেও, আজ মনে হয়, সৃষ্টিকর্তার ইচ্ছায় কোনো একটি মহৎ উদ্দেশ্য বাস্তবায়নের উছিলা হিসেবেই এই যাত্রার সূচনা হয়েছিল।",
    "প্রয়াসের আনুষ্ঠানিক পথচলার শুরু ২০২৪ সালের মে মাসে। তখন সারা দেশে তীব্র তাপপ্রবাহ চলছিল, জারি হয়েছিল হিট অ্যালার্ট। এমন পরিস্থিতিতে আমাদের পরিচিত একজন বড় ভাই বাসস্ট্যান্ডে সাধারণ মানুষের মাঝে বিশুদ্ধ পানি ও খাবার স্যালাইন বিতরণের পরামর্শ দেন। মানবিক এই উদ্যোগে সাড়া দিয়ে এগিয়ে আসেন প্রয়াসের বর্তমান সভাপতি ও প্রতিষ্ঠাকালীন সভাপতি আলিফ সিদ্দিকী তাজ, সাধারণ সম্পাদক সেলিম তালুকদার এবং বর্তমান যুগ্ম সাধারণ সম্পাদক শাহরিয়ার রাফি। তাঁদের সম্মিলিত প্রচেষ্টায় সফলভাবে সম্পন্ন হয় পানি ও খাবার স্যালাইন বিতরণ কর্মসূচি।",
    "েদিন হয়তো আমরা কল্পনাও করিনি, ছোট্ট এই উদ্যোগই একদিন একটি সামাজিক সংগঠনের ভিত্তি হয়ে উঠবে। অথচ ঠিক সেই দিনটিতেই রোপিত হয়েছিল প্রয়াসের বীজ। এই মানবিক কার্যক্রমের মধ্য দিয়েই আমরা তিনজন একে অপরের সঙ্গে পরিচিত হই, তৈরি হয় পারস্পরিক বোঝাপড়া ও মানবসেবার প্রতি এক অভিন্ন দায়বদ্ধতা।",
    "পরদিন সাধারণ সম্পাদক সেলিম তালুকদারের উদ্যোগে সভাপতি আলিফ সিদ্দিকী তাজ ও যুগ্ম সাধারণ সম্পাদক শাহরিয়ার রাফি একত্রিত হন। আলোচনার একপর্যায়ে সেলিম তালুকদার একটি সম্পূর্ণ অরাজনৈতিক, স্বেচ্ছাসেবী ও সামাজিক সংগঠন গড়ে তোলার প্রস্তাব দেন। মানবতার কল্যাণে একসঙ্গে কাজ করার স্বপ্ন থেকে আমরা তিনজনই সানন্দে সেই প্রস্তাবে সম্মতি জানাই। আর এভাবেই আমাদের সম্মিলিত চিন্তা, স্বপ্ন ও প্রত্যয়ের মধ্য দিয়ে উত্তর টাঙ্গাইলে যাত্রা শুরু করে একটি সম্ভাবনাময় সামাজিক সংগঠন— ‘প্রয়াস’।",
    "এরপর প্রয়াসের সাংগঠনিক ভিত্তি আরও সুদৃঢ় হয় বর্তমান যুগ্ম সাধারণ সম্পাদক আনাসের যুক্ত হওয়ার মধ্য দিয়ে। ধীরে ধীরে বিভিন্ন সামাজিক ও মানবিক কার্যক্রম, স্বেচ্ছাসেবামূলক উদ্যোগ এবং মানুষের পাশে দাঁড়ানোর মধ্য দিয়ে প্রয়াস এগিয়ে যেতে থাকে নিজস্ব গতিতে। সময়ের সঙ্গে সঙ্গে মধুপুরবাসীর আস্থা, ভালোবাসা ও বিশ্বাসের একটি জায়গা হয়ে ওঠে প্রয়াস।",
    "আমাদের এই পথচলা কেবল একটি সংগঠন প্রতিষ্ঠার গল্প নয়; এটি কয়েকজন তরুণের স্বপ্ন, কিছু নিঃস্বার্থ মানুষের সম্মিলিত প্রচেষ্টা এবং মানবতার জন্য কাজ করার দৃঢ় অঙ্গীকারের গল্প। একটি ছোট উদ্যোগ থেকে শুরু হওয়া এই যাত্রা আজ অনেক বড় স্বপ্ন দেখার সাহস জোগায়। প্রতিটি কার্যক্রম, প্রতিটি হাসিমুখ এবং মানুষের পাশে দাঁড়ানোর প্রতিটি মুহূর্ত আমাদের সামনে এগিয়ে চলার অনুপ্রেরণা।",
    "এরপরের ইতিহাস সবারই জানা। নানা চড়াই-উতরাই পেরিয়ে প্রয়াস আজ ছুটে চলেছে আপন গতিতে। আমাদের বিশ্বাস, এই পথচলা থেমে যাওয়ার নয়; বরং সময়ের সঙ্গে সঙ্গে আরও বিস্তৃত হবে প্রয়াসের কার্যক্রম, আরও অনেক মানুষের হৃদয়ে জায়গা করে নেবে এই সংগঠন।",
    "প্রয়াস এগিয়ে যাবে, মানবতার জয়গান গাইবে, মানুষের পাশে দাঁড়াবে—আজ, আগামীকাল এবং আগামীর প্রতিটি দিনে।",
    "জয় হোক মানবতার।",
    "হাত ও হৃদয় মানবতার জন্য।",
    "প্রয়াস—মানবতার পথে এক অবিরাম যাত্রা।",
    "⸻",
  ],
  highlights: [
    "লেখক",
    "শাহরিয়ার রাফি",
    "যুগ্ম সাধারণ সম্পাদক ও প্রতিষ্ঠাকালীন সাংগঠনিক সম্পাদক, প্রয়াস টিম",
    "15-11-2026",
  ],
};

