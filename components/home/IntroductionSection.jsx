import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { iconMap } from "@/components/ui/icons";
import { images, links, focusAreas } from "@/data/site";

export default function IntroductionSection() {
  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="group lg:col-span-5">
            <Photo
              {...images.intro}
              sizes="(min-width: 1024px) 460px, 100vw"
              className="leaf-alt aspect-4/5"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading eyebrow="Who we are" title="Together, We Can Make a Difference." />
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Proyash Songgothon is a social welfare organization based in Madhupur,
                Tangail, Bangladesh. We believe communities grow stronger when people look
                out for one another.
              </p>
              <p>
                Our work centres on three things: supporting people in need, helping
                underprivileged students continue their education, and promoting care for
                the environment through tree plantation.
              </p>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {focusAreas.map(({ icon, label }) => {
                const Icon = iconMap[icon];
                return (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3.5 text-sm font-semibold text-ink"
                  >
                    <Icon size={20} aria-hidden="true" className="shrink-0 text-forest" />
                    {label}
                  </li>
                );
              })}
            </ul>

            <Button {...links.about} variant="link" className="mt-9 text-base">
              Learn About Proyash
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
