import { Sprout } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { links } from "@/data/site";

export default function DonationCTA() {
  return (
    <section className="on-dark relative overflow-hidden bg-forest py-20 text-white sm:py-28">
      <Sprout aria-hidden="true" strokeWidth={1} className="pointer-events-none absolute -right-10 -bottom-12 size-72 text-white/[0.07] sm:size-[26rem]" />
      <Container className="relative">
        <div className="max-w-2xl">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">There Are Many Ways to Help</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Your time and ideas matter as much as financial support. Volunteer with Proyash Songgothon or get in touch with questions about how contributions are managed.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {/* No standalone volunteer/contact pages exist yet; these are the existing homepage sections. */}
            <Button {...links.join} variant="light">Volunteer With Us</Button>
            <Button href="/#contact" variant="outlineLight">Contact Us</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
