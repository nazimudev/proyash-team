import { getInitials } from '../../lib/member/format';

export default function Avatar({ name, photoUrl, className = 'h-10 w-10 text-sm' }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name ? `${name} profile photo` : 'Profile photo'} className={`${className} shrink-0 rounded-full object-cover ring-2 ring-white/70`} />;
  }
  return (
    <span aria-hidden="true" className={`${className} flex shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-900 ring-2 ring-white/70`}>
      {getInitials(name)}
    </span>
  );
}
