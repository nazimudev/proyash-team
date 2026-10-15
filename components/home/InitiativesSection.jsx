import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { iconMap } from "@/components/ui/icons";
import { initiatives } from "@/data/site";

/* Each initiative gets its own treatment so the section has a clear hierarchy. */
const styles = {
  "community-support": {
    card: "bg-white border border-forest/10 lg:col-span-7 lg:row-span-2",
    photo: "aspect-[4/3] lg:aspect-auto lg:min-h-[22rem] lg:flex-1",
    chip: "bg-mist text-forest",
    title: "text-ink text-2xl sm:text-3xl",
    text: "text-muted",
    button: "link",
  },
  "tree-plantation": {
    card: "on-dark bg-deep text-white lg:col-span-5",
    photo: "aspect-[16/9]",
    chip: "bg-white/10 text-fresh",
    title: "text-white text-2xl",
    text: "text-white/75",
    button: "linkLight",
  },
  "educational-support": {
    card: "bg-white border border-forest/10 lg:col-span-5",
    photo: "aspect-[16/9]",
    chip: "bg-mist text-forest",
    title: "text-ink text-2xl",
    text: "text-muted",
    button: "link",
  },
};

export default function InitiativesSection() {
  return (
    <section id="initiatives" className="bg-mist py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Our initiatives" title="Where We Focus Our Care">
          Three areas guide the work of Proyash Songgothon, each rooted in the needs of
          the community around us.
        </SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {initiatives.map((item) => {
            const s = styles[item.id];
            const Icon = iconMap[item.icon];
            return (
              <article
                key={item.id}
                className={`group flex flex-col overflow-hidden rounded-2xl ${s.card}`}
              >
                <Photo
                  {...item.image}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className={s.photo}
                />
                <div className="p-7 sm:p-9">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${s.chip}`}>
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </span>
                  <h3 className={`mt-5 font-extrabold leading-tight tracking-tight ${s.title}`}>
                    {item.title}
                  </h3>
                  <p className={`mt-3 max-w-lg leading-relaxed ${s.text}`}>{item.description}</p>
                  <Button href={item.href} variant={s.button} className="mt-6">
                    {item.cta}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
