import Link from "next/link";
import { HeartHandshake, Sprout, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import { joinHero as c } from "@/data/membership";

export default function MembershipHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pt-36">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mt-8 flex items-center gap-3 text-sm font-bold tracking-wide text-forest">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              {c.eyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl">{c.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{c.text}</p>
            <p className="mt-5 text-sm text-muted">
              Already applied or a member?{" "}
              <Link href="/login" className="font-semibold text-forest underline underline-offset-4">Log in</Link>
            </p>
          </div>
          <div aria-hidden="true" className="hidden lg:col-span-4 lg:block">
            <div className="mx-auto grid max-w-[16rem] grid-cols-2 gap-3">
              <span className="leaf-sm grid aspect-square place-items-center bg-forest"><HeartHandshake size={36} className="text-white" /></span>
              <span className="leaf-sm mt-8 grid aspect-square place-items-center bg-mist"><Users size={34} className="text-forest" /></span>
              <span className="leaf-sm -mt-4 grid aspect-square place-items-center bg-fresh/70"><Sprout size={34} className="text-deep" /></span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
