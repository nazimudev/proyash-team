"use client";

import { useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { contributionsApi } from "@/services/admin/contributionsApi";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function GenerateContributions() {
  const currentDate = new Date();

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const monthName = MONTHS.find(
      (item) => item.value === Number(month),
    )?.label;

    const confirmed = window.confirm(
      `Generate monthly contributions for ${monthName} ${year}?`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setResult(null);

      const response = await contributionsApi.generateMonthly(year, month);

      setResult({
        message: response.message,
        data: response.data,
      });

      toast.success(
        response.message || "Contributions generated successfully.",
      );
    } catch (error) {
      toast.error(error.message || "Failed to generate contributions.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMonth = MONTHS.find(
    (item) => item.value === Number(month),
  )?.label;

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <CalendarDays size={22} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Generate Monthly Contributions
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Select a year and month to generate monthly contribution records
              for eligible members.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {/* Year */}
          <div>
            <label
              htmlFor="contribution-year"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Year
            </label>

            <select
              id="contribution-year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={loading}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            >
              {Array.from({ length: 81 }, (_, index) => 2020 + index).map(
                (item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Month */}
          <div>
            <label
              htmlFor="contribution-month"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Month
            </label>

            <select
              id="contribution-month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              disabled={loading}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            >
              {MONTHS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Period */}
        <div className="mt-5 rounded-lg border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-green-700">
            Selected Contribution Period
          </p>

          <p className="mt-1 text-lg font-semibold text-green-900">
            {selectedMonth} {year}
          </p>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-500">
            Existing monthly contribution records are handled by the backend
            generation service.
          </p>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Generate Contributions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="overflow-hidden rounded-xl border border-green-200 bg-white">
          <div className="flex items-center gap-3 border-b border-green-100 bg-green-50 px-5 py-4">
            <CheckCircle2 size={21} className="shrink-0 text-green-700" />

            <div>
              <h3 className="text-sm font-semibold text-green-900">
                Generation Completed
              </h3>

              <p className="mt-1 text-sm text-green-800">{result.message}</p>
            </div>
          </div>

          <div className="p-5">
            <p className="mb-2 text-sm font-semibold text-gray-800">
              Generation Response
            </p>

            <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs leading-6 text-gray-700">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle size={19} className="mt-0.5 shrink-0 text-amber-700" />

        <div>
          <h3 className="text-sm font-semibold text-amber-900">Important</h3>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Before generating, verify that the selected period is correct. The
            backend service controls which members are eligible and how existing
            records are handled.
          </p>
        </div>
      </div>
    </div>
  );
}
