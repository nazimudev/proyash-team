/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Phone,
  CalendarDays,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Droplets,
  RefreshCw,
  AlertCircle,
  MapPinned,
  User,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-medium text-neutral-800 dark:text-neutral-100">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function AddressCard({ address }) {
  const isPermanent = address.type === "permanent";

  return (
    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-3 flex items-center gap-2">
        <MapPinned size={18} className="text-emerald-600" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {isPermanent ? "Permanent Address" : "Present Address"}
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoItem icon={MapPin} label="Village" value={address.village} />
        <InfoItem
          icon={MapPin}
          label="Post Office"
          value={address.post_office}
        />
        <InfoItem icon={MapPin} label="Upazila" value={address.upazila} />
        <InfoItem icon={MapPin} label="District" value={address.district} />
      </div>
    </div>
  );
}

export default function ProfilePageContent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${API_URL}/admin/profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load profile information.",
        );
      }

      if (!result.success) {
        throw new Error(result.message || "Profile request failed.");
      }

      setProfile(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-emerald-600"
          />
          <p className="mt-3 text-sm text-neutral-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <AlertCircle className="mx-auto text-red-600" size={30} />
        <h2 className="mt-3 font-semibold text-neutral-900 dark:text-white">
          Unable to load profile
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    );
  }

  const account = profile?.account ?? {};
  const member = profile?.member ?? null;
  const addresses = member?.addresses ?? [];

  const fullName =
    member?.full_name_en || member?.full_name_bn || account.name || "Admin";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

    function formatDate(date) {
      if (!date) return "Not provided";

      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(parsedDate);
    }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            View your account and personal information.
          </p>
        </div>

        <button
          onClick={fetchProfile}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Profile header */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-28 bg-linear-to-r from-emerald-800 to-emerald-600" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-11 flex flex-wrap items-end gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-800 shadow-sm dark:border-neutral-900 dark:bg-emerald-950 dark:text-emerald-400">
              {member?.profile_photo ? (
                <Image
                  src={
                    member.profile_photo.startsWith("http")
                      ? member.profile_photo
                      : `${API_URL.replace(/\/api\/?$/, "")}/storage/${member.profile_photo.replace(/^\/?storage\//, "")}`
                  }
                  alt={fullName}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                initials || <UserRound size={32} />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {fullName}
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {account.email || "No email available"}
              </p>
            </div>

            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <ShieldCheck size={14} />
              {account.role || "User"}
            </span>
          </div>
        </div>
      </section>

      {/* Account information */}
      <SectionCard
        title="Account Information"
        description="Your login and account details."
      >
        <div className="grid gap-x-8 sm:grid-cols-2">
          <InfoItem
            icon={UserRound}
            label="Account Name"
            value={account.name}
          />
          <InfoItem icon={Mail} label="Email Address" value={account.email} />
          <InfoItem
            icon={ShieldCheck}
            label="Account Role"
            value={account.role}
          />
          <InfoItem icon={User} label="Account ID" value={account.id} />
        </div>
      </SectionCard>

      {/* Member information */}
      {member ? (
        <>
          <SectionCard
            title="Personal Information"
            description="Your registered member details."
          >
            <div className="grid gap-x-8 sm:grid-cols-2">
              <InfoItem
                icon={UserRound}
                label="Full Name (English)"
                value={account.name}
              />
              <InfoItem
                icon={UserRound}
                label="Full Name (Bangla)"
                value={member.full_name_bn}
              />
              <InfoItem
                icon={User}
                label="Father's Name"
                value={member.father_name}
              />
              <InfoItem
                icon={User}
                label="Mother's Name"
                value={member.mother_name}
              />
              <InfoItem
                icon={CalendarDays}
                label="Date of Birth"
                value={formatDate(member.date_of_birth)}
              />
              <InfoItem
                icon={User}
                label="Nationality"
                value={member.nationality}
              />
              <InfoItem icon={User} label="Religion" value={member.religion} />
              <InfoItem icon={User} label="Gender" value={member.gender} />
              <InfoItem
                icon={User}
                label="Marital Status"
                value={member.marital_status}
              />
              <InfoItem
                icon={GraduationCap}
                label="Education"
                value={member.educational_qualification}
              />
              <InfoItem
                icon={BriefcaseBusiness}
                label="Occupation"
                value={member.occupation}
              />
              <InfoItem
                icon={Droplets}
                label="Blood Group"
                value={member.blood_group}
              />
              <InfoItem
                icon={Phone}
                label="Mobile Number"
                value={member.mobile}
              />
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <p className="text-xs text-neutral-500">Membership Status</p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {member.membership_status || "Not available"}
              </span>
            </div>
          </SectionCard>

          {/* Addresses */}
          <SectionCard
            title="Address Information"
            description="Your permanent and present addresses."
          >
            {addresses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                  <AddressCard key={address.id} address={address} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-neutral-50 p-5 text-sm text-neutral-500 dark:bg-neutral-800">
                No address information available.
              </p>
            )}
          </SectionCard>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
          <UserRound size={30} className="mx-auto text-neutral-400" />
          <h3 className="mt-3 font-semibold text-neutral-800 dark:text-white">
            No Member Profile
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            This admin account is not linked to a member profile.
          </p>
        </div>
      )}
    </div>
  );
}
