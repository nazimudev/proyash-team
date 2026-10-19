// SAMPLE DATA ONLY. Fictional applicants for UI development; none of these are real people or real counts.
// Field names follow the Add Member form (snake_case). ASSUMPTIONS to confirm against the real Join Proyash form
// and Laravel model: the status values ("pending" | "approved" | "rejected"), the *_accepted_at consent fields,
// and the reviewed_* fields. Passwords and other secrets are intentionally never part of this shape.
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const bn = (n) =>
  String(n)
    .padStart(2, "0")
    .split("")
    .map((d) => BN_DIGITS[d])
    .join("");
const pad = (n, w = 2) => String(n).padStart(w, "0");

const MARITAL = ["Single", "Married", "Single", "Widowed", "Married"];
const OCCUPATION = [
  "Student",
  "Teacher",
  "Small business",
  "Farmer",
  "Service holder",
];
const EDUCATION = [
  "HSC",
  "Bachelor's degree",
  "SSC",
  "Master's degree",
  "Diploma",
];
const GENDER = ["Female", "Male", null, "Male", "Female"];
const BLOOD = ["A+", null, "O+", "B+", null];
const RELIGION = ["Islam", "Hinduism", null, "Islam", "Buddhism"];
const DISTRICT = ["Tangail", "Mymensingh", "Gazipur", "Sirajganj", "Jamalpur"];

function build(i) {
  const status = i <= 11 ? "pending" : i <= 13 ? "approved" : "rejected";
  const day = pad(1 + ((i * 3) % 16)); // keeps every sample date in the past
  const submitted = `2026-${i <= 6 ? "09" : "10"}-${day}`;
  const k = i % 5;
  const same = i % 2 === 0;
  const perm = {
    village: `Sample Village ${i}`,
    post_office: `Sample PO ${i}`,
    upazila: `Sample Upazila ${k + 1}`,
    district: DISTRICT[k],
  };
  const present = same
    ? perm
    : {
        village: `Sample Town ${i}`,
        post_office: `Sample City PO ${i}`,
        upazila: "Sample Sadar",
        district: "Dhaka",
      };
  const reviewed = status !== "pending";
  return {
    id: `APP-${pad(i, 4)}`,
    status,
    submitted_at: submitted,
    full_name_bn: `নমুনা আবেদনকারী ${bn(i)}`,
    full_name_en: `Sample Applicant ${pad(i)}`,
    father_name: `Sample Father ${pad(i)}`,
    mother_name: `Sample Mother ${pad(i)}`,
    date_of_birth: `${1985 + (i % 15)}-0${1 + (i % 9)}-1${i % 9}`,
    nationality: "Bangladeshi",
    religion: RELIGION[k],
    gender: GENDER[k],
    marital_status: MARITAL[k],
    occupation: OCCUPATION[k],
    educational_qualification: EDUCATION[k],
    blood_group: BLOOD[k],
    mobile_number: `0180000${pad(i, 4)}`,
    email: i % 3 === 0 ? null : `applicant${pad(i)}@example.com`, // from the linked user account; may be missing
    photo: null,
    permanent_village: perm.village,
    permanent_post_office: perm.post_office,
    permanent_upazila: perm.upazila,
    permanent_district: perm.district,
    present_village: present.village,
    present_post_office: present.post_office,
    present_upazila: present.upazila,
    present_district: present.district,
    agreement_accepted_at: i % 7 === 0 ? null : submitted, // null = not recorded
    privacy_accepted_at: submitted,
    terms_accepted_at: submitted,
    reviewed_by_name: reviewed ? "Sample Admin" : null,
    reviewed_at: reviewed ? "2026-10-14" : null,
    rejection_reason:
      status === "rejected"
        ? "Sample reason: the information provided could not be verified."
        : null,
  };
}

export const sampleApplications = Array.from({ length: 15 }, (_, idx) =>
  build(idx + 1),
);
