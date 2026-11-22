import { isMock } from "@/lib/member/config";
import { memberApi } from "@/lib/member/apiClient";
import { mockDb, simulateLatency } from "@/data/memberMockData";

const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * Normalize API response.
 * Supports both raw JSON and nested API response envelopes.
 */
function unwrapResponse(response) {
  let result = response;

  // Axios-like response: { data: { success, data } }
  if (result?.data && !result?.user && !result?.member) {
    result = result.data;
  }

  // Laravel response: { success, message, data: {...} }
  if (result?.data?.user || result?.data?.member) {
    result = result.data;
  }

  return result;
}

/**
 * Convert Laravel profile response into frontend profile shape.
 */
function mapMemberProfile(response) {
  const account = unwrapResponse(response);

  const user = account?.user ?? account?.member?.user ?? {};
  const member = account?.member ?? {};
  const addresses = account?.addresses ?? {};

  const permanent = addresses.permanent ?? {};
  const present = addresses.present ?? {};

  return {
    id: member.id ?? null,
    userId: user.id ?? member.user_id ?? null,

    nameEn: user.name ?? "",
    nameBn: member.full_name_bn ?? "",
    email: user.email ?? "",

    fatherName: member.father_name ?? "",
    motherName: member.mother_name ?? "",

    dateOfBirth: member.date_of_birth ? member.date_of_birth.slice(0, 10) : "",

    gender: member.gender ?? "",
    religion: member.religion ?? "",
    nationality: member.nationality ?? "",
    occupation: member.occupation ?? "",
    education: member.educational_qualification ?? "",
    bloodGroup: member.blood_group ?? "",
    maritalStatus: member.marital_status ?? "",

    mobile: member.mobile_number ?? "",

    photoUrl: member.profile_photo_url ?? null,

    status: member.status ?? null,

    permanent: {
      village: permanent.village ?? "",
      postOffice: permanent.post_office ?? "",
      upazila: permanent.upazila ?? "",
      district: permanent.district ?? "",
    },

    present: {
      village: present.village ?? "",
      postOffice: present.post_office ?? "",
      upazila: present.upazila ?? "",
      district: present.district ?? "",
    },

    lockedFields: member.locked_fields ?? [],
  };
}

/**
 * Get member profile.
 * Kept for backward compatibility with existing components.
 */
export async function getMemberProfile() {
  if (!isMock) {
    const response = await memberApi.get("/member/profile");

    return mapMemberProfile(response);
  }

  await simulateLatency();

  const {
    email,
    status,
    registeredAt,
    approvedAt,
    feeStatus,
    membershipId,
    account,
    ...profile
  } = mockDb.member;

  return clone(profile);
}

/**
 * Get member membership.
 * Legacy endpoint - keep only for existing usages.
 */
export async function getMemberMembership() {
  return memberApi.get("/member/membership");
}

/**
 * Get complete member account using ONE API request.
 */
export async function getMemberAccount() {
  if (!isMock) {
    const response = await memberApi.get("/member/account");

    const account = unwrapResponse(response);
    const profile = mapMemberProfile(account);

    return {
      ...profile,

      membership: account?.membership ?? {
        member_status: account?.member?.status ?? null,
      },
    };
  }

  await simulateLatency();

  const profile = await getMemberProfile();

  return {
    ...profile,

    id: mockDb.member.id ?? null,
    status: mockDb.member.status ?? null,

    membership: {
      member_status: mockDb.member.status ?? null,
      fee_status: mockDb.member.feeStatus ?? null,
      membership_id: mockDb.member.membershipId ?? null,
    },
  };
}

/**
 * Update member profile.
 */
export async function updateMemberProfile(values, options = {}) {
  const payload = {
    full_name_en: values.nameEn,
    full_name_bn: values.nameBn,
    email: values.email,

    father_name: values.fatherName,
    mother_name: values.motherName,
    date_of_birth: values.dateOfBirth,
    nationality: values.nationality,
    religion: values.religion,
    occupation: values.occupation,
    gender: values.gender,
    marital_status: values.maritalStatus,
    educational_qualification: values.education,
    blood_group: values.bloodGroup,
    mobile_number: values.mobile,

    addresses: {
      permanent: {
        village: values.permanent?.village,
        post_office: values.permanent?.postOffice,
        upazila: values.permanent?.upazila,
        district: values.permanent?.district,
      },
      present: {
        village: values.present?.village,
        post_office: values.present?.postOffice,
        upazila: values.present?.upazila,
        district: values.present?.district,
      },
    },
  };

  if (isMock) {
    await simulateLatency();

    return { success: true };
  }

  // 1. Update profile information
  const response = await memberApi.patch("/member/profile", payload);

  // 2. Upload profile photo if selected
  if (options.photoFile) {
    await updateMemberProfilePhoto(options.photoFile);
  }

  return response;
}

export async function updateMemberProfilePhoto(file) {
  const formData = new FormData();

  formData.append("profile_photo", file);

  return memberApi.post("/member/profile/photo", formData);
}
