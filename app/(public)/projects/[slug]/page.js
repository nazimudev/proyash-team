import { Suspense } from "react";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import ProjectDetails from "@/components/projects/ProjectDetails";
import RelatedProjects from "@/components/projects/RelatedProjects";
import ProjectsCTA from "@/components/projects/ProjectsCTA";
import { getProjectBySlug, getPublishedProjects, getRelatedProjects } from "@/lib/projects";

/*
 * No generateStaticParams on purpose: with Cache Components it may not return an
 * empty array, and the published list starts empty. Detail pages render per
 * request instead; `params` is awaited inside <Suspense> as Next.js recommends.
 */

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found | Proyash Songgothon" };
  return {
    title: `${project.title} | Proyash Songgothon`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default function ProjectPage({ params }) {
  return (
    <Suspense
      fallback={
        <Container className="pb-24 pt-36">
          <p role="status" className="text-muted">Loading project…</p>
        </Container>
      }
    >
      <Project params={params} />
    </Suspense>
  );
}

async function Project({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectDetails project={project} />
      <RelatedProjects projects={getRelatedProjects(project, getPublishedProjects())} />
      <ProjectsCTA />
    </>
  );
}
