import Link from "next/link";
import { Sprout, Leaf, TreePine } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { projectsHero as c } from "@/data/projects";

export default function ProjectsHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mt-10 flex items-center gap-3 text-sm font-bold tracking-wide text-forest">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              {c.eyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">{c.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{c.text}</p>
            <Button href={c.cta.href} className="mt-9">{c.cta.label}</Button>
          </div>

          {/* Decorative: seed → sprout → tree, joined by a dashed path ("purpose into action") */}
          <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto h-72 w-full max-w-md">
              <svg className="absolute inset-0 size-full" viewBox="0 0 400 288" fill="none">
                <path d="M70 220 C 150 220, 150 120, 220 120 S 300 60, 335 60" stroke="#166534" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
              </svg>
              <span className="leaf-sm absolute left-4 top-44 grid size-20 place-items-center bg-mist"><Leaf size={28} className="text-forest" /></span>
              <span className="leaf-sm absolute left-1/2 top-16 grid size-24 -translate-x-1/2 place-items-center bg-forest"><Sprout size={34} className="text-white" /></span>
              <span className="leaf-sm absolute right-0 top-0 grid size-28 place-items-center bg-fresh/70"><TreePine size={40} className="text-deep" /></span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
