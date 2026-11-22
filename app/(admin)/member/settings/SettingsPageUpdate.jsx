"use client";
import { useState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { getMemberAccount } from "@/services/memberSettingsService";
import PageHeader from "@/components/member/PageHeader";
import ChangeEmailForm from "@/components/member/ChangeEmailForm";
import ChangePasswordForm from "@/components/member/ChangePasswordForm";
import AccountInfoCard from "@/components/member/AccountInfoCard";
import ErrorState from "@/components/member/ErrorState";
import { SkeletonBlock } from "@/components/member/LoadingSkeleton";

const TABS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "password", label: "Password", icon: KeyRound },
  { id: "account", label: "Account", icon: ShieldCheck },
];

export default function SettingsPageUpdate() {
  const [tab, setTab] = useState("email");
  const {
    data: account,
    error,
    loading,
    reload,
  } = useAsync(() => getMemberAccount(), []);

  function onKeyDown(e) {
    const i = TABS.findIndex((t) => t.id === tab);
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % TABS.length
        : e.key === "ArrowLeft"
          ? (i + TABS.length - 1) % TABS.length
          : null;
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage how you sign in to your member account."
      />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading && !account ? (
        <SkeletonBlock className="h-96 max-w-2xl" />
      ) : (
        <div className="max-w-2xl overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
          <div
            role="tablist"
            aria-label="Account settings"
            onKeyDown={onKeyDown}
            className="flex border-b border-slate-100 bg-green-50/50"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                type="button"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3.5 text-sm font-bold transition ${tab === id ? "border-green-800 bg-white text-green-900" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="p-6"
          >
            {tab === "email" && (
              <ChangeEmailForm
                currentEmail={account?.user?.email ?? account?.email ?? ""}
                onChanged={reload}
              />
            )}
            {tab === "password" && <ChangePasswordForm />}
            {tab === "account" && <AccountInfoCard account={account} />}
          </div>
        </div>
      )}
    </>
  );
}
