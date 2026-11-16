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

            <h3
              className="rise mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl xl:text-5xl"
              style={{ "--i": 1 }}
            >
              Small Actions.
              <span className="block text-forest">Lasting Change.</span>
            </h3>

            <div
              className="rise mt-8 max-w-xl rounded-2xl border-l-4 border-forest bg-forest/6 px-6 py-5 sm:px-7 sm:py-6"
              style={{ "--i": 2 }}
            >
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-forest">
                Our Belief
              </span>

              <p className="text-xl font-semibold leading-relaxed tracking-tight text-ink sm:text-2xl">
                Let our hands reach those in need, our hearts embrace those in
                pain.
              </p>

              <p className="mt-3 text-sm text-muted">
                A belief that inspires every act of kindness.
              </p>
            </div>

            <p
              className="rise mt-4 max-w-xl leading-relaxed text-muted"
              style={{ "--i": 3 }}
            >
              Proyash is a youth-led voluntary social welfare organization
              dedicated to serving communities, supporting those in need,
              protecting the environment, and creating meaningful social change.
              Through volunteerism, collective action, and community engagement,
              we strive to promote educational and social awareness, strengthen
              underserved communities, and contribute to better and more
              accessible healthcare, environmental sustainability, and overall
              social well-being.
            </p>

            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ "--i": 3 }}
            >
              <Button href="/projects">Our Work</Button>
              <Button {...links.impect} variant="outline">
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
              className="leaf aspect-4/3 object-contain shadow-2xl shadow-deep/15 sm:aspect-16/10 lg:aspect-4/3"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
