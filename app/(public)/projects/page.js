import { Suspense } from "react";
import { connection } from "next/server";

import ProjectsHero from "@/components/projects/ProjectsHero";
import FeaturedProject from "@/components/projects/FeaturedProject";
import ProjectsBrowser from "@/components/projects/ProjectsBrowser";
import ProjectsCTA from "@/components/projects/ProjectsCTA";

import { fetchPublicProjects } from "@/services/projectService";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(
  /\/api\/?$/,
  "",
).replace(/\/$/, "");

export const metadata = {
  title: "Projects | Proyash Songgothon",
  description:
    "Explore Proyash Songgothon's documented projects and initiatives focused on community support, educational support, and environmental activities.",
};

const statuses = [
  { id: "planned", name: "Planned" },
  { id: "in_progress", name: "In Progress" },
  { id: "complete", name: "Completed" },
  { id: "on_hold", name: "On Hold" },
  { id: "cancelled", name: "Cancelled" },
];

async function ProjectsContent() {
  await connection();

  let projects = [];

  try {
    const response = await fetchPublicProjects();

    projects = Array.isArray(response)
      ? response.map((project) => ({
          ...project,

          title: project.name,
          summary: project.description,

          category: project.category_id,
          category_name: project.category?.name || "Uncategorized",

          cover: {
            src:
              project.cover_image_url ||
              (project.cover_image
                ? `${API_URL}/storage/${project.cover_image}`
                : null),
            alt: project.name || "Project cover image",
          },
        }))
      : [];
  } catch (error) {
    console.error("Projects API Error:", error);
  }

  const categories = [
    ...new Map(
      projects
        .filter((project) => project.category)
        .map((project) => [
          project.category,
          {
            id: project.category,
            name: project.category_name,
          },
        ]),
    ).values(),
  ];

  const featured = projects.find((project) => project.is_featured) || null;

  return (
    <>
      {featured && <FeaturedProject project={featured} />}

      <ProjectsBrowser
        projects={projects}
        categories={categories}
        statuses={statuses}
      />
    </>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />

      <Suspense
        fallback={<div className="py-20 text-center">Loading projects...</div>}
      >
        <ProjectsContent />
      </Suspense>

      <ProjectsCTA />
    </>
  );
}
