import { Sprout } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { links } from "@/data/site";

export default function TeamCTA() {
  return (
    <section className="on-dark relative overflow-hidden bg-forest py-20 text-white sm:py-28">
      <Sprout
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-10 -bottom-12 size-72 text-white/[0.07] sm:size-104"
      />
      <Container className="relative">
        <div className="max-w-2xl">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            Be Part of Something Meaningful
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Interested in contributing your time and skills to the community?
            Connect with Proyash Songgothon and explore ways to get involved.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button {...links.joinAction} variant="light">
              Become a Volunteer
            </Button>
            <Button href="/#contact" variant="outlineLight">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
