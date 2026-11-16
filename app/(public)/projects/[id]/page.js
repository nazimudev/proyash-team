import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import ProjectDetails from "@/components/projects/ProjectDetails";
import RelatedProjects from "@/components/projects/RelatedProjects";
import ProjectsCTA from "@/components/projects/ProjectsCTA";
export const instant = false;
import {
  fetchPublicProjectById,
  fetchPublicProjects,
} from "@/services/projectService";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const project = await fetchPublicProjectById(id);

    return {
      title: `${project.name} | Proyash Songgothon`,
      description: project.description,
    };
  } catch {
    return {
      title: "Project Not Found | Proyash Songgothon",
    };
  }
}

export default async function ProjectPage({ params }) {
  const { id } = await params;

  let project;

  try {
    project = await fetchPublicProjectById(id);
  } catch {
    notFound();
  }

  let relatedProjects = [];

  try {
    const projects = await fetchPublicProjects();
    relatedProjects = projects
      .filter(
        (item) =>
          item.category_id === project.category_id && item.id !== project.id,
      )
      .slice(0, 3);
  } catch {
    // Related projects are optional.
  }

  return (
    <>
      <ProjectDetails project={project} />
      <RelatedProjects projects={relatedProjects} />
      <ProjectsCTA />
    </>
  );
}
