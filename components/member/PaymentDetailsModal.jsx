'use client';
import { toast } from 'sonner';
import { Printer } from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { formatDate, formatTaka, monthName } from '../../lib/member/format';
import { printReceipt } from '../../lib/member/receipt';

function Row({ label, children }) {
  return <div className="flex items-start justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold text-slate-900">{children}</dd></div>;
}

export default function PaymentDetailsModal({ payment, member, onClose }) {
  if (!payment) return null;
  const verified = payment.status === 'verified';

  function handlePrint() {
    if (!printReceipt(payment, member)) toast.error('Your browser blocked the receipt window. Allow pop-ups and try again.');
  }

  return (
    <Modal open onClose={onClose} title={`Payment ${payment.id}`} description={`${monthName(payment.month)} ${payment.year} contribution`}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
          {verified && <button type="button" onClick={handlePrint} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900"><Printer className="h-4 w-4" />Print receipt</button>}
        </>
      }>
      <dl className="divide-y divide-slate-100">
        <Row label="Status"><StatusBadge kind="payment" status={payment.status} /></Row>
        <Row label="Amount">{formatTaka(payment.amount)}</Row>
        <Row label="Method">{payment.method}</Row>
        <Row label={payment.transactionId ? 'Transaction ID' : 'Receipt number'}><span className="font-mono text-xs">{payment.transactionId || payment.receiptNo || '—'}</span></Row>
        <Row label="Payment date">{formatDate(payment.paymentDate)}</Row>
        {verified && <><Row label="Verified by">{payment.verifiedBy}</Row><Row label="Verified on">{formatDate(payment.verifiedAt)}</Row></>}
      </dl>
      {payment.status === 'pending' && <p className="mt-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-900">The office has not verified this payment yet. It is not counted as paid until it is verified.</p>}
      {payment.status === 'rejected' && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"><b>Why it was rejected:</b> {payment.rejectionReason || 'No reason was given.'}</p>}
    </Modal>
  );
}
