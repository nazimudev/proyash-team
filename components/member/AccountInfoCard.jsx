import StatusBadge from "./StatusBadge";
import { formatDate } from "@/lib/member/format";

export default function AccountInfoCard({ account }) {
  const user = account?.user ?? {};
  const member = account?.member ?? {};

  const rows = [
    ["Account email", user.email ?? account?.email ?? "—"],
    [
      "Account status",
      <StatusBadge
        key="status"
        kind="account"
        status={member.status ?? account?.status ?? "unknown"}
      />,
    ],
    ["Account created", formatDate(member.created_at ?? account?.createdAt)],
    ["Last updated", formatDate(member.updated_at ?? account?.updatedAt)],
  ];

  return (
    <div>
      <h2 className="text-base font-bold text-slate-900">
        Account information
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        These details are managed by the system and cannot be edited here.
      </p>

      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 py-3"
          >
            <dt className="text-sm text-slate-500">{label}</dt>

            <dd className="break-all text-right text-sm font-semibold text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
