import { donationConfig } from "@/data/donationConfig";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const membershipConfig = {
  endpoints: {
    apply: `${API_URL}/register`,
    login: `${API_URL}/login`,
    status: null,
  },

  credentials: "omit",

  memberDashboardHref: "/member",

  privacyPolicyHref: donationConfig.privacyPolicyHref,

  termsHref: null,

  photo: {
    maxBytes: 2 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp"],
    labels: "JPG, PNG or WebP",
  },

  password: {
    minLength: 8,
    maxLength: 128,
  },
};
