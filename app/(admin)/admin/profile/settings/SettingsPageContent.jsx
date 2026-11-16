"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  return localStorage.getItem("auth_token");
}

async function apiRequest(endpoint, payload) {
  const token = getToken();

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    const validationErrors = result.errors
      ? Object.values(result.errors).flat().join(" ")
      : "";

    throw new Error(
      validationErrors || result.message || "Something went wrong.",
    );
  }

  return result;
}

function StatusMessage({ status }) {
  if (!status) return null;

  const success = status.type === "success";

  return (
    <div
      role="status"
      className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
        success
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
      }`}
    >
      {success ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      )}
      <span>{status.message}</span>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-neutral-200 bg-white py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white ${
            Icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-12 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPageContent() {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Load the latest account email from Profile API.
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const token = getToken();

        if (!token || !API_URL) return;

        const response = await fetch(`${API_URL}/admin/profile`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load account email.");
        }

        if (active) {
          const accountEmail = result.data?.account?.email || "";
          setCurrentEmail(accountEmail);
          setEmail(accountEmail);
        }
      } catch (error) {
        console.error("Profile email loading failed:", error);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleEmailSubmit(event) {
    event.preventDefault();

    setEmailStatus(null);

    if (!email.trim()) {
      setEmailStatus({
        type: "error",
        message: "Please enter your new email address.",
      });
      return;
    }

    if (email.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailStatus({
        type: "error",
        message: "Your new email is the same as your current email.",
      });
      return;
    }

    if (!emailPassword) {
      setEmailStatus({
        type: "error",
        message: "Please enter your current password.",
      });
      return;
    }

    setEmailLoading(true);

    try {
      const result = await apiRequest("/admin/settings/email", {
        email: email.trim(),
        current_password: emailPassword,
      });

      const updatedEmail = result.data?.email || email.trim();

      setCurrentEmail(updatedEmail);
      setEmail(updatedEmail);
      setEmailPassword("");

      // Update cached account information, if present.
      try {
        const savedUser = localStorage.getItem("auth_user");

        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.email = updatedEmail;
          localStorage.setItem("auth_user", JSON.stringify(user));
          window.dispatchEvent(new Event("auth-changed"));
        }
      } catch {
        // Profile API remains the source of truth.
      }

      setEmailStatus({
        type: "success",
        message: result.message || "Email updated successfully.",
      });
    } catch (error) {
      setEmailStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordStatus({
        type: "error",
        message: "New password must be different from the current password.",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await apiRequest("/admin/settings/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordStatus({
        type: "success",
        message: result.message || "Password updated successfully.",
      });
    } catch (error) {
      setPasswordStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Manage your account email and password.
        </p>
      </div>

      {/* Email settings */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <Mail size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-white">
              Email Address
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Update the email address associated with your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Current Email
            </label>

            <input
              type="email"
              value={currentEmail}
              readOnly
              placeholder="Loading email..."
              className="w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
            />
          </div>

          <FormInput
            label="New Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your new email"
            icon={Mail}
            autoComplete="email"
          />

          <PasswordInput
            label="Current Password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            placeholder="Enter your current password"
            visible={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            autoComplete="current-password"
          />

          <StatusMessage status={emailStatus} />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={emailLoading || !currentEmail}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {emailLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </section>

      {/* Password settings */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <LockKeyhole size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-white">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Choose a strong password to protect your account.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            visible={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            autoComplete="current-password"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            visible={showNew}
            onToggle={() => setShowNew(!showNew)}
            autoComplete="new-password"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            visible={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            autoComplete="new-password"
          />

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Password must contain at least 8 characters.
          </p>

          <StatusMessage status={passwordStatus} />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <ShieldCheck
          size={21}
          className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400"
        />

        <div>
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Account Security
          </h3>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
            Never share your password with anyone. Your password is securely
            processed by the server and is never saved in browser storage.
          </p>
        </div>
      </div>
    </div>
  );
}
