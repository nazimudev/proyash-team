'use client';

// src/components/admin/contact/ContactMessageFilters.jsx
import { Search } from 'lucide-react';

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

export default function ContactMessageFilters({ search, onSearch, status, onStatus }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, email or subject"
          aria-label="Search messages"
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#166534]/40"
        />
      </div>

      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onStatus(s.value)}
            aria-pressed={status === s.value}
            className={`rounded-full border px-3 py-1 text-sm ${
              status === s.value ? 'border-[#166534] bg-[#166534] text-white' : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
