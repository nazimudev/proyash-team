import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { galleryItems, links } from "@/data/site";

/* Layout lives here, content lives in data: first photo is the large feature,
   the other four tile a 2 x 2 block beside it (4 columns x 2 rows on md+). */
const spans = [
  "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto",
  "aspect-square md:aspect-auto",
  "aspect-square md:aspect-auto",
  "aspect-square md:aspect-auto",
  "aspect-square md:aspect-auto",
];

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Gallery" title="Moments That Bring Us Together" />
          <Button {...links.gallery} variant="outline" className="shrink-0 self-start md:self-auto">
            View Full Gallery
          </Button>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[15rem] md:grid-cols-4 lg:auto-rows-[17rem]">
          {galleryItems.slice(0, 5).map((item, i) => (
            <li key={item.id} className={`group relative overflow-hidden rounded-xl ${spans[i]}`}>
              <Photo
                src={item.src}
                alt={item.alt}
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="absolute inset-0"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
