import { isMock, LOGIN_PATH } from "@/lib/member/config";
import { memberApi } from "@/lib/member/apiClient";
import { MemberApiError } from "@/lib/member/errors";
import {
  DEMO_TAKEN_EMAILS,
  mockDb,
  simulateLatency,
} from "@/data/memberMockData";
import {
  validateEmailChange,
  validatePasswordChange,
} from "@/lib/member/validators";

export async function getMemberAccount() {
  if (!isMock) return memberApi.get("/member/account");
  await simulateLatency(300);
  return { email: mockDb.member.email, ...mockDb.member.account };
}

export async function changeMemberEmail(payload) {
  if (!isMock) {
    return memberApi.patch("/member/change-email", {
      current_password: payload.currentPassword,
      new_email: payload.newEmail,
    });
  }

  await simulateLatency(700);

  const errors = validateEmailChange(payload, mockDb.member.email);

  if (
    !errors.newEmail &&
    DEMO_TAKEN_EMAILS.includes(payload.newEmail.trim().toLowerCase())
  ) {
    errors.newEmail = "This email address is already in use.";
  }

  if (Object.keys(errors).length) {
    throw new MemberApiError("Please correct the highlighted fields.", {
      status: 422,
      errors,
    });
  }

  return {
    demo: true,
    verificationRequired: false,
    message: "Demo mode: the email was validated but not changed.",
  };
}

export async function changeMemberPassword(payload) {
  if (!isMock) {
    return memberApi.patch("/member/change-password", {
      current_password: payload.currentPassword,
      password: payload.newPassword,
      password_confirmation: payload.confirmPassword,
    });
  }

  await simulateLatency(700);

  const errors = validatePasswordChange(payload);

  if (Object.keys(errors).length) {
    throw new MemberApiError("Please correct the highlighted fields.", {
      status: 422,
      errors,
    });
  }

  return {
    demo: true,
    message: "Demo mode: the password was validated but not changed.",
  };
}

/**
 * Returns the path to redirect to.
 */
export async function logoutMember() {
  if (!isMock) {
    try {
      await memberApi.post("/member/logout");
    } catch {
      // Token may already be invalid.
    }
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user_role");

    console.log("After logout:", {
      token: localStorage.getItem("auth_token"),
      user: localStorage.getItem("auth_user"),
      role: localStorage.getItem("user_role"),
    });
  }

  return LOGIN_PATH;
}
