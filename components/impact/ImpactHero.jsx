import { ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { impactHero as c } from "@/data/impact";

export default function ImpactHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p
              className="rise flex items-center gap-3 text-sm font-bold tracking-wide text-forest"
              style={{ "--i": 0 }}
            >
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              {c.eyebrow}
            </p>
            <h1
              className="rise mt-5 max-w-2xl text-balance text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-ink sm:text-6xl"
              style={{ "--i": 1 }}
            >
              {c.title}
            </h1>
            <p
              className="rise mt-6 max-w-xl text-lg leading-relaxed text-muted"
              style={{ "--i": 2 }}
            >
              {c.text}
            </p>

            <p
              className="rise mt-7 flex max-w-xl items-start gap-3 rounded-xl border border-forest/15 bg-white p-4 text-[15px] font-semibold text-ink"
              style={{ "--i": 3 }}
            >
              <ShieldCheck
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-forest"
              />
              {c.transparencyStatement}
            </p>

            <div
              className="rise mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ "--i": 4 }}
            >
              <Button href={c.primaryCta.href}>{c.primaryCta.label}</Button>
              <Button href={c.secondaryCta.href} variant="outline">
                {c.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="rise lg:col-span-5" style={{ "--i": 2 }}>
            <Photo
              {...c.image}
              priority
              sizes="(min-width: 1024px) 460px, 100vw"
              className="leaf aspect-4/5 shadow-2xl shadow-deep/15 sm:aspect-5/4 lg:aspect-4/5"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
