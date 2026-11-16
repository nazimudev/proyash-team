import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { links } from "@/data/site";
import { getLatestProjects } from "@/services/projectService";

function ProjectCard({ project, featured = false }) {
  const date = project.published_at
    ? new Date(project.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <article
      className={`group flex overflow-hidden rounded-2xl border border-forest/10 bg-white ${
        featured ? "h-full flex-col" : "flex-col sm:flex-row"
      }`}
    >
      <Photo
        src={project.cover.src}
        alt={project.cover.alt}
        sizes={
          featured
            ? "(min-width: 1024px) 700px, 100vw"
            : "(min-width: 640px) 220px, 100vw"
        }
        className={
          featured
            ? "aspect-16/11 lg:aspect-auto lg:min-h-80 lg:flex-1"
            : "aspect-16/10 sm:aspect-auto sm:w-[40%] sm:shrink-0"
        }
      />

      <div className={featured ? "p-7 sm:p-9" : "p-6"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">
            {project.category_name}
          </span>
        </div>

        <h3
          className={`mt-4 font-extrabold leading-tight tracking-tight text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>

        {date && (
          <time
            dateTime={project.published_at}
            className="mt-3 block text-sm text-muted"
          >
            {date}
          </time>
        )}

        <Button
          href={`/projects/${project.slug}`}
          variant="link"
          className="mt-5"
        >
          Read story
        </Button>
      </div>
    </article>
  );
}

export default async function FeaturedProjectsSection() {
  let projects = [];

  try {
    projects = await getLatestProjects();
  } catch (error) {
    console.error("Featured projects error:", error);
    return null;
  }

  if (!projects.length) return null;

  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Projects and stories"
            title="Every Effort Tells a Story"
          >
            Discover the latest projects and community initiatives from Proyash
            Songgothon.
          </SectionHeading>

          <Button
            {...links.projects}
            variant="outline"
            className="shrink-0 self-start md:self-auto"
          >
            Explore All Projects
          </Button>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProjectCard project={featured} featured />
          </div>

          {rest.length > 0 && (
            <div className="flex flex-col gap-6 lg:col-span-5">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
