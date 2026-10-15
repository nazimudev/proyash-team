import Link from "next/link";
import Container from "@/components/ui/Container";

export default function GalleryHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      {/* Decorative: three overlapping leaf-shaped frames in the brand greens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-24 hidden w-104 md:block lg:right-8"
      >
        <div className="leaf-sm ml-auto h-44 w-52 bg-mist" />
        <div className="leaf-sm -mt-16 ml-16 h-44 w-52 bg-forest" />
        <div className="leaf-sm -mt-20 ml-40 h-40 w-44 bg-fresh/70" />
      </div>

      <Container className="relative">
        <p className="mt-10 flex items-center gap-3 text-sm font-bold tracking-wide text-forest">
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          Our gallery
        </p>
        <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Moments That Reflect Our Purpose
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Explore moments from our community initiatives, educational support,
          environmental activities, and efforts to support people in need.
        </p>
      </Container>
    </section>
  );
}
