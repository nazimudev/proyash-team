import ProjectsHero from "@/components/projects/ProjectsHero";
import FeaturedProject from "@/components/projects/FeaturedProject";
import ProjectsBrowser from "@/components/projects/ProjectsBrowser";
import ProjectsCTA from "@/components/projects/ProjectsCTA";
import { getProjectsData } from "@/lib/projects";

export const metadata = {
  title: "Projects | Proyash Songgothon",
  description:
    "Explore Proyash Songgothon's documented projects and initiatives focused on community support, educational support, and environmental activities.",
};

export default function ProjectsPage() {
  const { projects, featured, categories, statuses } = getProjectsData();

  return (
    <>
      <ProjectsHero />
      {featured && <FeaturedProject project={featured} />}
      <ProjectsBrowser projects={projects} categories={categories} statuses={statuses} />
      <ProjectsCTA />
    </>
  );
}
