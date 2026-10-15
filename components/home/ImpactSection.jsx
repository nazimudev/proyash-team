import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { iconMap } from "@/components/ui/icons";
import { images, impactPoints, links } from "@/data/site";

export default function ImpactSection() {
  return (
    <section id="impact" className="on-dark bg-deep py-20 text-white sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeading tone="dark" eyebrow="Why it matters" title="Change Begins When We Care.">
              No one person can meet every need. When neighbours, students, and volunteers
              act together, support reaches further and lasts longer.
            </SectionHeading>

            <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {impactPoints.map(({ icon, title, text }) => {
                const Icon = iconMap[icon];
                return (
                  <div key={title}>
                    <dt className="flex items-center gap-2.5 font-bold text-white">
                      <Icon size={20} aria-hidden="true" className="text-fresh" />
                      {title}
                    </dt>
                    <dd className="mt-1.5 pl-[1.875rem] leading-relaxed text-white/70">{text}</dd>
                  </div>
                );
              })}
            </dl>

            <Button {...links.join} variant="light" className="mt-10">
              Take Part
            </Button>
          </div>

          <div className="group lg:col-span-6">
            <Photo
              {...images.impact}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="leaf aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
