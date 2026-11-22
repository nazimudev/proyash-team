import { HeartHandshake } from 'lucide-react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { ORG_NAME } from '../../lib/member/config';
import { formatDate } from '../../lib/member/format';

export default function MembershipCard({ member }) {
  return (
    <div className="relative aspect-[1.586] w-full max-w-md overflow-hidden rounded-[28px] bg-green-800 p-6 text-white shadow-xl shadow-green-900/20"
      style={{ backgroundImage: 'radial-gradient(circle at 105% -10%, rgba(134,239,172,.35), transparent 45%), repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 2px, transparent 2px 14px)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"><HeartHandshake className="h-[18px] w-[18px]" aria-hidden="true" /></span>
          <span className="text-sm font-extrabold tracking-tight">{ORG_NAME}</span>
        </div>
        <StatusBadge kind="membership" status={member.status} />
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-end gap-4">
        <Avatar name={member.nameEn} photoUrl={member.photoUrl} className="h-20 w-20 text-2xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold leading-tight">{member.nameEn}</p>
          <p className="truncate text-sm text-green-100">{member.nameBn}</p>
          <p className="mt-2 font-mono text-sm font-semibold tracking-wider">{member.membershipId}</p>
          <p className="text-xs text-green-200">Member since {formatDate(member.registeredAt)}</p>
        </div>
      </div>
    </div>
  );
}
