"use client";

import { Images, CloudUpload, FolderKanban } from "lucide-react";

export default function ImageStats({
  selectedCount,
  existingCount,
  projectSelected,
}) {
  const stats = [
    {
      label: "Selected Images",
      value: selectedCount,
      icon: Images,
    },
    {
      label: "Existing Images",
      value: existingCount,
      icon: CloudUpload,
    },
    {
      label: "Project Selected",
      value: projectSelected ? "Yes" : "No",
      icon: FolderKanban,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{item.label}</p>

              <div className="rounded-xl bg-green-50 p-2 text-green-700">
                <Icon size={19} />
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
