
import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link
      href="/"
      aria-label="Proyash Songgothon home"
      className={`inline-flex items-center shrink-0 ${className}`}
    >
      <Image
        src="/images/logo.jpg"
        width={140}
        height={80}
        alt="Proyash Songgothon"
        priority
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}