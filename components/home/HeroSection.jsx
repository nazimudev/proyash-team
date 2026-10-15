import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { iconMap } from "@/components/ui/icons";
import { site, links, images, focusAreas } from "@/data/site";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-paper pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p
              className="rise inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-3.5 py-1.5 text-sm font-semibold text-forest"
              style={{ "--i": 0 }}
            >
              <MapPin size={16} aria-hidden="true" />
              {site.location}
            </p>

            <h1
              className="rise mt-6 text-balance text-[2.75rem] font-extrabold leading-[1.04] tracking-tight text-ink sm:text-6xl xl:text-7xl"
              style={{ "--i": 1 }}
            >
              Small Acts of Kindness.
              <span className="block text-forest">Lasting Change.</span>
            </h1>

            <p
              className="rise mt-6 max-w-xl text-lg leading-relaxed text-muted"
              style={{ "--i": 2 }}
            >
              Proyash Songgothon works to support underprivileged people, help
              students access educational opportunities, and encourage a greener
              future through tree plantation initiatives.
            </p>

            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ "--i": 3 }}
            >
              <Button href="/#initiatives">Our Work</Button>
              <Button {...links.join} variant="outline">
                Our Impact
              </Button>
            </div>

            <ul
              className="rise mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6"
              style={{ "--i": 4 }}
              aria-label="Our focus areas"
            >
              {focusAreas.map(({ icon, label }) => {
                const Icon = iconMap[icon];
                return (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-sm font-semibold text-ink/80"
                  >
                    <Icon
                      size={18}
                      aria-hidden="true"
                      className="text-forest"
                    />
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="rise relative pb-10 lg:col-span-6"
            style={{ "--i": 2 }}
          >
            <Photo
              {...images.hero}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="leaf aspect-4/5 shadow-2xl shadow-deep/15 sm:aspect-5/4 lg:aspect-4/5"
            />
            <div className="leaf-sm absolute bottom-0 left-0 w-[42%] max-w-60 bg-paper p-1.5 sm:-left-6 lg:-left-10">
              <Photo
                {...images.heroSecondary}
                sizes="240px"
                className="leaf-sm aspect-square"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
