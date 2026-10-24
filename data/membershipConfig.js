import { donationConfig } from "@/data/donationConfig";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * MEMBERSHIP / AUTH CONFIGURATION (public, non-secret).
 *
 * NO backend, authentication system or API client exists in this project yet, so every endpoint is
 * EMPTY on purpose. While empty, the pages work as previews and say so; nothing is sent, stored or faked.
 * No endpoint paths have been invented. Fill these in to match the real Laravel API.
 *
 * CONTRACTS THE FRONTEND EXPECTS (adapt either side as needed):
 *
 *  endpoints.apply   POST  multipart/form-data   (account + application in ONE request)
 *      fields (snake_case): full_name_bn, full_name_en, father_name, mother_name, date_of_birth (YYYY-MM-DD),
 *        nationality, religion, occupation, gender, marital_status, educational_qualification, blood_group,
 *        mobile_number, email, permanent_village|post_office|upazila|district, present_village|post_office|
 *        upazila|district, password, password_confirmation, membership_agreement_accepted,
 *        privacy_policy_accepted, terms_accepted, declaration_accepted (each "1"), client_request_id,
 *        profile_photo (file, optional). Empty optional fields are omitted.
 *      201/200 -> optional JSON { "reference": "<backend reference>", "status": "pending" }
 *      422     -> Laravel shape { "message": "...", "errors": { "email": ["..."] } }  (e.g. duplicate email)
 *      429     -> rate limited
 *      The server must create the user + application in ONE DB transaction, hash the password, force
 *      status = "pending", and ignore any status/role sent by the browser.
 *
 *  endpoints.login   POST  JSON { email, password }
 *      200 -> JSON { "status": "pending" | "approved" | "rejected" | "suspended" }  (read from the DB, never from the client)
 *      401/422 -> invalid credentials; 429 -> too many attempts
 *
 *  endpoints.status  GET   (authenticated session)
 *      200 -> JSON { "status": "...", "reference"?: "...", "submitted_at"?: "ISO date" }   401 -> not signed in
 *      Must only ever return the CURRENT user's own application.
 *
 * Session/cookie handling is whatever the Laravel setup uses; requests send credentials via `credentials`.
 * Never put tokens, passwords or secrets in this file.
 */


export const membershipConfig = {
  endpoints: {
    apply: API_URL ? `${API_URL}/membership/apply` : "",
    login: API_URL ? `${API_URL}/login` : "",
    status: API_URL ? `${API_URL}/membership/status` : "",
  },
  credentials: "include",
  memberDashboardHref: "/member",
};
