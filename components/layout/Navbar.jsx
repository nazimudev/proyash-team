/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { getNavItems, links } from "@/data/site";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { loggedIn, role } = useAuth();

  const items = getNavItems({ loggedIn, role });

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close mobile menu with Escape
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const surface = scrolled || open;

  // Active navigation checker
  const isActiveLink = (href) => {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
        surface ? "border-forest/10 bg-paper/90" : "border-transparent bg-white"
      }`}
    >
      <Container className="flex h-18 items-center justify-between gap-2 sm:gap-6">
        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const active = isActiveLink(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-md px-3.5 py-2 text-[15px] font-semibold transition-colors duration-200 ${
                      active ? "text-forest" : "text-ink/80 hover:text-forest"
                    }`}
                  >
                    {item.label}

                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-fresh transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Join Button (shob screen-e) */}
          <Button
            {...links.join}
            size="sm"
            className="bg-forest text-white hover:bg-forest/90"
          >
            Join
          </Button>

          {/* Donation: sudhu desktop (lg) theke header-e dekhabe */}
          <div className="hidden lg:block">
            <Button
              {...links.donation}
              size="sm"
              className="bg-amber-500 text-forest hover:bg-amber-400"
            >
              Donation
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-forest/20 text-ink hover:bg-forest/5 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {open && (
        <div
          id="mobile-menu"
          className="rise border-t border-forest/10 bg-paper lg:hidden"
        >
          <Container className="py-4">
            {/* Mobile Navigation Links */}
            <nav aria-label="Mobile">
              <ul>
                {items.map((item) => {
                  const active = isActiveLink(item.href);

                  return (
                    <li
                      key={item.href}
                      className="border-b border-forest/10 last:border-0"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-12 items-center text-lg font-semibold transition-colors ${
                          active ? "text-forest" : "text-ink hover:text-forest"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Mobile Donation Button */}
            <div className="pt-4 md:hidden">
              <Button
                {...links.donation}
                className="w-full bg-amber-500 text-forest hover:bg-amber-400"
              >
                Donation
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
