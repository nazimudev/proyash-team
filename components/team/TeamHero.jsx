import Link from "next/link";
import {
  ArrowDown,
  HeartHandshake,
  Sprout,
  GraduationCap,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import { teamPage } from "@/data/teamMembers";

/* Abstract "community" mosaic built from the brand's leaf shape. Purely decorative. */
const tiles = [
  {
    cls: "bg-mist border border-forest/10 leaf-sm",
    Icon: GraduationCap,
    icon: "text-forest",
  },
  {
    cls: "bg-forest rounded-tl-md rounded-br-md rounded-tr-[2.5rem] rounded-bl-[2.5rem]",
    Icon: HeartHandshake,
    icon: "text-white",
  },
  { cls: "bg-warm/70 leaf-sm" },
  {
    cls: "bg-deep rounded-tl-md rounded-br-md rounded-tr-[2.5rem] rounded-bl-[2.5rem]",
    Icon: Sprout,
    icon: "text-fresh",
  },
  { cls: "bg-fresh/80 leaf-sm", Icon: Users, icon: "text-deep" },
  {
    cls: "bg-mist border border-forest/10 rounded-tl-md rounded-br-md rounded-tr-[2.5rem] rounded-bl-[2.5rem]",
  },
  { cls: "bg-forest/15 leaf-sm" },
  {
    cls: "bg-white border border-forest/10 rounded-tl-md rounded-br-md rounded-tr-[2.5rem] rounded-bl-[2.5rem]",
    Icon: Sprout,
    icon: "text-forest",
  },
  { cls: "bg-forest leaf-sm" },
];

export default function TeamHero() {
  const photo = teamPage.heroPhoto;

  return (
    <section className="bg-paper pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="font-semibold text-forest underline-offset-4 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-muted">
                  /
                </li>
                <li aria-current="page" className="font-semibold text-muted">
                  Our Team
                </li>
              </ol>
            </nav>

            <p className="mt-10 flex items-center gap-3 text-sm font-bold tracking-wide text-forest">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              Meet our people
            </p>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              The People Behind Our Purpose
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Meet the dedicated members and advisors who contribute their time,
              knowledge, and commitment to building a stronger and more caring
              community.
            </p>

            <Link
              href="#team-directory"
              className="group mt-9 inline-flex min-h-11 items-center gap-2.5 font-semibold text-forest"
            >
              <span className="underline decoration-forest/30 underline-offset-[6px] group-hover:decoration-forest">
                Meet the team
              </span>
              <span className="grid size-9 place-items-center rounded-lg bg-mist transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none">
                <ArrowDown size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="lg:col-span-5">
            {photo ? (
              <Photo
                {...photo}
                priority
                sizes="(min-width: 1024px) 440px, 100vw"
                className="leaf aspect-4/5 shadow-2xl shadow-deep/15"
              />
            ) : (
              <div
                aria-hidden="true"
                className="mx-auto grid aspect-square w-full max-w-sm grid-cols-3 gap-3 sm:max-w-md lg:ml-auto"
              >
                {tiles.map(({ cls, Icon, icon }, i) => (
                  <div key={i} className={`grid place-items-center ${cls}`}>
                    {Icon && <Icon size={26} className={icon} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
