"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { navItems, links } from "@/data/site";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const surface = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md bg-white border-forest/10 transition-[background-color,border-color] duration-300 ${
        surface
          ? "border-forest/10 bg-paper/90 backdrop-blur-md"
          : "border-transparent"
      }`}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative block rounded-md px-3.5 py-2 text-[15px] font-semibold transition-colors duration-200 ${
                      isActive ? "text-forest" : "text-ink/80 hover:text-forest"
                    }`}
                  >
                    {item.label}

                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-fresh transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            {...links.join}
            size="sm"
            className="hidden md:inline-flex bg-forest text-white hover:bg-forest/90"
          >
            Join Proyash
          </Button>

          <Button
            {...links.donation}
            size="sm"
            className="hidden md:inline-flex bg-amber-500 text-forest hover:bg-amber-400"
          >
            Donation
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-lg border border-forest/20 text-ink transition-colors hover:bg-forest/5 lg:hidden"
          >
            {open ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-menu"
          className="rise border-t border-forest/10 bg-paper lg:hidden"
        >
          <Container className="py-4">
            <nav aria-label="Mobile">
              <ul>
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <li
                      key={item.href}
                      className="border-b border-forest/10 last:border-0"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex min-h-12 items-center text-lg font-semibold ${
                          isActive ? "text-forest" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
