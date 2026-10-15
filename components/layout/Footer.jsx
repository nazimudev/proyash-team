import Link from "next/link";
import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import FacebookIcon from "@/components/ui/FacebookIcon";
import CurrentYear from "@/components/ui/CurrentYear";
import { site, navItems, initiatives, links, develop } from "@/data/site";

const linkClass =
  "inline-block py-1.5 text-[15px] text-white/70 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="on-dark bg-surface text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm leading-relaxed text-white/70">
              A social welfare organization supporting people in need, helping
              students move forward, and growing a greener future.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <MapPin size={16} aria-hidden="true" className="text-fresh" />
              {site.location}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-4"
          >
            <div>
              <h2 className="text-sm font-bold text-white">Explore</h2>
              <ul className="mt-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Initiatives</h2>
              <ul className="mt-3">
                {initiatives.map((item) => (
                  <li key={item.id}>
                    <Link href="/#initiatives" className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Policies */}
            <div>
              <h2 className="text-sm font-bold text-white">
                Support & Policies
              </h2>
              <ul className="mt-3">
                <li>
                  <Link href="/donation" className={linkClass}>
                    Donation
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy-policy" className={linkClass}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={linkClass}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className={linkClass}>
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h2 className="text-sm font-bold text-white">Connect</h2>
              <ul className="mt-3">
                <li>
                  <a
                    href={links.facebook.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} inline-flex items-center gap-2`}
                  >
                    <FacebookIcon size={16} />
                    Facebook
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <Link href="/contact" className={linkClass}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Website Copyright */}
          <p>
            &copy; <CurrentYear /> {site.name}. All rights reserved.
          </p>

          {/* Right: Development Company */}
          <p>
            Developed by{" "}
            <a
              href={develop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white transition-colors hover:text-green-400"
            >
              {develop.company}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
