import { ORG_NAME } from './config';
import { formatDate, formatTaka, monthName } from './format';

const esc = (s) => String(s ?? '—').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Opens a printable receipt (browser "Save as PDF" works). Only offered for VERIFIED payments.
// TODO(integration): if Laravel exposes a receipt PDF route, link to it instead.
export function printReceipt(payment, member) {
  const w = window.open('', '_blank', 'width=720,height=800');
  if (!w) return false;
  const rows = [
    ['Payment reference', payment.id], ['Member', member?.nameEn], ['Membership ID', member?.membershipId],
    ['Contribution month', `${monthName(payment.month)} ${payment.year}`], ['Amount', formatTaka(payment.amount)],
    ['Method', payment.method], ['Transaction ID', payment.transactionId || payment.receiptNo], ['Payment date', formatDate(payment.paymentDate)],
    ['Verified by', payment.verifiedBy], ['Verified on', formatDate(payment.verifiedAt)],
  ];
  w.document.write(`<!doctype html><title>Receipt ${esc(payment.id)}</title><style>body{font-family:system-ui,sans-serif;max-width:560px;margin:40px auto;color:#1f2937}h1{color:#166534;font-size:22px;margin:0}p{color:#6b7280;margin:4px 0 24px}table{width:100%;border-collapse:collapse}td{padding:10px 0;border-bottom:1px solid #e5e7eb}td:first-child{color:#6b7280;width:45%}</style><h1>${esc(ORG_NAME)}</h1><p>Payment receipt</p><table>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join('')}</table><script>window.onload=()=>window.print()<\/script>`);
  w.document.close();
  return true;
}
