import { Info } from 'lucide-react';
import { isMock } from '../../lib/member/config';

export default function DemoBanner() {
  if (!isMock) return null;
  return (
    <div role="note" className="mb-6 flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p><b>Demonstration data.</b> You are viewing sample records. Nothing here comes from a real account, and email or password changes are not saved.</p>
    </div>
  );
}
