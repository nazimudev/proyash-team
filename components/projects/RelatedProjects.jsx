import Container from "@/components/ui/Container";
import ProjectCard from "@/components/projects/ProjectCard";

export default function RelatedProjects({ projects }) {
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="bg-mist py-16 sm:py-20">
      <Container>
        <h2 id="related-heading" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Related Projects</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}><ProjectCard project={p} /></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
