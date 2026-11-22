import { Manrope } from 'next/font/google';
import './member.css';
import MemberShell from '@/components/member/MemberShell';
import AuthGuard from '@/components/auth/AuthGuard';

const manrope = Manrope({ subsets: ['latin'], display: 'swap' });

export const metadata = { title: 'Member Panel · Proyash Team' };

// Separate from the admin layout: nothing under /admin is touched.
// TODO(integration): add your auth guard here (redirect to the login page if the Sanctum session is missing,
// and block admin users) once the Laravel API is connected.
export default function MemberLayout({ children }) {
  return (
    <AuthGuard roles={["member"]}>
      <div className={manrope.className}>
        <MemberShell>{children}</MemberShell>
      </div>
    </AuthGuard>
  );
}
