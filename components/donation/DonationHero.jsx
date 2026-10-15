import Link from "next/link";
import { HandHeart, Sprout, GraduationCap } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function DonationHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mt-10 flex items-center gap-3 text-sm font-bold tracking-wide text-forest">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              Support our mission
            </p>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Every Contribution Can Make a Difference
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Your contribution can help Proyash Songgothon support people in need, encourage educational
              opportunities, and promote environmental awareness. Explore our donation process and financial
              records to understand how contributions are managed.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="#donate">Donate Now</Button>
              <Button href="#transparency" variant="outline">View Donation Transparency</Button>
            </div>
            <p className="mt-6 max-w-xl text-sm text-muted">Every donation is verified before it is recorded as confirmed.</p>
          </div>

          <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
            <div className="mx-auto grid max-w-sm grid-cols-2 gap-4">
              <span className="leaf-sm grid aspect-square place-items-center bg-forest"><HandHeart size={44} className="text-white" /></span>
              <span className="leaf-sm mt-10 grid aspect-square place-items-center bg-mist"><GraduationCap size={40} className="text-forest" /></span>
              <span className="leaf-sm -mt-6 grid aspect-square place-items-center bg-fresh/70"><Sprout size={40} className="text-deep" /></span>
              <span className="leaf-sm mt-4 aspect-square bg-forest/15" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
