const takaFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthName = (m) => MONTHS[m - 1] || '';
export const monthShort = (m) => monthName(m).slice(0, 3);

export const formatTaka = (n) => `৳${takaFormatter.format(Number(n) || 0)}`;

// Dates arrive as 'YYYY-MM-DD' (or ISO). Formatted in UTC so server and browser render identically.
export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export function getInitials(name = '') {
  return name.replace(/^(md\.?|mst\.?)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'M';
}

export const firstName = (name = '') => name.replace(/^(md\.?|mst\.?)\s+/i, '').split(/\s+/)[0] || 'Member';
