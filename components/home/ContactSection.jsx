import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FacebookIcon from "@/components/ui/FacebookIcon";
import { site, links } from "@/data/site";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-mist py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <SectionHeading
            eyebrow="Contact"
            title="Stay Connected with Proyash."
            className="lg:col-span-6"
          >
            Follow our latest activities on Facebook, or get in touch to learn how you
            can take part.
          </SectionHeading>

          <div className="lg:col-span-5 lg:col-start-8">
            <ul className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white">
              <li className="flex items-start gap-4 p-5 sm:p-6">
                <MapPin size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
                <div>
                  <p className="text-sm font-bold text-ink">Location</p>
                  <p className="mt-0.5 text-muted">{site.location}</p>
                </div>
              </li>
              <li>
                <a
                  href={links.facebook.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 transition-colors hover:bg-mist/60 sm:p-6"
                >
                  <FacebookIcon size={22} className="mt-0.5 shrink-0 text-forest" />
                  <div>
                    <p className="text-sm font-bold text-ink">Facebook</p>
                    <p className="mt-0.5 text-muted">facebook.com/proyas3524</p>
                    <span className="sr-only">(opens in a new tab)</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
